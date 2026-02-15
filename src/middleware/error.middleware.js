const errorHandler = (err, req, res, next) => {

  console.error('🔥 ERROR:', err);

  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    status: err.status || 'error',
    message: err.message || 'Error interno del servidor'
  });
};

module.exports = errorHandler;
