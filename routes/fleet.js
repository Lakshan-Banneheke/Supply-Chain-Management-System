const express = require('express');
const FleetController = require('../controllers/fleetController');
const router = express.Router();
const passport = require("passport");
const auth = require('../config/auth');



router.get('/brands', FleetController.brands);
router.post('/brands/new', FleetController.newBrand);
router.get('/brands/del/:id', FleetController.delBrand);
router.get('/brands/edit/:id/:title', FleetController.editBrand);

router.get('/vehicles', FleetController.vehicles);
router.get('/vehicles/new',FleetController.newVehicles);
router.post('/vehicles/new', FleetController.addNewVehicles);
router.get('/vehicles/edit/:id', FleetController.editVehicles);
router.post('/vehicles/editSubmit', FleetController.editVehiclesSubmit);
router.get('/vehicles/delete/:id', FleetController.deleteVehicles);

router.get('/supplies', FleetController.supplies);
router.get('/supplies/new', FleetController.newSupply);
router.post('/supplies/addNew', FleetController.addNewSupply);
router.get('/supplies/edit/:id', FleetController.editSupply);
router.post('/supplies/editSupplySubmit', FleetController.editSupplySubmit);
router.get('/supplies/delete/:id', FleetController.deleteSupply);


router.get('/test', FleetController.test);

module.exports = router;