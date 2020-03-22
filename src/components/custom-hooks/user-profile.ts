import { useSelector } from 'react-redux';

import { selectors } from '~/reducers';

const { getUser } = selectors.userSelectors;

/**
 * Convenient method to return the current user profile
 *
 * A hook to access the user profile in the redux store's state.
 */
export default function useUserProfile() {
  return useSelector(getUser);
}
