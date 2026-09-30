class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    // the first argument is for the current error object and the second one is for what class/constructor we use to create the object
    //what is the need of having the constuctor,so for the stack trace it means donot include the AppError as an intersitng place for finding the error
    // "Capture the stack for this object, but don't include the constructor (AppError) itself in the error stack for investigating the error."
    Error.captureStackTrace(this, this.constructor);
  }
}
module.exports = AppError;
