import axios from 'axios';
import cheerio from 'cheerio';
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

  // Loop through each table
  await $('table.full-width').each(async (tableIdx, tableElem) => {
    const caseFile: MOntarioCase[] = [];

    // Loop through each row
    $('tbody > tr', tableElem).each((rowIdx, rowElem) => {
      const row: MOntarioCase = {
        date: new Date(),
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

    const { collection } = Mongo.ontarioCase();
    const col = await collection;
    const { result } = await col.bulkWrite(
      caseFile.map((caseInfo) => ({
        updateOne: {
          filter: { caseNo: caseInfo.caseNo },
          update: caseInfo,
          upsert: true,
        },
      }))
    );

    logger.info(result);
    if (!result.ok) {
      throw new Error(result);
    }
  });

  return true;
}
