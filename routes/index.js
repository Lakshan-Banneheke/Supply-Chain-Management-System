const express = require('express');

const router = express.Router();

router.use('/', require('./root'));
router.use('/users', require('./users'));

module.exports = router;
