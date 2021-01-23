const express = require('express');
const UserController = require('../controllers/userController');
const router = express.Router();
const passport = require("passport");
const auth = require('../config/auth');


router.get('/register',auth.checkAuthenticated, UserController.viewRegister);
router.get('/login', auth.checkAuthenticated, UserController.viewLogin);
router.get('/faq', auth.checkNotAuthenticated, UserController.viewFaq);
router.post('/register', UserController.register);
router.post('/login',
    passport.authenticate("local",{
        successRedirect: "../",
        failureRedirect: "login",
        failureFlash: true
    })
);
router.get('/logout', auth.checkNotAuthenticated, UserController.logout);

module.exports = router;