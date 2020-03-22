import { Intent, NonIdealState, Spinner } from '@blueprintjs/core';
import { ApolloError as Error } from 'apollo-client';
import React from 'react';

import Logger from '~/components/logger';

const logger = Logger('apollo-loading-error');

/**
 * Apollo React Client props for loading and error screens
 */
export type ApolloReactProps = ErrorProps & LoadingProps;

interface ErrorProps {
  error?: Error; // apollo error object
}

export const ApolloError = ({ error }: ErrorProps) => {
  if (!error) {
    return null;
  }

  logger.error(error.message);
  const firstError = error.message.split('\n')[0];
  return (
    <NonIdealState
      icon="error"
      title={firstError}
      description="Try refreshing your browser, and try again.
      If it doesn't resolve the issue, please contact support."
    />
  );
};

interface LoadingProps {
  loading?: boolean;
}

export const ApolloLoading = ({ loading }: LoadingProps) =>
  loading ? (
    <NonIdealState
      icon={<Spinner intent={Intent.PRIMARY} />}
      title="Loading data"
      description="Please wait..."
    />
  ) : null;

const ApollogLoadingError = ({ error, loading }: ApolloReactProps) =>
  error ? (
    <ApolloError error={error} />
  ) : loading ? (
    <ApolloLoading loading={loading} />
  ) : null;
export default ApollogLoadingError;
