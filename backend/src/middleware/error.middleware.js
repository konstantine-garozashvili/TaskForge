/**
 * Central error handling middleware.
 * Any error thrown/passed with next(err) ends up here.
 */
// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const message = status === 500 ? 'Internal Server Error' : err.message;

  if (status === 500) {
    console.error(err);
  }

  res.status(status).json({ error: message });
};

/**
 * 404 handler for unknown routes.
 */
export const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.status = 404;
  next(error);
};
