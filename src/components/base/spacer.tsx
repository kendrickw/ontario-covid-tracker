import React from 'react';
import styled from 'styled-components';

const spacings = {
  xxxs: '4px',
  xxs: '8px',
  xs: '16px',
  s: '24px',
  m: '32px',
  l: '40px',
  xl: '48px',
  xxl: '56px',
  xxxl: '64px',
};

interface Props {
  left?: keyof typeof spacings;
  right?: keyof typeof spacings;
  top?: keyof typeof spacings;
  bottom?: keyof typeof spacings;
  horizontal?: keyof typeof spacings;
  vertical?: keyof typeof spacings;
}

const Spacer = styled.div`
  margin: 0;
  padding: 0;

  padding-left: ${({ left, horizontal }: Props) =>
    horizontal ? spacings[horizontal] : left ? spacings[left] : null};
  padding-right: ${({ right, horizontal }: Props) =>
    horizontal ? spacings[horizontal] : right ? spacings[right] : null};
  padding-top: ${({ top, vertical }: Props) =>
    vertical ? spacings[vertical] : top ? spacings[top] : null};
  padding-bottom: ${({ bottom, vertical }: Props) =>
    vertical ? spacings[vertical] : bottom ? spacings[bottom] : null};
`;

export default Spacer;
