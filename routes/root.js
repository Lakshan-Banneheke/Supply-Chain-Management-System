const router = require('express').Router();
const rootController = require('../controllers/rootController');
const auth = require('../config/auth');

router.get('/', auth.checkNotAuthenticated, auth.checkAdmin, rootController.renderDashboard);



module.exports = router;
