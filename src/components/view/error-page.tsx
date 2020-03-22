import { Button, NonIdealState } from '@blueprintjs/core';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

const ErrorPage = ({ history }: RouteComponentProps<any>) => (
  <NonIdealState
    icon="offline"
    title="Page Not Found"
    description="This page does not exist"
    action={
      <Button
        icon="circle-arrow-left"
        intent="success"
        text="Go Back"
        onClick={() => history.goBack()}
      />
    }
  />
);

export default ErrorPage;
