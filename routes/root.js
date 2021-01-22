const router = require('express').Router();
const RootController = require('../controllers/rootController');

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


route.get("/check-notification", supervisorController.renderNotification)
route.post("/mark-as-read", supervisorController.reqMarkAsRead)

//-----------end supervisor-------------

module.exports = router;
