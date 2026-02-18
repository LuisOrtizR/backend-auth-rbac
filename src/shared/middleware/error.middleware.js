const errorHandler = (err, req, res, next) => {

  const statusCode = err.statusCode || 500;

  if (process.env.NODE_ENV !== 'production') {
    console.error('🔥 ERROR:', err);
  }

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Error interno del servidor'
  });
};

module.exports = errorHandler;
