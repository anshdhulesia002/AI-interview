const sanitizeValue = (data) => {
  if (typeof data === 'string') {
    // Strip NoSQL MongoDB operators ($where, $gt, $ne, etc.)
    return data.replace(/\$/g, '');
  }

  if (Array.isArray(data)) {
    return data.map(sanitizeValue);
  }

  if (data && typeof data === 'object') {
    const cleanObject = {};
    for (const key of Object.keys(data)) {
      const cleanKey = key.replace(/\$/g, '').replace(/\./g, '');
      cleanObject[cleanKey] = sanitizeValue(data[key]);
    }
    return cleanObject;
  }

  return data;
};

export const sanitizeMiddleware = (req, _res, next) => {
  if (req.body) {
    req.body = sanitizeValue(req.body);
  }
  if (req.query) {
    req.query = sanitizeValue(req.query);
  }
  if (req.params) {
    req.params = sanitizeValue(req.params);
  }
  next();
};

export default sanitizeMiddleware;
