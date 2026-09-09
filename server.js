// npm i dotenv package ;

const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<db_password>',
  process.env.DATABASE_PASSWORD,
);

mongoose
  .connect(DB)
  .then(() => {
    // console.log(con.connection);
    console.log('DB connection successful');
  })
  .catch((err) => {
    console.log('Error:', err);
  });
const port = process.env.PORT || 8000;

// console.log(app.get('env'));
// console.log(process.env);
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
