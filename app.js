const express = require('express');
const morgan = require('morgan');

const app = express();
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const globalErrorHandler = require('./controllers/errorController');
const AppError = require('./utils/appError');
// 1)Middlewares
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
console.log(process.env.NODE_ENV);
app.use(express.json());

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.headers);
  next();
});
// this is directly to serve the file to the browser without any route handler,since there is no need of calculating ,changing or manipulating the file ,we simply serve the files
app.use(express.static(`${__dirname}/public`));
// Route Handlers
// app.get('/api/v1/tours',getAllTours);
// here we can make the parameters optional like /api/v1/tours/:id/:x?
// app.get('/api/v1/tours/:id', getTour);
// app.post('/api/v1/tours',createTour);

// app.patch("/api/v1/tours/:id",updateTour);
// app.delete("/api/v1/tours/:id",deleteTour);

// Routes
// route chaining

// Mounting routers
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.set('query parser', 'extended');
// Reminder->the sequence in which middelwares are called matters a lot=>here if we call  get All Tours then the middleware will not be executed since the response objecct has been already returned but if we call get tour then the middlbeware will be called
// app.use((req, res, next) => {
// console.log('Hello from the middleware');
// next();
// });
// for all verbs we use app.get,app.post,app.patch,app.delete,app.all
app.all('/*splat', (req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message: `Can't find ${req.originalUrl} on this server!`,
  // });
  // const err = new Error(`Can't find ${req.originalUrl} on this server!`);
  // err.status = 'fail';
  // err.statusCode = 404;
  // here we have an error and so that skip the normal middleware and go to the error-handling middleware
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
app.use(globalErrorHandler);
// user routes
// userRouter.route('/').get(getAllUsers).post(createUser);
// userRouter.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);
module.exports = app;
