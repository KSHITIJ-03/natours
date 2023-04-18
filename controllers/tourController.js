const fs = require('fs');
const Tour = require("./../models/tourModels");
const { Query } = require('mongoose');

// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

// exports.checkID = (req, res, next, val) => {
//   // middleware to check valid id
//   console.log(`id is: ${val}`);
//   const id = req.params.id * 1;
//   if (id > tours.length) {
//     return res.status(404).json({
//       status: 'fail',
//       message: 'invalid id',
//     });
//   }
//   next();
// };

// **************************************************************************//
// both these functions are commented because these were used to validate the tour document
// but now these are validated by mongoDB
// all the changes are done to make the CURD operations in our api from mongoDB
// **************************************************************************//

// exports.checkBody = (req, res, next) => {  
//   // middleware to check valid tour details
//   if (!req.body.name || !req.body.price) {
//     return res.status(400).json({
//       status: 'fail',
//       message: 'missing name or price',
//     });
//   }
//   next();
// };

exports.topFiveTours = async (req, res, next) =>{
  try{
    // in this middleware i will just set the limit to 5 ang skip to 0 so that top 5 cheapest tours can be found
    // i will set the req.query.sort to ratingsAverage,price
    req.query.sort = "-ratingAverage, price"
    // req.query.page = 0
    //req.query.skip = 0
    req.query.limit = 5
    req.query.fields = "name, ratingAverage, price, summary, difficulty"
  } catch(err){
    res.status(404).json({
      status: "fail",
      message: err
    })
  }
  next()                   ///// with these updation the updated querry values will be pased to next middleware ////
}

exports.getAllTours = async (req, res) => {
  // console.log(req.requestTime);
  // res.status(200).json({
  //   status: 'success',
  //   results: tours.length,
  //   request_made_at: req.requestTime,
  //   data: {
  //     tours: tours,
  //   },
  // });
  // console.log(tours);
  try{
    //console.log(req.query);
    // some of the querry is not required in the url otherwise they will not give the suitable result
    // to remove them we have to make a hard copy of req.query object
    // since in js if we use const a = b then a will be a reference to b an changes in b will let changes in a
    // therefore we have to destructure the object req.query means all the fields will be loosen and tied again
    // this is done by ...objectname and to make it object again {...objectname}
    const query = req.query
    const newQuery = {...query}
    //console.log(newQuery);

    // { duration: { gte: '5' }, difficulty: 'easy' } => by the req.query
    // { duration: { $gte: "5" }, difficulty: "easy" } => standard way to put the filters in mongoDB find method
    
    const toDeleteQuery = ["page", "sort", "limit", "fields"]
    toDeleteQuery.forEach(el => delete newQuery[el])
    //const tours = await Tour.find(newQuery)
    
    // advanced filtering
    let queryStr = JSON.stringify(newQuery) // let is used to mutate the data

    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match=> "$" + match)
    //console.log(JSON.parse(queryStr));

    // sorting
    let temp_tours = Tour.find(JSON.parse(queryStr))
    
    if(req.query.sort){
      //console.log(req.query.sort);
      // const sortBy = req.query.sort.split(",").join(" ")
      temp_tours.sort(req.query.sort)
      // sort("price ratingAverage") if sort by price is tied then sort by second field
    } else{
      temp_tours.sort("createdAt")
    }

    // field limiting // projection of only certain fields
    if(req.query.fields){
      //console.log(req.query.fields);
      const fields = req.query.fields.split(",").join(" ")
      //console.log(fields);
      temp_tours = temp_tours.select(fields)
    } else{
      temp_tours = temp_tours.select("-__v") // this __v attribute is used by mongoDB internally for its functions
    }
    // paging => if the documents are on many pages then page=2&limit=10 means that url wants to show page no. 2 and on each page 
    // ......... there should be 10 documents eg total 1000 documents if limit=10&page=3 then on each page there should be 10 documents
    // ......... we therefore total 100 pages and we want its page no 3
    const page = req.query.page*1 || 1
    const limit = req.query.limit*1 || 100
    const skip = (page - 1)*limit
    temp_tours = temp_tours.skip(skip).limit(limit)
    if(req.query.page){
      const numTours = await Tour.countDocumnets()
      if(skip >= numTours){
        throw new Error("This page does not exist")
      }
    }
    const tours = await temp_tours
    //const tours = await Tour.find(req.query)
    // const tours = await Tour.find().where("duration").equals(5).where("difficulty").equals("easy")
    // .equals or .lte or .lt etc ...
    res.status(200).json({
    status: "success",
    results: tours.length,
    data: {
      tours
    }
  })
  }catch(err){
    res.status(404).json({
      status: "fail",
      message: err
    })
  }
};

exports.createNewTour = async (req, res) => {
  // const newTour = req.body;
  // console.log(newTour);
  // const id = tours[tours.length - 1].id + 1;
  // const obj = { id: id, ...newTour }; // assigning another field to the object
  // tours.push(obj);
  // fs.writeFile(
  //   `${__dirname}/../dev-data/data/tours-simple.json`,
  //   JSON.stringify(tours),
  //   (err) => {
  //     if (err) console.log(err);
  //     else {
  //       res.status(201).json({
  //         status: 'success',
  //         data: {
  //           tours: obj
  //         },
  //       });
  //     }
  //   }
  // );
  //Tour.create({}).then()  // it is a promise therefore return the data after resolving
                          // but here we will be using async/await
  
  try{
    const newTour = await Tour.create(req.body)
    res.status(201).json({
    status: "status",
    data: {
      tours: newTour
    }
  })
  }catch(err){  // err will generally come if promise is rejected or the newTour created 
                // contains bad items
    res.status(400).json({
      status: "fail",
      message: err
    })

  }
};

exports.getOneTour = async (req, res) => {
  // params make a object of all the parameters/variables of url
  //const tours = JSON.parse(__dirname + "/dev-data/data/tours-simple.json")
  // const id = req.params.id * 1;
  // const tour = tours.find((el) => el.id === id);
  // res.status(200).json({
  //   status: 'success',
  //   data: {
  //     tours: tour
  //   }
  // });
  try{
    const filters = req.query
    const tour = await Tour.findById(filters)
    res.status(200).json({
      status: "success",
      data: {
        tour: tour
      }
    })
  }catch(err){
    res.status(404).json({
      status: "fail",
      message: err
    })
  }
};

exports.updateTour = async (req, res) => {
  try{
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true // it will run validators again
    })
    res.status(200).json({
      status: "success",
      data: {
        tour: tour
      }
    })
  }catch(err){
    res.status(404).json({
      status: "fail",
      message: err
    })
  }
};

exports.deleteTour = async (req, res) => {
  try{
    await Tour.deleteOne({_id: req.params.id})
    res.status(204).json({
      status: "success",
      data: null
    })
  }catch(err){
    res.send(404).json({
      status: "fail",
      message: err
    })
  }
  
};
