import {
  Classes,
  FormGroup,
  IFormGroupProps,
  IInputGroupProps,
  Intent,
} from '@blueprintjs/core';
import classnames from 'classnames';
import 'cleave.js/dist/addons/cleave-phone.ca';
import Cleave from 'cleave.js/react';
import React from 'react';

import useInputRequired from '../custom-hooks/input-required';

type InputAttributes = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  keyof IInputGroupProps
>;

// Replace the defaultValue that accepts string, with one that accepts number
type CustomIInputGroupProps = Omit<IInputGroupProps, 'defaultValue'>;

interface Props
  extends IFormGroupProps,
    CustomIInputGroupProps,
    InputAttributes {
  isRequired?: boolean;
  defaultValue?: number | string;
  onInputBlur?: (val: string) => void;
  cleaveOpts?: object; // cleave options
}

const MaskedField = ({
  className,
  intent,
  helperText,
  inline,
  label,
  labelFor,
  labelInfo,
  leftIcon,
  value,
  isRequired,
  onBlur,
  defaultValue,
  onInputBlur = () => null,
  cleaveOpts,
  ...otherProps
}: Props) => {
  const defaultValueStr =
    typeof defaultValue === 'number'
      ? defaultValue.toString()
      : defaultValue || '';

  const [valid, setValue] = useInputRequired(
    !!isRequired && !otherProps.disabled,
    defaultValueStr
  );
  const customOnChange = (evt: React.FormEvent<HTMLInputElement>) => {
    setValue(evt.currentTarget.value);
    if (otherProps.onChange) {
      otherProps.onChange(evt);
    }
  };
  const registerValue = (event: any) => {
    // formatted pretty value: event.target.value
    // raw value: event.target.rawValue
    onInputBlur(event.target.rawValue);
    if (onBlur) {
      onBlur(event);
    }
  };

  let cleaveOptions;
  switch (leftIcon) {
    case 'dollar':
      cleaveOptions = {
        numeral: true,
        stripLeadingZeroes: true,
        numeralDecimalScale: 0,
        numeralThousandsGroupStyle: 'thousand',
      };
      break;

    case 'percentage':
      cleaveOptions = {
        numeral: true,
        stripLeadingZeroes: true,
        numeralPositiveOnly: true,
        numeralIntegerScale: 3,
        numeralDecimalScale: 2,
      };
      break;

    case 'phone':
      cleaveOptions = {
        phone: true,
        phoneRegionCode: 'CA',
      };
      break;

    default:
      cleaveOptions = {
        numeral: true,
        stripLeadingZeroes: false,
        numeralThousandsGroupStyle: 'none',
        numeralDecimalScale: 0,
      };
  }

  const customIntent = valid ? intent : 'danger';

  return (
    <FormGroup
      className={className}
      helperText={valid ? helperText : 'Must specify a value'}
      intent={customIntent}
      inline={inline}
      label={label}
      labelFor={labelFor}
      labelInfo={labelInfo}
    >
      <div
        className={classnames(Classes.INPUT_GROUP, {
          [Classes.INTENT_DANGER]: customIntent === Intent.DANGER,
        })}
      >
        {leftIcon && (
          <span className={`${Classes.ICON} ${Classes.ICON}-${leftIcon}`} />
        )}
        <Cleave
          id={labelFor}
          className={Classes.INPUT}
          value={(value && value.toString()) || defaultValueStr || ''}
          options={cleaveOpts || cleaveOptions}
          onBlur={registerValue}
          {...otherProps}
          onChange={customOnChange}
        />
      </div>
    </FormGroup>
  );
};

export default MaskedField;
