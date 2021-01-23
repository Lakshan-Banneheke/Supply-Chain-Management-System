const express = require('express');
const ExpeditorController = require('../controllers/expeditorController');
const router = express.Router();
const auth = require('../config/auth');


router.get('/sendRequest',auth.checkNotAuthenticated, ExpeditorController.viewSendRequest);
router.get('/order',auth.checkNotAuthenticated, ExpeditorController.viewOrder);
router.get('/usedMaterial',auth.checkNotAuthenticated, ExpeditorController.renderReqReport);
router.post('/usedMaterial', ExpeditorController.renderReport);
router.post('/order/save', ExpeditorController.addNewOrder);
router.post('/order/send', ExpeditorController.sendOrder);
router.post('/order/delete', ExpeditorController.deleteOrder);
router.post('/order/getOrdersAndEstimations', ExpeditorController.getOrdersAndEstimations);
router.post('/order/showOrder', ExpeditorController.showCompleteOrder);
router.post('/order/showEstimate', ExpeditorController.showCompleteEstimate);



module.exports = router;