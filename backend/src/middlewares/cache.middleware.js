const memoryCache = new Map();

export const cacheMiddleware = (durationSeconds = 60) => {
  return (req, res, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    const key = `__express__${req.originalUrl || req.url}`;
    const cachedResponse = memoryCache.get(key);

    if (cachedResponse && Date.now() < cachedResponse.expiry) {
      res.setHeader('X-Cache', 'HIT');
      return res.json(cachedResponse.data);
    }

    res.setHeader('X-Cache', 'MISS');
    const originalJson = res.json.bind(res);

    res.json = (body) => {
      memoryCache.set(key, {
        data: body,
        expiry: Date.now() + durationSeconds * 1000,
      });
      return originalJson(body);
    };

    next();
  };
};

export const clearCache = () => {
  memoryCache.clear();
};

export default cacheMiddleware;
