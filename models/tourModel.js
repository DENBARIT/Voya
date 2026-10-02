const mongoose = require('mongoose');
const slugify = require('slugify');
// a validator package used for the purpose of validating data
const validator = require('validator');
const User = require('./userModel');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'A tour name must have less or equal 40 characters'],
      minlength: [10, 'A tour name must have at least 10 characters'],
      // validate: [validator.isAlpha, 'Tour name must only contain characters'],
    },
    slug: String,
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
      set: (val) => Math.round(val * 10) / 10, // 4.6666,46.666,47,4.7
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    duration: {
      type: Number,

      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either easy,medium,difficult',
      },
    },

    priceDiscount: {
      type: Number,
      // custom validation for priceDiscount to be less than that of price
      validate: {
        validator: function (val) {
          // this only points to current document only for creating not updating
          return val < this.price;
        },
        // the ({value}) is special mongoose syntax to get the current value
        message: 'Discount price ({VALUE}) should be below regular price',
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a summary'],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      // not to select and show in the output
      select: false,
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
    startLocation: {
      // GeoJSON
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    // guides: Array,
    // for child referencing, we will store the id of the user in the guides array
    guides: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
  },
  {
    // when does the virtual properties show up
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);
// virtual Tours
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

// Mongose Middelwares(Hooks)=>it is known as pre and post hooks,documnent,model,aggregate,query middleware
// Document Middleware=runs before .save() and .create() but not on insertMany() or update()
// Mongoose 9 no longer passes `next` to pre hooks; just return (or return a promise)
tourSchema.pre('save', function () {
  // the this keyword pointing to the current document
  this.slug = slugify(this.name, { lower: true });
});
// If we use the embedding approach for the guides  inside the tour model
// tourSchema.pre('save', async function () {
//   const guidesPromises = this.guides.map(async (id) => await User.findById(id));
//   this.guides = await Promise.all(guidesPromises);
// });
// tourSchema.post('save', (doc, next) => {
//   console.log(doc);
//   // since we have only one post middleware,no need of next middleware
//   next();
// });
// Query middleware=it runs before and after the query is executed
tourSchema.pre(/^find/, function () {
  // this keyword pointing to the current query
  this.find({ secretTour: { $ne: true } });
  // hw much time it took to execute the query
  this.start = Date.now();
  // next();
});
tourSchema.post(/^find/, function (docs) {
  console.log(`Query took ${Date.now() - this.start} milliseconds!`);
  console.log(docs);
});

// Aggreation middleware=it runs before and after the aggregation is executed
tourSchema.pre('aggregate', function () {
  // this=>points to the current aggregation object
  // this.pipeline returns an array of objects of aggregations=>[{"$match":{ratingsAverage:[obj]}}]
  console.log(
    this.pipeline().unshift({
      $match: { secretTour: { $ne: true } },
    }),
  );
});
const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;
// Fat models thin controllers
