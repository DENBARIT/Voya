// npm i dotenv package ;

const mongoose = require('mongoose');
const dotenv = require('dotenv');
// we have to build at the top so the uncaught exception is handled at any part in the app  and before the app runs
process.on('uncaughtdRejection', (err) => {
  console.log('UNCAUGHT REJECTION! Shutting down...');
  console.log(err.name, err.message);

  process.exit(1);
});

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
const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
// here process is the oject that is emitted when an unhandled promise rejection occurs

// The process between unhandled Rejection and uncaught exception=>the unhandled rejection is asynchronous=>here there is a return of some promise=>it is a rejection
// like a database connection problem both the express or monogo donot handle it ,but  for the uncaught one it is synchronous=>like a syntax error or a variable that is not defined
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
