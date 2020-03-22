import React from 'react';
import styled from 'styled-components';

interface Props {
  alignContent?:
    | 'center'
    | 'flex-end'
    | 'flex-start'
    | 'space-around'
    | 'space-between';
  alignItems?: 'center' | 'flex-end' | 'flex-start' | 'stretch';
  direction?: 'column' | 'row' | 'row-reverse' | 'column-reverse';

  justify?:
    | 'center'
    | 'flex-end'
    | 'flex-start'
    | 'space-around'
    | 'space-between';
  inline?: string;
  wrap?: string;
  children?: React.ReactNode;
}

const Arranger = styled.div`
  display: flex;

  display: ${(props: Props) => props.inline && 'inline-flex'};
  flex-wrap: ${(props: Props) => props.wrap && 'wrap'};

  align-content: ${(props: Props) => props.alignContent};
  align-items: ${(props: Props) => props.alignItems};
  flex-direction: ${(props: Props) => props.direction || 'row'};
  justify-content: ${(props: Props) => props.justify};
`;

export default Arranger;
