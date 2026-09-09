const fs = require('fs');

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`),
);
// the middleware sits between the request and response cycle and can modify the request and response objects

exports.checkID = (req, res, next, val) => {
  console.log(`Tour id is ${val}`);
  const id = req.params.id * 1;

  if (id > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
  next();
};
exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: 'fail',
      message: 'Missing name or price',
    });
  }
  next();
};

// Routes
exports.getAllTours = (req, res) => {
  console.log(req.requestTime);
  res.status(200).json({
    status: 'success',
    requestTime: req.requestTime,
    results: tours.length,
    data: {
      tours,
    },
  });
};
exports.getTour = (req, res) => {
  console.log(req.params);

  const id = req.params.id * 1;

  // if(id>tours.length){
  //     return res.status(404).json({
  //         status:'fail',
  //         message:'Invalid ID'
  //     })
  // }

  const tour = tours.find((el) => el.id === id);

  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
  res.status(200).json({
    status: 'success',

    data: {
      tour,
    },
  });
};

exports.createTour = (req, res) => {
  // console.log(req.body);

  const newId = tours[tours.length - 1].id + 1;
  const newTour = { id: newId, ...req.body };

  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/../dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    },
  );
  //   res.send("Done");
};

exports.updateTour = (req, res) => {
  const id = req.params.id * 1;

  // if(id>tours.length){
  //     return res.status(404).json({
  //         status:'fail',
  //         message:'Invalid ID'
  //     })
  // }

  res.status(200).json({
    status: 'success',
    data: {
      tour: 'Updated tour here',
    },
  });
};
exports.deleteTour = (req, res) => {
  res.status(204).json({
    status: 'success',
    data: null,
  });
};
