const express = require('express');
const fs = require('fs');
const morgan = require('morgan');

const app = express();

module.exports = app;

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

app.use(express.json()); // middleware

app.use(express.static(`${__dirname}/public`));

// making new my middleware :- custom functions that passes (req, res) within itself to manipulate them
// they occurs in middle of the request and response between the server
// order of middleware plays important role
// middleware can be used with the use function // that's how express knows that we are usning a middlware
// all the other things can be seen in my notes of screenshots

app.use((req, res, next) => {
  console.log('hello from the middlware');
  next(); // to pass it to the next middleware or to the final response
  // if we do not put the next function then the cyclwill stuck at this middleware and any api call will
  // not be further passed and will not be finished
  // middleware should come before the route handler to enjoy the middleware :)
});

app.use((req, res, next) => {
  console.log(
    'from the another middleware this middleware will add some new things to the req parameter'
  );
  req.requestTime = new Date().toISOString();
  //console.log(req.headers);
  next();
});

// all the middleare have this type of function only with these parameters as shown above

// morgan is a login middleware we can see its build and code on github or in its documentation
// that it also follows the same function as above with the same parameters

app.use(morgan('dev')); // it shows all the data of the api call eg:- url, code, time of reaction etc

// app.get("/", (req, res)=>{
//     res.send(" Hi from the server side")
//     res.json({message: "server"})
// })

// app.post("/", (req, res)=>{
//     res.send("hello")
// })
// app.get("/api/v1/tours", getAllTours)
// app.post("/api/v1/tours", createNewTour)
// app.get("/api/v1/tours/:id", getOneTour)
// app.patch("/api/v1/tours/:id", updateTour)
// app.delete("/api/v1/tours/:id", deleteTour)
////////////////////////////////////////////////////////////////////////////////////////////
//
//
// using express.router to a way to organize your
// Express application such that your primary app.js file does not become bloated
// and difficult to reason about.

app.use((req, res, next) =>{
  console.log(req.headers);
  next()
})

app.use('/api/v1/tours', tourRouter); // tourRouter work as middleware for this /api/v1/tours route
app.use('/api/v1/users', userRouter); // userRouter work as middleware for this /api/v1/users route

