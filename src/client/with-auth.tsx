import React from 'react';
import { useDispatch } from 'react-redux';
import { Redirect, RouteComponentProps } from 'react-router-dom';

import useUserProfile from '~/components/custom-hooks/user-profile';
import { actions } from '~/reducers';
import authSvc from '~/services/auth';

import Header from '~/components/view/header';

const { set } = actions.userActions;

type Props = RouteComponentProps<any>;

export default (
  title: string,
  WrappedComponent:
    | React.ComponentType<RouteComponentProps<any>>
    | React.ComponentType<any>
) => {
  const WithAuth = (props: Props) => {
    const [authCalled, setAuthCalled] = React.useState(false);
    const user = useUserProfile();
    const dispatch = useDispatch();

    // Authenticate user when the component first mounts
    React.useEffect(() => {
      authSvc
        .getAuthenticatedUser()
        .then((authUser) => dispatch(set(authUser)))
        .catch((err) => {
          dispatch(set(null));
        })
        .then(() => {
          setAuthCalled(true);
        });
    }, []);

    if (!authCalled || !user) {
      // Maybe display a session expired message?
      return <div />;
    }

    return <Header title={title} children={<WrappedComponent {...props} />} />;
  };
  return WithAuth;
};
