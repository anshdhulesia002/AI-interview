import { Server } from 'socket.io';

let ioInstance = null;

export const initSocket = (httpServer) => {
  ioInstance = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
    },
  });

  ioInstance.on('connection', (socket) => {
    // console.log('⚡ Socket.io Candidate Connected:', socket.id);

    socket.on('join_user_room', (userId) => {
      if (userId) {
        socket.join(`user_${userId}`);
        // console.log(`Candidate ${userId} joined room user_${userId}`);
      }
    });

    socket.on('disconnect', () => {
      // console.log('Candidate Socket Disconnected:', socket.id);
    });
  });

  return ioInstance;
};

export const getIO = () => {
  if (!ioInstance) {
    throw new Error('Socket.io instance has not been initialized!');
  }
  return ioInstance;
};

export const sendLiveNotification = (userId, notificationData) => {
  if (ioInstance) {
    ioInstance.to(`user_${userId}`).emit('new_notification', notificationData);
  }
};
