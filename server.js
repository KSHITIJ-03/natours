const dotenv = require('dotenv');
dotenv.config({ path: './config.env' }); // this will include all the variables
// from dotenv file to the node file
const app = require('./app');

const mongoose = require("mongoose")
const DB = process.env.DATABASE.replace("<password>", process.env.DATABASE_PASSWORD)

mongoose.connect(DB, {
  useNewUrlParser: true
  // useCreateIndex: true,
  // useFindAndModify: false
}).then(con=>{
  //console.log(con.connections);
  console.log("db connection succcessful!");
})

// console.log(process.env);

const port = 3000 || process.env.PORT;
app.listen(port, () => {
  console.log('server running on port 3000');
});
 