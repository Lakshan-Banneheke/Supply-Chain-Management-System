const express = require('express');
const UserController = require('../controllers/userController');
const router = express.Router();

router.get('/register', UserController.viewRegister);
router.get('/login', UserController.viewLogin);
router.post('/register', UserController.register);
// router.post('/register', UserController);

module.exports = router;