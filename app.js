const express = require("express")
const fs = require("fs")
const morgan = require("morgan")
const app = express()

app.use(express.json())  // middleware

// making new my middleware :- custom functions that passes (req, res) within itself to manipulate them 
// they occurs in middle of the request and response between the server
// order of middleware plays important role
// middleware can be used with the use function // that's how express knows that we are usning a middlware
// all the other things can be seen in my notes of screenshots

app.use((req, res, next) => {
    console.log("hello from the middlware");
    next() // to pass it to the next middleware or to the final response
           // if we do not put the next function then the cyclwill stuck at this middleware and any api call will 
           // not be further passed and will not be finished
           // middleware should come before the route handler to enjoy the middleware :)
})

app.use((req, res, next) => {
    console.log("from the another middleware this middleware will add some new things to the req parameter");
    req.requestTime = new Date().toISOString()
    next()
})

// all the middleare have this type of function only with these parameters as shown above

// morgan is a login middleware we can see its build and code on github or in its documentation
// that it also follows the same function as above with the same parameters

app.use(morgan("dev")) // it shows all the data of the api call eg:- url, code, time of reaction etc

app.listen(3000, ()=>{
    console.log("server running on port 3000");
})

// app.get("/", (req, res)=>{
//     res.send("Hi from the server side")
//     res.json({message: "server"})
// })

// app.post("/", (req, res)=>{
//     res.send("hello")
// })

const tours = JSON.parse(fs.readFileSync(__dirname + "/dev-data/data/tours-simple.json"))

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

const getALLUsers = (req, res)=>{
    res.status(500).json({                   // 500 for server internal error
        status: "error",
        message: "<this route is under construction...>"
    })
}

const getOneUser = (req, res)=>{
    res.status(500).json({                   // 500 for server internal error
        status: "error",
        message: "<this route is under construction...>"
    })
}

const createNewUser = (req, res)=>{
    res.status(500).json({                   // 500 for server internal error
        status: "error",
        message: "<this route is under construction...>"
    })
}

const updateOneUser = (req, res)=>{
    res.status(500).json({                   // 500 for server internal error
        status: "error",
        message: "<this route is under construction...>"
    })
}

const deleteUser = (req, res)=>{
    res.status(500).json({                   // 500 for server internal error
        status: "error",
        message: "<this route is under construction...>"
    })
}
// app.get("/api/v1/tours", getAllTours)
// app.post("/api/v1/tours", createNewTour)
// app.get("/api/v1/tours/:id", getOneTour)
// app.patch("/api/v1/tours/:id", updateTour)
// app.delete("/api/v1/tours/:id", deleteTour)


app.route("/api/v1/tours")
   .get(getAllTours)
   .post(createNewTour)

app.route("/api/v1/tours/:id")
   .get(getOneTour)
   .patch(updateTour)
   .delete(deleteTour)

app.route("/api/v1/users")
   .get(getALLUsers)
   .post(createNewUser)

app.route("/api/v1/users/:id")
   .get(getOneUser)
   .patch(updateOneUser)
   .delete(deleteUser)