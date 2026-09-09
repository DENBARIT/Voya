// npm i dotenv package ;

const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<db_password>',
  process.env.DATABASE_PASSWORD,
);

mongoose.connect(DB).then(() => {
  // console.log(con.connection);
  console.log('DB connection successful');
});

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true,
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price'],
  },
});
const Tour = mongoose.model('Tour', tourSchema);
const testTour = new Tour({
  name: 'The camper',
  price: 49.99,
});
testTour
  .save()
  .then((doc) => {
    console.log(doc);
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
