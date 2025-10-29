/**
 * @file SocketContext.jsx
 * @description Provides a singleton Socket.io client instance to the entire React app.
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

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

  useEffect(() => {
    const socketUrl = import.meta.env.VITE_SERVER_URL ?? 'http://localhost:5000';
    const socketInstance = io(socketUrl, {
      withCredentials: true,
      transports: ['websocket', 'polling']
    });

    socketInstance.on('connect', () => setIsConnected(true));
    socketInstance.on('disconnect', () => setIsConnected(false));
    socketInstance.on('connect_error', () => setIsConnected(false));

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
