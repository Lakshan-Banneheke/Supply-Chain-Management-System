const router = require('express').Router();
const RootController = require('../controllers/rootController');
const auth = require('../config/auth');

router.get('/', auth.checkNotAuthenticated ,RootController.root);

module.exports = router;