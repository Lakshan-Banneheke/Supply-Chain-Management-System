const router = require('express').Router();
const RootController = require('../controllers/rootController');
const auth = require('../config/auth');

//--------------SUPERVISOR---------------
const supervisorController = require('../controllers/supervisorController')

router.get('/', RootController.root);

//----------- Supervisor Routes-------------

route.get("/supervisor-dashboard", supervisorController.renderCreateNewReqP)

route.get("/create-new-reqP", supervisorController.renderCreateNewReqP)
route.post("/create-new-reqS", supervisorController.renderCreateNewReqS)
route.post("/material-req-form", supervisorController.renderReqForm)
route.get("/material-req-form", supervisorController.renderReqForm)
route.post("/send-to-expeditorl", supervisorController.sendToExpeditor)
route.post("/collect-form-data",supervisorController.collectSumbitData)
route.get("/consum-repot", supervisorController.renderReqReport)
route.post("/consum-repot", supervisorController.renderReport)


//-----------end supervisor-------------


const checkAdmin = (req, res, next) => {
    if (req.user.cat_id !== 1){
        return next();
    }
    res.redirect("/admin");
}

router.get('/', auth.checkNotAuthenticated, checkAdmin ,RootController.root);



module.exports = router;
