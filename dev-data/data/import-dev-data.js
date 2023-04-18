const fs = require("fs")
const mongoose = require("mongoose")

const dotenv = require('dotenv');
const Tour = require("../../models/tourModels");
dotenv.config({ path: './config.env' }); 

const DB = process.env.DATABASE.replace("<password>", process.env.DATABASE_PASSWORD)

mongoose.connect(DB, {
  useNewUrlParser: true
  // useCreateIndex: true,
  // useFindAndModify: false
}).then(con=>{
  console.log("db connection succcessful!");
})

const tours = JSON.parse(fs.readFileSync(__dirname + "/tours-simple.json", "utf-8"))

const importData = async() =>{
    try{
        await Tour.create(tours)
        console.log("import success");
        process.exit()
    }catch(err){
        console.log(err);
    }
}

const deleteData = async() =>{
    try{
        await Tour.deleteMany()
        console.log("delete data success");
        process.exit()
    }catch(err){
        console.log(err);
    }
}

if(process.argv[2] == "--import"){
    importData()
}else if(process.argv[2] == "--delete"){
    deleteData()
}