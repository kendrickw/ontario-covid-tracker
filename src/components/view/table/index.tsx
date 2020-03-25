import loadable from '@loadable/component';
import React from 'react';
import styled from 'styled-components';

import ApolloLoadingError from '~/components/base/apollo-loading-error';
import { useOntarioCasesQuery } from '~/graphql/generated/client';

import 'handsontable/dist/handsontable.full.css';

import Arranger from '~/components/base/arranger';

// To bypass server rendering of component
const Handsontable = loadable(() => import('./handsontable-wrapper'));

const Container = styled(Arranger)`
  height: 100%;
`;

const Table = () => {
  const { loading, error, data } = useOntarioCasesQuery();

  if (loading || error) {
    return <ApolloLoadingError loading={loading} error={error} />;
  }
  if (!data) {
    return null;
  }

  const { ontarioCases } = data;
  if (!ontarioCases) {
    return null;
  }

  const tableData = [
    ['date', 'caseNo', 'patient', 'location', 'transmission', 'status'],
    ...ontarioCases.map((entry) => {
      const { date, caseNo, patient, location, transmission, status } =
        entry || {};
      return [date, caseNo, patient, location, transmission, status];
    }),
  ];

  return (
    <Container direction="column">
      <Handsontable tableData={tableData} />
    </Container>
  );
};

export default Table;
