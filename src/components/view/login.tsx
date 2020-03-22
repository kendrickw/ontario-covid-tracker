import { Button, Dialog } from '@blueprintjs/core';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import styled from 'styled-components';

import { actions, selectors } from '~/reducers';

import Arranger from '~/components/base/arranger';
import Spacer from '~/components/base/spacer';
import StringField from '~/components/base/string-field';

const StyledStringField = styled(StringField)`
  width: 100%;
`;

const LoginButtonContainer = styled(Arranger)`
  align-self: flex-start;
`;

const { getUser, getMsg } = selectors.userSelectors;
const { login } = actions.userActions;

type Props = RouteComponentProps<any>;

const LoginModal = ({ history }: Props) => {
  const user = useSelector(getUser);
  const msg = useSelector(getMsg);
  const dispatch = useDispatch();
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');

  React.useEffect(() => {
    if (user) {
      history.goBack();
    }
  }, [user]);

  const doLogin = (evt: React.MouseEvent) => {
    dispatch(login(username, password));
    evt.preventDefault();
  };

  const onUsernameChange = (evt: React.FormEvent<HTMLInputElement>) =>
    setUsername(evt.currentTarget.value);

  const onPasswordChange = (evt: React.FormEvent<HTMLInputElement>) =>
    setPassword(evt.currentTarget.value);

  return (
    <Dialog
      icon="log-in"
      title="Log In"
      isOpen
      autoFocus
      isCloseButtonShown={false}
      canEscapeKeyClose={false}
      canOutsideClickClose={false}
    >
      <Spacer as="form" horizontal="xs" vertical="xs">
        <Arranger direction="column" alignItems="center">
          <StyledStringField
            value={username}
            onChange={onUsernameChange}
            label="username"
            labelFor="login-username"
          />
          <StyledStringField
            value={password}
            onChange={onPasswordChange}
            label="password"
            labelFor="login-password"
            type="password"
          />
          <Spacer bottom="xs" />
          <LoginButtonContainer alignItems="center">
            <Button
              intent="primary"
              icon="log-in"
              text="login"
              type="submit"
              onClick={doLogin}
            />
            <Spacer right="xs" />
            {msg}
          </LoginButtonContainer>
        </Arranger>
      </Spacer>
    </Dialog>
  );
};

export default LoginModal;
