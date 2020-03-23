import axios from 'axios';
import cheerio from 'cheerio';
import dayjs from 'dayjs';
import express from 'express';
import fs from 'fs';
import { oc } from 'ts-optchain';

import { OntarioCase } from '~/graphql/generated/server';
import Mongo from '~/graphql/mongo';
import Logger from '~/server/logger';

const logger = Logger('read-ontario-ca');

type MOntarioCase = Omit<OntarioCase, '_id'>;

/**
 * process table displayed in https://www.ontario.ca/page/2019-novel-coronavirus
 * and upload the result into database
 */
export default async function readOntarioCa() {
  const resp = await axios.get(
    'https://api.ontario.ca/api/drupal/page%2F2019-novel-coronavirus?fields=body'
  );
  const body = oc(resp).data.body.und[0].safe_value('');
  // const body = fs.readFileSync('../test-corona/body.txt', 'utf8');

  // Parse each table entry
  const $ = cheerio.load(body);

  // Extract date by looking for:
  // Case information below may be updated as Public Health Units complete
  // their investigations as of March 22, 2020 at 10:30 a.m. ET
  let caseDate = new Date();
  $('h3 + p').each((idx, pElem) => {
    const p = $(pElem).text();
    const prefix =
      'Case information below may be updated as Public Health Units complete their investigations as of ';
    if (p.startsWith(prefix)) {
      const str = p.substr(prefix.length); // 'March 21, 2020 at 10:30 a.m. ET'

      const atIdx = str.indexOf(' at');
      if (atIdx !== -1) {
        const dateStr = str.substr(0, atIdx);
        caseDate = dayjs(dateStr, 'MMMM D, YYYY').toDate();
      }
    }
  });

  const mongoResults: Array<Promise<any>> = [];

  // Loop through each table
  $('table.full-width').each((tableIdx, tableElem) => {
    const caseFile: MOntarioCase[] = [];

    // Loop through each row
    $('tbody > tr', tableElem).each((rowIdx, rowElem) => {
      const row: MOntarioCase = {
        date: caseDate,
      };
      // Loop through each column
      $('td', rowElem).each((colIdx, colElem) => {
        const colData = $(colElem)
          .text()
          .trim();
        switch (colIdx) {
          case 0:
            row.caseNo = parseInt(colData, 10);
            break;
          case 1:
            row.patient = colData;
            break;
          case 2:
            row.location = colData;
            break;
          case 3:
            row.transmission = colData;
            break;
          case 4:
            row.status = colData;
            break;
        }
      });

      caseFile.push(row);
    });

    // Save the casefiles to mongoDB
    const { collection } = Mongo.ontarioCase();
    const mongoOp = collection.then((col) =>
      col.bulkWrite(
        caseFile.map((caseInfo) => ({
          updateOne: {
            filter: { caseNo: caseInfo.caseNo },
            update: caseInfo,
            upsert: true,
          },
        }))
      )
    );
    mongoResults.push(mongoOp);
  });

  // Wait for all results to be returned
  const res = await Promise.all(mongoResults)
    .then((results) => results.map(({ result }) => result))
    .catch((err) => {
      throw err;
    });

  logger.info(res);
  return res;
}
