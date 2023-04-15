const express = require("express")
const router = express.Router()
const tourController = require("./../controllers/tourController")
//const {getAllTours, createNewTour, getOneTour, updateTour, deleteTour} = require("./../controllers/tourController")

// using express.router to a way to organize your
// Express application such that your primary app.js file does not become bloated 
// and difficult to reason about. 

// here we are creating a sub application which takes "/api/v1/tours" as "/" and instead of app
// we will be using tourRouter as our new sub application

router
   .route("/")
   .get(tourController.getAllTours)    // this shows that getAllTours is a function of tourController, which is a module that is imported
                                       // it can also written as const {getAllTours, createNewTour, getOneTour, updateTour, deleteTour} = 
                                       // require("./../controllers/tourController")
   .post(tourController.createNewTour)

router
   .route("/:id")
   .get(tourController.getOneTour)
   .patch(tourController.updateTour)
   .delete(tourController.deleteTour)

module.exports = router