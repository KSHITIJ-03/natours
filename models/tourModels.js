const mongoose = require("mongoose")

const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: [true, "A tour must have a name"],
        trim: true
    },
    duration: {
        type: Number,
        required: [true, "A tour must have duration"]
    },
    maxGroupSize: {
        type: Number,
        required: [true, "A tour must have a group size"]
    },
    difficulty: {
        type: String,
        required: [true, "A tour must have a diffculty"]
    },
    ratingAverage: {
        type: Number,
        default: 4.5
    },
    ratingQuantity: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: [true, "A tour must have a number"]
    },
    priceDiscount: Number,
    summary: {
        type: String,
        trim: true
    },
    description: {
        type: String,
        trim : true
    },
    imageCover: {
        type: String,
        required: [true, "A tour must have a cover image"]
    },
    images: [String],  // a array of string
    createdAt: {
        type: Date,
        default: Date.now()
    },
    startDated: [Date]
})

const Tour = mongoose.model("Tour", tourSchema)

module.exports = Tour