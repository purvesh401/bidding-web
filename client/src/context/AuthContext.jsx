/**
 * @file AuthContext.jsx
 * @description React context providing global authentication state and helper functions.
 */

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api.js';

const AuthContext = createContext(undefined);

/**
 * @function useAuth
 * @description Convenience hook that exposes authentication context values.
 * @returns {{ authUser: any, isLoading: boolean, login: Function, register: Function, logout: Function, setAuthUser: Function }}
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthContextProvider');
  }
  return context;
};

/**
 * @component AuthContextProvider
 * @description Wraps children with authentication state management.
 * @param {{ children: React.ReactNode }} props - React props.
 * @returns {JSX.Element}
 */
export const AuthContextProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * @function fetchCurrentUser
   * @description Retrieves the currently authenticated user from the backend.
   * @returns {Promise<void>}
   */
  const fetchCurrentUser = useCallback(async () => {
    try {
      const response = await api.get('/auth/me');
      setAuthUser(response.data.user);
    } catch (error) {
      setAuthUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  /**
   * @function login
   * @description Authenticates the user and stores profile data in context state.
   * @param {{ email: string, password: string }} credentials - Login payload.
   * @returns {Promise<{ success: boolean, message?: string }>}
   */
  const login = useCallback(async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      setAuthUser(response.data.user);
      toast.success('Logged in successfully.');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Unable to log in.';
      toast.error(message);
      return { success: false, message };
    }
  }, []);

  /**
   * @function register
   * @description Creates a new user account and authenticates immediately.
   * @param {{ username: string, email: string, password: string, role: string }} payload - Registration payload.
   * @returns {Promise<{ success: boolean, message?: string }>}
   */
  const register = useCallback(async (payload) => {
    try {
      const response = await api.post('/auth/register', payload);
      setAuthUser(response.data.user);
      toast.success('Account created successfully.');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Unable to register.';
      toast.error(message);
      return { success: false, message };
    }
  }, []);

  /**
   * @function logout
   * @description Clears the authentication cookie and local state.
   * @returns {Promise<void>}
   */
  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout');
      setAuthUser(null);
      toast.info('Logged out successfully.');
    } catch (error) {
      setAuthUser(null);
      toast.warn('Session cleared locally.');
    }
  }, []);

  const contextValue = {
    authUser,
    isLoading,
    login,
    register,
    logout,
    setAuthUser
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};
