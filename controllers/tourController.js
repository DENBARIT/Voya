const Tour = require('../models/tourModel');

// Routes
exports.getAllTours = (req, res) => {
  console.log(req.requestTime);
  res.status(200).json({
    status: 'success',
    requestTime: req.requestTime,
    // results: tours.length,
    // data: {
    //   tours,
    // },
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

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }

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
