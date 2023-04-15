const fs = require('fs');

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

exports.checkID = (req, res, next, val) => {
  // middleware to check valid id
  console.log(`id is: ${val}`);
  const id = req.params.id * 1;
  if (id > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'invalid id',
    });
  }
  next();
};

exports.checkBody = (req, res, next) => {
  // middleware to check valid tour details
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: 'fail',
      message: 'missing name or price',
    });
  }
  next();
};

exports.getAllTours = (req, res) => {
  console.log(req.requestTime);
  res.status(200).json({
    status: 'success',
    results: tours.length,
    request_made_at: req.requestTime,
    data: {
      tours: tours,
    },
  });
  console.log(tours);
};

exports.createNewTour = (req, res) => {
  const newTour = req.body;
  console.log(newTour);
  const id = tours[tours.length - 1].id + 1;
  const obj = { id: id, ...newTour }; // assigning another field to the object
  tours.push(obj);
  fs.writeFile(
    `${__dirname}/../dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      if (err) console.log(err);
      else {
        res.status(201).json({
          status: 'success',
          data: {
            tours: obj,
          },
        });
      }
    }
  );
};

exports.getOneTour = (req, res) => {
  // params make a object of all the parameters/variables of url
  //const tours = JSON.parse(__dirname + "/dev-data/data/tours-simple.json")
  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);
  res.status(200).json({
    status: 'success',
    data: {
      tours: tour,
    },
  });
};

exports.updateTour = (req, res) => {
  const id = req.params.id * 1;
  res.status(200).json({
    status: 'success',
    message: '<tour updated here...>',
  });
};

exports.deleteTour = (req, res) => {
  const id = req.params.id * 1;
  res.status(204).json({
    status: 'success',
    message: 'tour deleted successfully',
    data: null,
  });
};
