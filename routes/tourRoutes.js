const fs = require('fs');
const {getAllTours,getTour,createTour,updateTour,deleteTour,checkID,checkBody}=require('../controllers/tourController');
const express = require('express');

const Router=express.Router();


Router.param("id",checkID); // this is a middleware function that can ran only run for the middleware function
 // this is a middleware function that can ran only run for the middleware function

// that can ran only run for the middleware function

// Router.param("id",(req,res,next,val)=>{

// console.log(`Tour id is ${val}`);
// next();

// });

Router.route('/').get(getAllTours).post(checkBody, createTour);
Router.route("/:id").get(getTour).patch(updateTour).delete(deleteTour);

module.exports = Router;