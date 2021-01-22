const express = require('express')
const route = express.Router()
const app = express()
const storekeeperController = require('../controller/storekeeperController')
app.set('view engine','ejs')

route.get("/", storekeeperController.renderDashboard)

//stock routes

route.get("/stock", storekeeperController.renderStock)

route.get("/stockupdates", storekeeperController.renderStockUpdate)

//material issuing routes(stock issuance)

route.get("/materialrequests", storekeeperController.renderMaterialRequests)

route.get("/materialrequests/issue/:id", storekeeperController.renderMaterialRequestView)

route.post("/submitmaterialreq/:id",storekeeperController.handleReqSubmission)

route.post("/issuematerialreq/:id",storekeeperController.issueMaterial)

route.post("/revisionsubmit/:id",storekeeperController.revisionHandle)

//material receiving routes(stock arrival)

route.get("/materialorders", storekeeperController.renderMaterialOrders)

route.get("/materialorders/review/:id", storekeeperController.renderMaterialOrderView)

route.get("/changematerialorder/:id",storekeeperController.renderChangeMaterialOrderView)

route.post("/updatestocksnochange/:id",storekeeperController.updateStocksNoChange)

route.post("/updatestockswithchange/:id",storekeeperController.updateStocksWithChange)

route.post("/markasread",storekeeperController.markAsRead)

// route.post("/submitmaterialorder/:id",storekeeperController.)





module.exports = route