const express = require('express')
const router = express.Router()

const storekeeperController = require('../controllers/storekeeperController')

//stock routes

router.get("/stock", storekeeperController.renderStock)

router.get("/stockupdates", storekeeperController.renderStockUpdate)

//material issuing routes(stock issuance)

router.get("/materialrequests", storekeeperController.renderMaterialRequests)

router.get("/materialrequests/issue/:id", storekeeperController.renderMaterialRequestView)

router.post("/submitmaterialreq/:id",storekeeperController.handleReqSubmission)

router.post("/issuematerialreq/:id",storekeeperController.issueMaterial)

router.post("/revisionsubmit/:id",storekeeperController.revisionHandle)

//material receiving routes(stock arrival)

router.get("/materialorders", storekeeperController.renderMaterialOrders)

router.get("/materialorders/review/:id", storekeeperController.renderMaterialOrderView)

router.get("/changematerialorder/:id",storekeeperController.renderChangeMaterialOrderView)

router.post("/updatestocksnochange/:id",storekeeperController.updateStocksNoChange)

router.post("/updatestockswithchange/:id",storekeeperController.updateStocksWithChange)

router.post("/markasread",storekeeperController.markAsRead)

// router.post("/submitmaterialorder/:id",storekeeperController.)





module.exports = router