class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

const errorHandler = (err, req, res, next) => {
  // let error = {...err}
  // error.message = err.message;
  res.status(err.statusCode || 500).json({
    sucess: false,
    error: err.message || 'Server Error'
  });
};
module.exports = {
  AppError,
  errorHandler
};
