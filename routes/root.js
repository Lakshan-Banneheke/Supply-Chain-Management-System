const router = require('express').Router();
const RootController = require('../controllers/rootController');

const supervisorController = require('../controller/supervisorController')

router.get('/', RootController.root);

route.get("/create-new-reqP", supervisorController.renderCreateNewReqP)
route.post("/create-new-reqS", supervisorController.renderCreateNewReqS)


module.exports = router;
