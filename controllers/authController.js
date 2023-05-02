const User  = require("./../models/userModels")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")

const signToken = async (id) =>{
    return jwt.sign({id: id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })
}

exports.signUp = async (req, res, next) =>{
    try{
        /*
        const newUser = await User.create(req.body) // this req.body will provide body that a user 
                                                    // enters well as all the other information
                                                    // stored in browser at that time
                                                    // so like this any one can simply register them
                                                    // as admin */
        const newUser = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            passwordConfirm: req.body.passwordConfirm
        })
        const token = await signToken(newUser._id)
        res.status(201).json({
          status: "success",
          token: token,
          data: {
              user: newUser
          }
        })
    }catch(err){
        res.status(404).json({
            status: "fail",
            data: {
                user: null,
                message: err
            }
        })
    }
    next()
}

exports.login = async (req, res, next) =>{
    const email = req.body.email
    const password = req.body.password

    if(!email || !password){
        res.status(400).json({
            status: "fail",
            message: "please provide a email and passowrd"
        })
       return next()
    }

    const user = await User.findOne({email: email}).select("+password")    // find will give you array
                                                                           // findOne will give you object
                                                                           // methods function will work on object
    console.log(user);
    //if(bycrypt.hash(password, 12) === )

    const correct = await user.correctPassword(password, user.password)    // if use array by find method then use user[0]
    if(!user || !correct){
        res.status(401).json({
            status: "unauthorized",
            message: "incorrect email or password"
        })
        return next()
    }

    const token = await signToken(user._id)
    res.status(200).json({
        status: "success",
        token
    })
    next()
}

// 1) getting token and check of it's there
// 2) verification of token
// 3) check if user still exists
// 4) check if user changed password after the token was issued

exports.protect = async (req, res, next) =>{
    try{
        next()
    } catch(err){
        console.log(err)
        next()
    }
}