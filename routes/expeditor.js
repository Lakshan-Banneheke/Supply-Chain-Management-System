const express = require('express');
const ExpeditorController = require('../controllers/expeditorController');
const FleetController = require('../controllers/fleetController');
const router = express.Router();
const auth = require('../config/auth');


router.get('/requests',auth.checkNotAuthenticated, (req, res, next) => {req.req=true;req.exp=true;next()}, FleetController.supplies);
router.get('/sendRequest',auth.checkNotAuthenticated, (req, res, next) => {req.req=true;req.exp=true;next()}, FleetController.newSupply);
router.post('/submitRequest', auth.checkNotAuthenticated, (req, res, next) => {req.req=true;req.exp=true;next()}, FleetController.addNewSupply);
router.get('/editSupply/:id', auth.checkNotAuthenticated, (req, res, next) => {req.req=true;req.exp=true;next()}, FleetController.editSupply);
router.get('/delSupply/:id', auth.checkNotAuthenticated, (req, res, next) => {req.req=true;req.exp=true;next()}, FleetController.deleteSupply);
router.post('/editSupplySubmit', auth.checkNotAuthenticated, (req, res, next) => {req.req=true;req.exp=true;next()}, FleetController.editSupplySubmit);

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
