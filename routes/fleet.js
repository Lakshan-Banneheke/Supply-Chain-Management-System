const express = require('express');
const FleetController = require('../controllers/fleetController');
const router = express.Router();
const passport = require("passport");
const auth = require('../config/auth');



router.get('/brands', auth.checkNotAuthenticated, FleetController.brands);
router.post('/brands/new', auth.checkNotAuthenticated, FleetController.newBrand);
router.get('/brands/del/:id', auth.checkNotAuthenticated, FleetController.delBrand);
router.get('/brands/edit/:id/:title', auth.checkNotAuthenticated, FleetController.editBrand);

router.get('/vehicles', auth.checkNotAuthenticated, FleetController.vehicles);
router.get('/vehicles/new', auth.checkNotAuthenticated, FleetController.newVehicles);
router.post('/vehicles/new', auth.checkNotAuthenticated, FleetController.addNewVehicles);
router.get('/vehicles/edit/:id', auth.checkNotAuthenticated, FleetController.editVehicles);
router.post('/vehicles/editSubmit', auth.checkNotAuthenticated, FleetController.editVehiclesSubmit);
router.get('/vehicles/delete/:id', auth.checkNotAuthenticated, FleetController.deleteVehicles);

router.get('/supplies/', auth.checkNotAuthenticated, FleetController.supplies);
router.get('/supplies/new/', auth.checkNotAuthenticated, FleetController.newSupply);
router.post('/supplies/addNew/', auth.checkNotAuthenticated, FleetController.addNewSupply);
router.get('/supplies/edit/:id', auth.checkNotAuthenticated, FleetController.editSupply);
router.post('/supplies/editSupplySubmit', auth.checkNotAuthenticated, FleetController.editSupplySubmit);
router.get('/supplies/delete/:id', auth.checkNotAuthenticated, FleetController.deleteSupply);

router.get('/supplies/req', auth.checkNotAuthenticated, (req, res, next) => {req.req=true;next()}, FleetController.supplies);
router.get('/supplies/new/req', auth.checkNotAuthenticated, (req, res, next) => {req.req=true;next()}, FleetController.newSupply);
router.post('/supplies/addNew/req', auth.checkNotAuthenticated, (req, res, next) => {req.req=true;next()}, FleetController.addNewSupply);

router.get('/requests', auth.checkNotAuthenticated, FleetController.requests);
router.post('/requests', auth.checkNotAuthenticated, FleetController.handelRequests);

router.get('/test', auth.checkNotAuthenticated, FleetController.test);

module.exports = router;