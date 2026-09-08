const fs = require('fs');
const {getAllTours,getTour,createTour,updateTour,deleteTour}=require('../controllers/tourController');
const express = require('express');

const Router=express.Router();

Router.route('/').get(getAllTours).post(createTour);
Router.route("/:id").get(getTour).patch(updateTour).delete(deleteTour);

module.exports = Router;