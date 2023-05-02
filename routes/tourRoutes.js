const express = require('express');
const authController = require("./../controllers/authController")
const router = express.Router();
const tourController = require('../controllers/tourController');
const Tour = require('../models/tourModels');
//const {getAllTours, createNewTour, getOneTour, updateTour, deleteTour} = require("./../controllers/tourController")

// using express.router to a way to organize your
// Express application such that your primary app.js file does not become bloated
// and difficult to reason about.

// here we are creating a sub application which takes "/api/v1/tours" as "/" and instead of app
// we will be using tourRouter as our new sub application

// router.param('id', tourController.checkID); // middleware that works on a routes with some special params

// either define the middleware with its whole structure like
// (req, res, next) function

// or just use like app.use("....", ....)

router
  .route("/tour-Stats")
  .get(tourController.getTourStats)
router
  .route("/top-5-tours")
  .get(tourController.topFiveTours, tourController.getAllTours)
router
  .route("/get-monthly-plan/:year")
  .get(tourController.getMonthyPlan)
router
  .route('/')
  .get(authController.protect, tourController.getAllTours) // this shows that getAllTours is a function of tourController, which is a module that is imported
  // it can also written as const {getAllTours, createNewTour, getOneTour, updateTour, deleteTour} =
  // require("./../controllers/tourController")
  .post(/*tourController.checkBody,*/ tourController.createNewTour); // middleware added to check
// valid tour body

router
  .route('/:id')
  .get(tourController.getOneTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
