/**
 * Request Logging Middleware
 * Logs HTTP requests with timestamp and details
 */
export const requestLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const path = req.path;
  const userAgent = req.get('user-agent');

  console.log(`[${timestamp}] ${method} ${path} - ${userAgent}`);

  // Log the response time
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    const statusCode = res.statusCode;
    console.log(`[${timestamp}] ${method} ${path} - ${statusCode} (${duration}ms)`);
  });

  next();
};
