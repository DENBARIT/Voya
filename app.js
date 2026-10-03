const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const monogoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const app = express();
app.set('query parser', 'extended');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const globalErrorHandler = require('./controllers/errorController');
const AppError = require('./utils/appError');

// Set Security HTTP headers
app.use(helmet());

//Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const limiter = rateLimit({
  max: 50,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/api', limiter);
// console.log(process.env.NODE_ENV);
app.use(express.json({ limit: '10kb' })); //this is to limit the size of the body of the request to 10kb
// Express 5 makes req.query a getter that re-parses the URL on every access, so the
// sanitizers below can't overwrite it. Replace it with a plain writable copy first.
// the parameters that defined property takes are the object req,object property "query",so it sets the value,the new object by spreading the query obj
app.use((req, res, next) => {
  Object.defineProperty(req, 'query', {
    value: { ...req.query },
    writable: true,
    configurable: true,
    enumerable: true,
  });
  next();
});
// remove the dollar signs and dots from the request body,query string and params
app.use(monogoSanitize()); // Data sanitization against NoSQL query injection
app.use(xss()); // Data sanitization against XSS attacks
// prevent parameter pollution=>html parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  }),
);

// / this is directly to serve the file to the browser without any route handler,since there is no need of calculating ,changing or manipulating the file ,we simply serve the files

app.use(express.static(`${__dirname}/public`));
// test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.headers);
  next();
});

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
app.use('/api/v1/reviews', reviewRouter);
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
