import {
  Button,
  Menu,
  MenuDivider,
  MenuItem,
  Popover,
  Position,
} from '@blueprintjs/core';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { actions, selectors } from '~/reducers';

const { getUser } = selectors.userSelectors;
const { logout } = actions.userActions;

const AccountMenu = () => {
  const user = useSelector(getUser);
  const dispatch = useDispatch();

  const doLogout = () => dispatch(logout());
  const username = user ? user.username : '';

  return (
    <Menu>
      <MenuDivider title={username} />
      <MenuDivider />
      <MenuItem icon="log-out" text="Logout" onClick={doLogout} />
    </Menu>
  );
};

const AccountButton = () => (
  <Popover content={<AccountMenu />} position={Position.BOTTOM_LEFT}>
    <Button minimal icon="user" />
  </Popover>
);

export default AccountButton;
