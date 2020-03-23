import React from 'react';
import styled from 'styled-components';

import ApolloLoadingError from '~/components/base/apollo-loading-error';
import Arranger from '~/components/base/arranger';
import StringField from '~/components/base/string-field';

import { useOntarioCasesQuery } from '~/graphql/generated/client';

const Container = styled(Arranger)`
  height: 100%;
`;

const Map = () => {
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

  return (
    <Container direction="column">
      <ul>
        {ontarioCases.map((caseInfo) => (
          <li>{JSON.stringify(caseInfo)}</li>
        ))}
      </ul>
    </Container>
  );
};

export default Map;
