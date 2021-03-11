const express = require('express');
const auth = require('../config/auth');
const router = express.Router();
const errors = require('../controllers/errorController');
const setHeader = require('../middleware/setHeader');

router.use('/', (req, res, next)=>{
    res.set("Content-Security-Policy", "default-src *; style-src 'self' http://* 'unsafe-inline'; script-src 'self' http://* 'unsafe-inline' 'unsafe-eval'");
    next();
});

router.use('/', require('./root'));
router.use('/users', require('./users'));
router.use('/admin', require('./admin'));
router.use('/fleet-management', auth.checkFleetManager,  setHeader ,require('./fleet'));
router.use('/supervisor', auth.checkSupervisor, setHeader , require('./supervisor'));
router.use('/store', auth.checkStorekeeper, require('./store'));
router.use('/expeditor', auth.checkExpeditor, setHeader, require('./expeditor'));
router.use('/qs', auth.checkQS, require('./quantity_s'));
router.get('/405', errors.error405);

router.use(errors.error404);


module.exports = router;
