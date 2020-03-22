import {
  FormGroup,
  IFormGroupProps,
  IInputGroupProps,
  InputGroup,
} from '@blueprintjs/core';
import React from 'react';

import useInputRequired from '../custom-hooks/input-required';

type InputAttributes = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  keyof IInputGroupProps
>;

interface Props extends IFormGroupProps, IInputGroupProps, InputAttributes {
  isRequired?: boolean;
}

const StringField = ({
  className,
  intent,
  helperText,
  inline,
  label,
  labelFor,
  labelInfo,
  onChange,
  isRequired,
  ...otherProps
}: Props) => {
  const [valid, setValue] = useInputRequired(
    !!isRequired && !otherProps.disabled,
    otherProps.defaultValue
  );
  const customOnChange = (evt: React.FormEvent<HTMLInputElement>) => {
    setValue(evt.currentTarget.value);
    if (onChange) {
      onChange(evt);
    }
  };
  const customIntent = valid ? intent : 'danger';

  return (
    <FormGroup
      className={className}
      intent={customIntent}
      helperText={valid ? helperText : 'Must specify a value'}
      inline={inline}
      label={label}
      labelFor={labelFor}
      labelInfo={labelInfo}
    >
      <InputGroup
        id={labelFor}
        intent={customIntent}
        {...otherProps}
        onChange={customOnChange}
      />
    </FormGroup>
  );
};

export default StringField;
