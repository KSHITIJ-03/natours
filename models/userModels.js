const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require("bcryptjs")
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "A user must have a name"]
    },
    email: {
        type: String,
        required: [true, "please provide email"],
        unique: true,
        validate: [validator.isEmail, "Please provide a valid email"],
        lowercase: true
    },
    photo: {
        type: String
    },
    password: {
        type: String,
        required: [true, "password is must"],
        minlength: 8,
        select: false
    },
    passwordConfirm:{
        type: String,
        required: true,
        validate: {
            validator: function(val){
                return val === this.password
            },
            message: "both the passwords should be same"
        }
    }
})

// my way of encrypting a password // but how we would know that password here comes just after the save 
                                   // of a document
                                   // therefore my way is rejected and
                                   // document middleware form mongoose with hook save is used
                                   // with pre (function) 
// exports.encryption = async (req, res, next) =>{
//     const password = req.body.password
//     console.log(password);
//     next()
// }

userSchema.pre("save", async function(next){
    if(!this.isModified) return next ()
    this.password = await bcrypt.hash(this.password, 12)  // this will do hashing and salting both
    this.passwordConfirm = undefined      // this is removed since it is only needed at the time of validation
                                          // required only in input
    next()
})

userSchema.methods.correctPassword = async function(candidatePassword, userPassword){
    return await bcrypt.compare(candidatePassword, userPassword)
}
const User = mongoose.model("User", userSchema)

module.exports = User