const fs = require('fs');
const User = require("./../models/userModels")
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

exports.getALLUsers = async (req, res) => {
  try{
    const users = await User.find()
    res.status(200).json({
      status: "success",
      results: users.length,
      data: {
        users: users
      }
    })
  }
  catch(err){
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
  
};

exports.getOneUser = async (req, res) => {
  try{
    const id = req.params.id
    const user = await User.findById(id)
    res.status(200).json({
      status: "success",
      data: {
        user: user
      }
    })
  } catch(err){
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
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
