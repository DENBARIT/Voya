const fs = require('fs');
const express = require('express');
const app = express();
const port = 8000;

// Middleware
app.use(express.json());
app.use((req, res, next) => {

req.requestTime = new Date().toISOString();
next();

})

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`),
);
const getAllTours= (req, res) => {
    console.log(req.requestTime);
  res.status(200).json({
    status: 'success',
    requestTime: req.requestTime,
    results: tours.length,
    data: {
      tours,
    },
  });
}
const getTour=(req, res) => {
console.log(req.params);

const id=req.params.id*1;

// if(id>tours.length){
//     return res.status(404).json({
//         status:'fail',
//         message:'Invalid ID'
//     })
// }

const tour=tours.find(el=>el.id===id);

 if(!tour){
    return res.status(404).json({
        status:'fail',
        message:'Invalid ID'
    })
}
  res.status(200).json({
    status: 'success',
   
    data: {
      tour,
    },
  });
}

const createTour= (req, res) => {
  // console.log(req.body);

  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
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
}

const updateTour= (req,res)=>{

const id=req.params.id*1;

if(id>tours.length){
    return res.status(404).json({
        status:'fail',
        message:'Invalid ID'
    })
}

res.status(200).json({
    status:"success",
    data:{
        tour:"Updated tour here"
    }
})

}
const deleteTour=(req,res)=>{

const id=req.params.id*1;

if(id>tours.length){
    return res.status(404).json({
        status:'fail',
        message:'Invalid ID'
    })
}
res.status(204).json({
    status:"success",
    data:null
})
};




// app.get('/api/v1/tours',getAllTours);
// here we can make the parameters optional like /api/v1/tours/:id/:x?
// app.get('/api/v1/tours/:id', getTour);
// app.post('/api/v1/tours',createTour);

// app.patch("/api/v1/tours/:id",updateTour);
// app.delete("/api/v1/tours/:id",deleteTour);

// route chaining   
app.route('/api/v1/tours').get(getAllTours).post(createTour);



// Reminder->the sequence in which middelwares are called matters a lot=>here if we call  get All Tours then the middleware will not be executed since the response objecct has been already returned but if we call get tour then the middlbeware will be called 
// app.use((req, res, next) => {
// console.log('Hello from the middleware');
// next();   
// });


app.route('/api/v1/tours/:id').get(getTour).patch(updateTour).delete(deleteTour);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
