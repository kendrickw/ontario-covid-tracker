import { Drawer, Position } from '@blueprintjs/core';
import React from 'react';
// import styled from 'styled-components';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const Menu = ({ isOpen, onClose }: Props) => {
  return (
    <Drawer
      isOpen={isOpen}
      title="Menu"
      size="200px"
      position={Position.LEFT}
      onClose={onClose}
    />
  );
};

export default Menu;
