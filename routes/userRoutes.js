const express = require('express');

const Router = express.Router();
const {
  getAllUsers,
  updateMe,
  deleteMe,
} = require('../controllers/userController');
const {
  signup,
  login,
  protect,
  forgotPassword,
  resetPassword,
  updatePassword,
} = require('../controllers/authController');

// user routes
// special thing about this route is that the route name has the same name as what the route do
Router.post('/signup', signup);
Router.post('/login', login);
Router.post('/forgotPassword', forgotPassword);
Router.patch('/resetPassword/:token', resetPassword);
Router.patch('/updateMyPassword', protect, updatePassword);
Router.patch('/updateMe', protect, updateMe);
// Router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);
Router.route('/').get(protect, getAllUsers);
Router.delete('/deleteMe', protect, deleteMe);
module.exports = Router;
