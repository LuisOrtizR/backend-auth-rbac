const AppError = require('../utils/AppError');

const validate = (schema, property = 'body') => {
  return (req, res, next) => {
    try {
      const validatedData = schema.parse(req[property]);
      req[property] = validatedData;
      next();
    } catch (error) {
      next(new AppError('Error de validación', 400));
    }
  };
};

module.exports = validate;
