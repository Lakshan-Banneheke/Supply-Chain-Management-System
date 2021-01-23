const express = require('express');

const router = express.Router();
const error404 = require('../controllers/errorController');

router.use('/', require('./root'));
router.use('/users', require('./users'));
router.use('/admin', require('./admin'));
router.use('/fleet-management', (req, res, next)=>{
    res.set("Content-Security-Policy", "default-src *; style-src 'self' http://* 'unsafe-inline'; script-src 'self' http://* 'unsafe-inline' 'unsafe-eval'");
    next();
},require('./fleet'));

router.use(error404);

module.exports = router;
