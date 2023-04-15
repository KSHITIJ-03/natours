const express = require("express")
const router = express.Router()

// using express.router to a way to organize your
// Express application such that your primary app.js file does not become bloated 
// and difficult to reason about. 

// here we are creating a sub application which takes "/api/v1/tours" as "/" and instead of app
// we will be using tourRouter as our new sub application
const fs = require("fs")

const tours = JSON.parse(fs.readFileSync(__dirname + "/../dev-data/data/tours-simple.json"))

const getAllTours = (req, res)=>{
    console.log(req.requestTime);
    res.status(200).json({
        status: "success",
        results: tours.length,
        request_made_at: req.requestTime, 
        data: {
            tours: tours
        }
    })
    console.log(tours);
}

const createNewTour = (req, res)=>{
    const newTour = req.body
    console.log(newTour);
    const id = tours[tours.length - 1].id + 1
    const obj = Object.assign({id: id}, newTour)    // assigning another field to the object
    tours.push(obj)
    fs.writeFile(__dirname + "/dev-data/data/tours-simple.json", JSON.stringify(tours), err=>{
        if(err) console.log(err);
        else{
            res.status(201).json({
                status: "success",
                data: {
                    tours: obj
                }
            })
        }
    })
}

const getOneTour = (req, res)=>{
    // params make a object of all the parameters/variables of url
    //const tours = JSON.parse(__dirname + "/dev-data/data/tours-simple.json")
    const id = req.params.id * 1
    if(id > tours.length){
        return res.status(404).json({
            status: "fail",
            message: "invalid id"
        })
    }
    const tour = tours.find(el => el.id === id)
    res.status(200).json({
        status: "success",
        data : {
            tours: tour
        }
    })
}

const updateTour = (req, res)=>{
    const id = req.params.id * 1                 // converting it to number
    const tour = tours.find(el => el.id === id)  // it returns true or false
    if(!tour){
        return res.status(404).json({
            status: "fail",
            message: "invalid id"
        })
    }
        res.status(200).json({
            status: "success",
            message: "<tour updated here...>"
        })
}

const deleteTour = (req, res)=>{
    const id = req.params.id * 1
    const tour = tours.find(el => el.id === id)
    if(!tour){
        res.status(404).json({
            status: "fail",
            message: "invalid id"
        })
    }
    res.status(204).json({
        status: "success",
        message: "tour deleted successfully",
        data: null
    })
}

router
   .route("/")
   .get(getAllTours)
   .post(createNewTour)

router
   .route("/:id")
   .get(getOneTour)
   .patch(updateTour)
   .delete(deleteTour)

module.exports = router