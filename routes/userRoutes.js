const express = require("express")
const router = express.Router()

// using express.router to a way to organize your
// Express application such that your primary app.js file does not become bloated 
// and difficult to reason about. 

// same as main application -> const app = express()

const fs = require("fs")

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

router
   .route("/")
   .get(getALLUsers)
   .post(createNewUser)

router
   .route("/:id")
   .get(getOneUser)
   .patch(updateOneUser)
   .delete(deleteUser)

module.exports = router