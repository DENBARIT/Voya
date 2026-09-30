const express = require('express');

const Router = express.Router();
const { getAllUsers } = require('../controllers/userController');
const {
  signup,
  login,
  protect,
  forgotPassword,
  resetPassword,
} = require('../controllers/authController');

// user routes
// special thing about this route is that the route name has the same name as what the route do
Router.post('/signup', signup);
Router.post('/login', login);
Router.post('/forgotPassword', forgotPassword);
Router.patch('/resetPassword/:token', resetPassword);

// Router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);
Router.route('/').get(protect, getAllUsers);
module.exports = Router;
