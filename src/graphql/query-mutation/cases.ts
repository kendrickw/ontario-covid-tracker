import gql from 'graphql-tag';

export const QUERY_ONTARIO_CASES = gql`
  query OntarioCases {
    ontarioCases {
      _id
      date
      caseNo
      patient
      location
      transmission
      status
    }
  }
`;
