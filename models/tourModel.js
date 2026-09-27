const mongoose = require('mongoose');
const slugify = require('slugify');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
    },
    slug: String,
    ratingsAverage: {
      type: Number,
      default: 4.5,
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
    },
    priceDiscount: Number,
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
  this.slug = slugify(this.name, { lower: true });
});

// tourSchema.post('save', (doc, next) => {
//   console.log(doc);
//   // since we have only one post middleware,no need of next middleware
//   next();
// });
const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;
// Fat models thin controllers
