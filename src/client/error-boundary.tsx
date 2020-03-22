import { NonIdealState } from '@blueprintjs/core';
import React from 'react';

import Logger from '~/components/logger';

const logger = Logger('error-boundary');

// tslint:disable no-empty-interface
interface Props {}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends React.Component<Props> {
  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }
  state: Readonly<State> = {
    hasError: false,
  };

  componentDidCatch(error: any, info: any) {
    // logger.info(info, 'componentDidCatch');
    // logger.error(error, 'componentDidCatch');
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <NonIdealState
          icon="unknown-vehicle"
          title="Oops.. This is not suppose to happen."
          description="Try refreshing your browser and see if this goes away.
            Otherwise, please contact support."
        />
      );
    }

    return this.props.children;
  }
}
