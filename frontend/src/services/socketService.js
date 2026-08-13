import { io } from 'socket.io-client';
import { env } from '../config/env.js';

let socket = null;

export const initSocketClient = (userId) => {
  if (!socket) {
    socket = io(env.socketUrl, {
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
    });

    socket.on('connect', () => {
      // console.log('⚡ Connected to Socket.io WebSockets Engine:', socket.id);
      if (userId) {
        socket.emit('join_user_room', userId);
      }
    });

    socket.on('disconnect', () => {
      // console.log('Disconnected from Socket.io Engine');
    });
  }

  return socket;
};

export const getSocketClient = () => socket;

export const subscribeToNotifications = (callback) => {
  if (socket) {
    socket.on('new_notification', callback);
  }
};

export const unsubscribeFromNotifications = (callback) => {
  if (socket) {
    socket.off('new_notification', callback);
  }
};

export default {
  initSocketClient,
  getSocketClient,
  subscribeToNotifications,
  unsubscribeFromNotifications,
};
