/**
 * @file useAuth.js
 * @description Convenience hook that exposes authentication helpers outside of context consumers.
 */

import { useAuth } from '../context/AuthContext.jsx';

/**
 * @function useAuthContext
 * @description Wrapper hook re-exporting AuthContext functionality. Separating the hook allows
 * easy refactoring and testing.
 * @returns {ReturnType<typeof useAuth>}
 */
export const useAuthContext = () => useAuth();
