const router = require('express').Router();
const RootController = require('../controllers/rootController');
const auth = require('../config/auth');

const checkAdmin = (req, res, next) => {
    if (req.user.cat_id !== 1){
        return next();
    }
    res.redirect("/admin");
}

router.get('/', auth.checkNotAuthenticated, checkAdmin ,RootController.root);



module.exports = router;