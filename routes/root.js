const router = require('express').Router();
const RootController = require('../controllers/rootController');
const auth = require('../config/auth');

//--------------SUPERVISOR---------------
const supervisorController = require('../controllers/supervisorController')

//----------- Supervisor Routes-------------

router.get("/supervisor-dashboard", supervisorController.renderCreateNewReqP)

router.get("/create-new-reqP", supervisorController.renderCreateNewReqP)
router.post("/create-new-reqS", supervisorController.renderCreateNewReqS)
router.post("/material-req-form", supervisorController.renderReqForm)
router.get("/material-req-form", supervisorController.renderReqForm)
router.post("/send-to-expeditorl", supervisorController.sendToExpeditor)
router.post("/collect-form-data",supervisorController.collectSumbitData)
router.get("/consum-repot", supervisorController.renderReqReport)
router.post("/consum-repot", supervisorController.renderReport)


//-----------end supervisor-------------


const checkAdmin = (req, res, next) => {
    if (req.user.cat_id !== 1){
        return next();
    }
    res.redirect("/admin");
}

router.get('/', auth.checkNotAuthenticated, checkAdmin ,RootController.root);



module.exports = router;
