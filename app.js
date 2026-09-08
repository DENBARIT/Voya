const express = require('express');
const morgan = require('morgan');
const app = express();
const tourRouter=require('./routes/tourRoutes');
const userRouter=require('./routes/userRoutes');



// 1)Middlewares
if(process.env.NODE_ENV==="development"){
    app.use(morgan('dev'));
}
console.log(process.env.NODE_ENV);
app.use(express.json());

app.use((req, res, next) => {
req.requestTime = new Date().toISOString();
next();
});


 
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
app.use("/api/v1/tours",tourRouter);
app.use("/api/v1/users",userRouter);


// Reminder->the sequence in which middelwares are called matters a lot=>here if we call  get All Tours then the middleware will not be executed since the response objecct has been already returned but if we call get tour then the middlbeware will be called 
// app.use((req, res, next) => {
// console.log('Hello from the middleware');
// next();   
// });

// user routes
// userRouter.route('/').get(getAllUsers).post(createUser);
// userRouter.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);
module.exports = app;

