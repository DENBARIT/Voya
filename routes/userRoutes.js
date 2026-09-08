
const express=require('express');
const Router=express.Router();
const {getAllUsers}=require('../controllers/userController');


// user routes
Router.route('/').get(getAllUsers);
// Router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = Router;