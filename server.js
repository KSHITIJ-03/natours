const dotenv = require('dotenv');
dotenv.config({ path: './config.env' }); // this will include all the variables
// from dotenv file to the node file
const app = require('./app');

// console.log(process.env);
const port = 3000 || process.env.PORT;
app.listen(port, () => {
  console.log('server running on port 3000');
});
