const formatTime = () => new Date().toISOString();

export const logger = {
  info: (message, ...args) => {
    console.log(`[${formatTime()}] [INFO]: ${message}`, ...args);
  },
  warn: (message, ...args) => {
    console.warn(`[${formatTime()}] [WARN]: ${message}`, ...args);
  },
  error: (message, ...args) => {
    console.error(`[${formatTime()}] [ERROR]: ${message}`, ...args);
  },
  debug: (message, ...args) => {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[${formatTime()}] [DEBUG]: ${message}`, ...args);
    }
  },
};
