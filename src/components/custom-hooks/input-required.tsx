import _ from 'lodash';
import React from 'react';

function isValid(isRequired: boolean, value?: string) {
  if (isRequired) {
    return !_.isEmpty(value);
  }
  return true;
}

type ReturnT = [boolean, (val?: string) => void];

/**
 * react-hook: Validates if a required field is non-empty
 *
 * @param isRequired is Input Field required to have a value
 * @param value value to validate
 * @returns a tuple:
 * - `valid` - a state variable indicating if field is non-empty
 * - `setValue` - takes an input value, and update `valid`
 */
export default function useInputRequired(
  isRequired: boolean,
  value?: string
): ReturnT {
  const [valid, setValid] = React.useState(isValid(isRequired, value));

  const setValue: ReturnT[1] = (newVal) =>
    setValid(isValid(isRequired, newVal));

  React.useEffect(() => {
    setValue(value);
  }, [isRequired]);

  return [valid, setValue];
}
