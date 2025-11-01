
import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuthContext } from '../hooks/useAuth.js';

const SocketContext = createContext(undefined);

/**
 * @function useSocket
 * @description Hook exposing the socket context.
 * @returns {{ socket: import('socket.io-client').Socket|null, isConnected: boolean }}
 */
export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within SocketContextProvider');
  }
  return context;
};

/**
 * @component SocketContextProvider
 * @description Establishes a Socket.io connection and shares it via context.
 * @param {{ children: React.ReactNode }} props - React props.
 * @returns {JSX.Element}
 */
export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const { authUser, isLoading } = useAuthContext();

  useEffect(() => {
    // TEMPORARY FIX: Disable socket completely to stop the connection loop
    console.log('🚫 Socket connection disabled to prevent connection loops');
    return;

    // TODO: Re-enable socket after fixing authentication issues
    /*
    // Only connect socket if user is authenticated
    if (!authUser || isLoading) {
      // Disconnect if user is not authenticated
      if (socket) {
        console.log('🧹 Disconnecting socket - user not authenticated');
        socket.disconnect();
        setSocket(null);
        setIsConnected(false);
      }
      return;
    }

    // Don't create a new connection if one already exists
    if (socket && socket.connected) {
      return;
    }

    console.log('🔌 Initializing socket connection for authenticated user');
    const socketUrl = import.meta.env.VITE_SERVER_URL ?? 'http://localhost:5000';
    const socketInstance = io(socketUrl, {
      withCredentials: true,
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
      timeout: 20000,
      autoConnect: true
    });

    // Connection event handlers
    socketInstance.on('connect', () => {
      console.log('✅ Socket connected:', socketInstance.id);
      setIsConnected(true);
    });

    socketInstance.on('disconnect', (reason) => {
      console.log('❌ Socket disconnected:', reason);
      setIsConnected(false);
    });

    socketInstance.on('connect_error', (error) => {
      console.error('🔥 Socket connection error:', error.message);
      setIsConnected(false);
    });

    socketInstance.on('reconnect', (attemptNumber) => {
      console.log('🔄 Socket reconnected after', attemptNumber, 'attempts');
      setIsConnected(true);
    });

    socketInstance.on('reconnect_error', (error) => {
      console.error('🔥 Socket reconnection error:', error.message);
    });

    socketInstance.on('reconnect_failed', () => {
      console.error('💥 Socket reconnection failed after all attempts');
      setIsConnected(false);
    });

    setSocket(socketInstance);

    return () => {
      console.log('🧹 Cleaning up socket connection');
      socketInstance.off('connect');
      socketInstance.off('disconnect');
      socketInstance.off('connect_error');
      socketInstance.off('reconnect');
      socketInstance.off('reconnect_error');
      socketInstance.off('reconnect_failed');
      socketInstance.disconnect();
    };
    */
  }, [authUser, isLoading]); // Re-run when auth state changes

  const contextValue = {
    socket,
    isConnected
  };

  return <SocketContext.Provider value={contextValue}>{children}</SocketContext.Provider>;
};
