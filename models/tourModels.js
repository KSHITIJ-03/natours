const mongoose = require("mongoose")
const slugify = require("slugify")
const validator = require("validator")
const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: [true, "A tour must have a name"],
        trim: true,
        minLength: [10, "A tour must have length more than 10"],
        maxLength: [40, "A tour must have length less than 40"],
        validate: [validator.isAlpha, "A tour must contain only alphabets"]
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
        required: [true, "A tour must have a diffculty"],
        enum: {
            values: ["easy", "medium", "difficult"],
            message: "A tour can only be easy, medium or difficult"
        }
    },
    ratingAverage: {
        type: Number,
        default: 4.5,
        min: [1, "A rating must be greater then 1.0"],
        max: [5, "A rating must be less then 5.0"]
    },
    ratingQuantity: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: [true, "A tour must have a number"]
    },
    ////////////////////////////////////   making built in validator to check weather priceDiscount is less then price or not
    ////////////////////////////////////   a validate property is used which have a real callback funtion returns true ot false
    ////////////////////////////////////   function will have this operator which will point to the current document
    priceDiscount:{ 
        type: Number,
        // validate: function(val){
        //     return val < this.price
        // }

        // with message
        
        // this can be done by the array method [ validator, message ]
        // this validator function is not going to work on update
        // only works for new documents created
        validate: {
            validator: function(val){
                return val < this.price
            },
            message: "discount price should be less then price"
        }
    },
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
        default: Date.now(),
        select: false   // this attribute will be hiddden from the client
    },
    secretTour: {
        type: Boolean,
        default: false
    },
    startDates: [Date]
},
{
    toJSON: { virtuals: true},
    toObject: { virtuals: true}
})

///////////////  virtual schema ///////

// this is used to add some of the attributes that are not stored in database
// but are used to display on some get calls eg :- want to convert months to weeks and show them as attributes of the documents
// these properties are not the part of the database
tourSchema.virtual("durationWeeks").get(function(){
    return this.duration / 7
})
// this keyword will used to point out the attribute "duration" of every document 
// and divide it by 7


// creating mongoDB middleware //

///////////// DOCUMENT MIDDLEWARE //////////////////

// pre middleware that will act on the documents that are going to be created or saved in the database
// this middleware as can be seen from the name helps to edit the documents before it gts saved

tourSchema.pre("save", function(next){             // save is a hook it holds all the middlewares to it like a hook
                                                   // imagine a hook holding all the middlewares to it
    console.log(this);
    this.slug = slugify(this.name, {lower: true})
    this.name = this.name.toLowerCase()            // name attribute is converted to lowercase before it gets saved :)
    next()                                         // use to call the next pre middleware in the stack
})

tourSchema.pre("save", function(next){
    console.log("just before saving a document");  // another pre middleware hooked to the "save" hook
    next()
})

tourSchema.post("save", function(doc, next){       // this is post middleware hooked to save just after we have saved the document
                                                   // therefore it will be having another parameter which will contain the saved document
    console.log(doc);                              // doc will have the document with changes done in the pre middleware
    next()
})

/////////////  QUERY MIDDLEWARE /////////////////////////////

// it also have pre and post middlewares hooked to some query and here the this keyword will point to query

tourSchema.pre(/^find/, function(next){                // /^hello/ all the expressions or query starting with hello
    this.find({secretTour: {$ne: true}})              // here query is edited with a condition
    next()
})

tourSchema.post(/^find/, function(docs, next){      // docs contains all the documents returned by the query
    console.log(docs);
    next()
})

//////////////////// AGGREGATION MIDDLEWARE //////////////////

tourSchema.pre("aggregate", function(next){

    // to filter out the secretTour from our pipleline we have to add match at the begining of the pipeline array
    // it can be done by using unshift operator
    // this.pipeline() provides the whole array

    //console.log(this.pipeline());

    this.pipeline().unshift({$match: {secretTour: {$ne: true}}})

    console.log(this.pipeline());

    next()
})

const Tour = mongoose.model("Tour", tourSchema)

module.exports = Tour