const fs = require('fs');
const Tour = require("./../models/tourModels")

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
    const tours = await Tour.find()
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
    res.send(400).json({
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
    const tour = await Tour.findById(req.params.id)
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
    const tour = await Tour.deleteOne({_id: req.body.id})
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
