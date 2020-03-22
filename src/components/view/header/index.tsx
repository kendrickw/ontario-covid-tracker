import { Alignment, Navbar } from '@blueprintjs/core';
import React from 'react';
import styled from 'styled-components';

import AccountButton from './account-button';

interface Props {
  title: string;
  children: React.ReactNode;
}

// compensate for sticky navbar
const ChildWrapper = styled.div`
  padding-top: 50px;
`;

const Header = ({ title, children }: Props) => {
  return (
    <React.Fragment>
      <Navbar fixedToTop>
        <Navbar.Group align={Alignment.LEFT}>
          <Navbar.Heading>COVID-19 Tracker</Navbar.Heading>
          <Navbar.Divider />
          {title}
        </Navbar.Group>
        {/* <Navbar.Group align={Alignment.RIGHT}>
          <Navbar.Divider />
          <AccountButton />
        </Navbar.Group> */}
      </Navbar>
      <ChildWrapper children={children} />
    </React.Fragment>
  );
};

export default Header;
