
const express = require('express');
const passport = require('passport'); // add this line to require passport
const router = express.Router();

const adminController = require('./index.controller.js');
const { User } = require('../../models/user.js'); // Import the User model
const Auth = require('../../middlewares/Auth.js');

router.get('/', adminController.getLogin);
router.get('/login', adminController.getLogin);
router.post('/login', adminController.login);
//router.get('/adminDashboard', passport.authenticate('jwt', { session: false }), Auth, adminController.adminDashboard);
router.get('/adminDashboard',  adminController.adminDashboard);


module.exports = router;