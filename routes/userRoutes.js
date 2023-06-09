const express = require('express');
const userModels = require("./../models/userModels")
const router = express.Router();
const userController = require('./../controllers/userController');
const authController = require("./../controllers/authController")

// using express.router to a way to organize your
// Express application such that your primary app.js file does not become bloated
// and difficult to reason about.

// same as main application -> const app = express()

// special type of middleware that works on certain routes

//router.param("id", userController.checkID)

router
  .route("/signup")
  .post(authController.signUp, /*userModels.encryption*/) // why i cant access function from userModels

router
  .route("/login")
  .post(authController.login)

router
  .route('/')
  .get(userController.getALLUsers)
  .post(userController.createNewUser);

router
  .route('/:id')
  .get(userController.getOneUser)
  .patch(userController.updateOneUser)
  .delete(userController.deleteUser);

module.exports = router;
