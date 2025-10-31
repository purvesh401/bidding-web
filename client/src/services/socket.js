/**
 * @file socket.js
 * @description Utility for creating a Socket.io client instance. The SocketContext leverages
 * this helper to keep connection setup centralized and easily modifiable during demos.
 */

import { io } from 'socket.io-client';

/**
 * @function createSocketConnection
 * @description Creates a Socket.io client configured with credentials.
 * @returns {import('socket.io-client').Socket}
 */
export const createSocketConnection = () => {
  const serverUrl = import.meta.env.VITE_SERVER_URL ?? 'http://localhost:5000';
  return io(serverUrl, {
    withCredentials: true,
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5,
    timeout: 20000,
    autoConnect: true,
    forceNew: false
  });
};
