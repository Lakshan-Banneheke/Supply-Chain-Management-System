const express = require('express');
const UserController = require('../controllers/userController');
const router = express.Router();

router.get('/register', UserController.viewRegister);
router.get('/login', UserController.viewLogin);
router.get('/faq',UserController.viewFaq);
router.post('/register', UserController.register);
router.post('/login', UserController.login);

module.exports = router;