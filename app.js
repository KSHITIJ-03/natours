const express = require("express")
const fs = require("fs")
const app = express()

app.use(express.json())  // middleware

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

app.get("/api/v1/tours", (req, res)=>{
    res.status(200).json({
        status: "success",
        results: tours.length,
        data: {
            tours: tours
        }
    })
    console.log(tours);
})

app.post("/api/v1/tours", (req, res)=>{
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
})

app.get("/api/v1/tours/:id", (req, res)=>{
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
})