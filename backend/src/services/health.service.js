import mongoose from 'mongoose';

export const getSystemHealth = async () => {
  const dbState = mongoose.connection.readyState;
  const dbStateMap = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  return {
    status: dbState === 1 ? 'UP' : 'DEGRADED',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: {
      status: dbStateMap[dbState] || 'unknown',
    },
    memoryUsage: process.memoryUsage(),
  };
};
