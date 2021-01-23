const express = require('express');

const router = express.Router();
const error404 = require('../controllers/errorController');

router.use('/', require('./root'));
router.use('/users', require('./users'));
router.use('/expeditor', require('./expeditor'));
router.use('/qs', require('./quantity_s'));
router.use(error404);

module.exports = router;
