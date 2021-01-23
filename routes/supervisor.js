const router = require('express').Router();
const supervisorController = require('../controllers/supervisorController')
const auth = require('../config/auth');

// router.get("/supervisor-dashboard", supervisorController.renderDashboard)
router.get("/create-new-reqP", supervisorController.renderCreateNewReqP)
router.post("/create-new-reqS", supervisorController.renderCreateNewReqS)
router.post("/material-req-form", supervisorController.renderReqForm)
router.get("/material-req-form", supervisorController.renderReqForm)
router.post("/send-to-expeditor", supervisorController.sendToExpeditor)
router.post("/collect-form-data",supervisorController.collectSumbitData)
router.get("/consum-repot", supervisorController.renderReqReport)
router.post("/consum-repot", supervisorController.renderReport)

module.exports = router;
