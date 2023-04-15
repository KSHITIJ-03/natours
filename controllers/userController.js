const fs = require('fs');

exports.checkID = (req, res, next, val) => {
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

exports.getALLUsers = (req, res) => {
  res.status(500).json({
    // 500 for server internal error
    status: 'error',
    message: '<this route is under construction...>',
  });
};

exports.getOneUser = (req, res) => {
  res.status(500).json({
    // 500 for server internal error
    status: 'error',
    message: '<this route is under construction...>',
  });
};

exports.createNewUser = (req, res) => {
  res.status(500).json({
    // 500 for server internal error
    status: 'error',
    message: '<this route is under construction...>',
  });
};

exports.updateOneUser = (req, res) => {
  res.status(500).json({
    // 500 for server internal error
    status: 'error',
    message: '<this route is under construction...>',
  });
};

exports.deleteUser = (req, res) => {
  res.status(500).json({
    // 500 for server internal error
    status: 'error',
    message: '<this route is under construction...>',
  });
};
