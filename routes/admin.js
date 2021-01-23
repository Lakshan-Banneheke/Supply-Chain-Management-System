const express = require('express');
const adminController = require('../controllers/adminController');
const router = express.Router();
const auth = require('../config/auth');

router.get('/',auth.checkNotAuthenticated, adminController.viewAdminDashboard);
router.post('/approveUser', adminController.approveUser);
router.post('/disapproveUser', adminController.disapproveUser);


module.exports = router;
