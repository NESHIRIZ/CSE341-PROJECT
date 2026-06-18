// Remove keys that can be used for NoSQL injection (starting with $ or containing .)
const isObject = (val) => val && typeof val === 'object' && !Array.isArray(val);

const sanitizeObject = (obj) => {
  if (!isObject(obj)) return obj;
  const cleaned = {};
  for (const key of Object.keys(obj)) {
    if (key.startsWith('$') || key.includes('.')) continue;
    const value = obj[key];
    if (isObject(value)) {
      cleaned[key] = sanitizeObject(value);
    } else {
      cleaned[key] = value;
    }
  }
  return cleaned;
};

export default function sanitizeMiddleware(req, res, next) {
  try {
    if (req.body) req.body = sanitizeObject(req.body);
    if (req.query) req.query = sanitizeObject(req.query);
    if (req.params) req.params = sanitizeObject(req.params);
  } catch (err) {
    // fail-safe: don't block request on sanitize errors
  }
  next();
}
