import React from 'react';

/**
 * Keep reference of prop or state variable
 * Primarily for use within callback functions to access the latest
 * prop/state value.
 * See: https://reactjs.org/docs/hooks-faq.html#why-am-i-seeing-stale-props-or-state-inside-my-function
 *
 * @param value prop or state to track
 */
export default function useTracker<T>(value: T) {
  const ref = React.useRef(value);

  // Store current value in ref
  React.useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref;
}
