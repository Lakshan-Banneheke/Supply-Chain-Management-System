const express = require('express');
const QSController = require('../controllers/qsController');
const router = express.Router();
const auth = require('../config/auth');


router.get('/estimation',auth.checkNotAuthenticated, QSController.viewEstimation);
router.get('/estimationView',auth.checkNotAuthenticated, QSController.viewEstimationView);
router.get('/createProject',auth.checkNotAuthenticated, QSController.viewCreateProject);
router.post('/estimationView',auth.checkNotAuthenticated, QSController.viewEstimationView);

router.post('/estimationView/getProjectEstimations',auth.checkNotAuthenticated, QSController.getProjectEstimations);
router.post('/estimationView/sendEstimate',auth.checkNotAuthenticated, QSController.sendEstimation);
router.delete('/estimationView/deleteEstimate',QSController.deleteEstimate);
// router.post('/estimationView/edit',auth.checkNotAuthenticated, QSController.editEstimation);

router.post('/estimation/addNewM', QSController.addNewMaterial);
router.post('/estimation/addNewestimateMaterial',QSController.addNewestimateMaterial);
router.delete('/estimation/deleteNewestimateMaterial',QSController.deleteNewestimateMaterial);
router.post('/estimation/saveNewEstimate',QSController.saveNewEstimate);
router.post('/createProject/saveNewProject', QSController.saveNewProject);
router.post('/createProject/viewProject',QSController.viewProject);

module.exports = router;