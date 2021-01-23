const express = require('express');
const auth = require('../config/auth');
const router = express.Router();
const errors = require('../controllers/errorController');



router.use('/', require('./root'));
router.use('/users', require('./users'));
router.use('/admin', require('./admin'));
router.use('/fleet-management', auth.checkFleetManager,  (req, res, next)=>{
    res.set("Content-Security-Policy", "default-src *; style-src 'self' http://* 'unsafe-inline'; script-src 'self' http://* 'unsafe-inline' 'unsafe-eval'");
    next();
},require('./fleet'));

router.use('/supervisor', auth.checkSupervisor, (req, res, next)=>{
    res.set("Content-Security-Policy", "default-src *; style-src 'self' http://* 'unsafe-inline'; script-src 'self' http://* 'unsafe-inline' 'unsafe-eval'");
    next();
}, require('./supervisor'));
router.use('/expeditor', require('./expeditor'));
router.use('/qs', require('./quantity_s'));
router.get('/405', errors.error405);

router.use(errors.error404);

module.exports = router;
