const express = require('express');
const FleetController = require('../controllers/fleetController');
const router = express.Router();
const passport = require("passport");
const auth = require('../config/auth');



router.get('/brands', auth.checkAuthenticated, FleetController.brands);
router.post('/brands/new', auth.checkAuthenticated, FleetController.newBrand);
router.get('/brands/del/:id', auth.checkAuthenticated, FleetController.delBrand);
router.get('/brands/edit/:id/:title', auth.checkAuthenticated, FleetController.editBrand);

router.get('/vehicles', auth.checkAuthenticated, FleetController.vehicles);
router.get('/vehicles/new', auth.checkAuthenticated, FleetController.newVehicles);
router.post('/vehicles/new', auth.checkAuthenticated, FleetController.addNewVehicles);
router.get('/vehicles/edit/:id', auth.checkAuthenticated, FleetController.editVehicles);
router.post('/vehicles/editSubmit', auth.checkAuthenticated, FleetController.editVehiclesSubmit);
router.get('/vehicles/delete/:id', auth.checkAuthenticated, FleetController.deleteVehicles);

router.get('/supplies', auth.checkAuthenticated, FleetController.supplies);
router.get('/supplies/new', auth.checkAuthenticated, FleetController.newSupply);
router.post('/supplies/addNew', auth.checkAuthenticated, FleetController.addNewSupply);
router.get('/supplies/edit/:id', auth.checkAuthenticated, FleetController.editSupply);
router.post('/supplies/editSupplySubmit', auth.checkAuthenticated, FleetController.editSupplySubmit);
router.get('/supplies/delete/:id', auth.checkAuthenticated, FleetController.deleteSupply);

module.exports = router;