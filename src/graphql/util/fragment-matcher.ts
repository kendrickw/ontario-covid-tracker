import { IntrospectionFragmentMatcher } from 'apollo-cache-inmemory';

import introspectionQueryResultData from '../generated/fragmentTypes.json';

/**
 * For details: See https://www.apollographql.com/docs/react/data/fragments/
 *
 */
const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData,
});

export default fragmentMatcher;
