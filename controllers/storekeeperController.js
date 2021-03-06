const storekeeperModel = require('../models/storekeeperModel')

var passNotification = []
var notificationView = ''

// converts date to the correct format
function convertTime(list) {
    var newList = [];
    for (var i=0;i<list.length;i++){
        var date = new Date(list[i].date),
            mnth = ("0" + (date.getMonth() + 1)).slice(-2),
            day = ("0" + date.getDate()).slice(-2);
        var newdate = [date.getFullYear(), mnth, day].join("-");
        newList.push(newdate);
    }

    return newList;
}

// const renderDashboard = async(req,res)=> {
//
//     let notifications = await storekeeperModel.getNotification();
//     let not_dates =  await convertTime(notifications);
//     // console.log(notifications);
//     passNotification = notifications;
//     notificationView = "/"
//     res.render('dashboard', {
//             name:req.user.name,
//             notifications:notifications,
//             not_dates:not_dates
//         });
//
// }

const renderStock = async(req,res)=>{
    let notifications = await storekeeperModel.getNotification();
    let not_dates =  await convertTime(notifications);
    passNotification = notifications;
    notificationView = "/store/stock"
    res.render('stock',{
            name:req.user.name,
            notifications:notifications,
            stocks: await storekeeperModel.getStock(),
            not_dates:not_dates
        },

    );
}

const renderStockUpdate = async(req,res) =>{
    res.render('stockupdates',{
        name:req.user.name,
        materialOrders: await storekeeperModel.getStockUpdateRequests()
    });
}


const renderMaterialRequests = async (req,res) =>{

    let notifications = await storekeeperModel.getNotification();
    passNotification = notifications;
    notificationView = "/store/materialrequests";
    let not_dates =  await convertTime(notifications);

    let material_req = await  storekeeperModel.getMaterialRequests();

    let material_req2 = await  storekeeperModel.getCompletedMaterialRequests();

    let count_req = await storekeeperModel.getCountAllReq();



    let count_comp_req = await storekeeperModel.getCountCompReq();

    req_dates = [];

    if (material_req.length>0){
        req_dates = await convertMat(material_req);
    }

    res.render('materialrequests',{
        name:req.user.name,
        materialRequests: material_req,
        request_dates:req_dates,
        count_req:count_req.count,
        count_comp_req:count_comp_req.count,
        notifications:notifications,
        not_dates:not_dates
    })

}



// converts date to the correct format
function convertMat(list,req_date) {
    var newList = [];
    for (var i=0;i<list.length;i++){
        var date = new Date(list[i].request_date),
            mnth = ("0" + (date.getMonth() + 1)).slice(-2),
            day = ("0" + date.getDate()).slice(-2);
        var newdate = [date.getFullYear(), mnth, day].join("-");
        newList.push(newdate);
    }

    return newList;
}



const renderMaterialRequestView  = async (req,res) =>{
    console.log("ok");
    let req_id = req.params.id;

    let req_materials = await storekeeperModel.getRequestedMaterials(req_id);

    let req_det = await storekeeperModel.getMaterialRequestByID(req_id);
    console.log(req_materials);
    console.log(req_det);

    res.render('materialrequestview',{
        name:req.user.name,
        materials: req_materials,
        req_det:req_det[0],
        req_id:req_id
    });
}


const handleReqSubmission = async (req,res) => {
    let id = req.params.id;

    let req_materials = await storekeeperModel.getRequestedMaterials(id);

    let availability = await checkAvailability(req_materials);


    let req_det = await storekeeperModel.getMaterialRequestByID(id);

    if(availability.length==0){

        res.render('materialrequestsuccessview',{
            name:req.user.name,
            materials: req_materials,
            req_det:req_det[0],
            req_id:id,
        })
    }
    else{
        let message='Not enough materials: ';
        for (var i=0;i<availability.length;i++){
            let name = availability[i];
            let qty = await storekeeperModel.getQuantityByName(name);
            message+=name+' (' + qty[0].material_quantity +')  ';
        }

        let available_materials = await storekeeperModel.getMaterialsStocks(id);

        res.render('materialrequestrevisionview',{
            name:req.user.name,
            materials:req_materials,
            req_det:req_det[0],
            req_id:id,
            message:message,
            availability:availability,
            available_materials:available_materials,
        })
    }
}


const checkAvailability =  async function (req_materials){
    let not_aval = [];
    for(var i=0; i<req_materials.length;i++ ){
        var mat_name=String(req_materials[i].material_name);
        console.log(mat_name);
        var aval_qty = await storekeeperModel.getQuantityByName(mat_name);
        console.log("aval qty");
        console.log(aval_qty);
        console.log(req_materials[i].requested_quntity);
        if (req_materials[i].requested_quantity>aval_qty[0].material_quantity){
            not_aval.push(mat_name);
        }
    } return not_aval;

}


const issueMaterial = async(req,res)=>{
    let req_id = req.params.id;
    //updating state to completed
    await storekeeperModel.updateRequestState(req_id,'Completed');
    //update issued date
    await storekeeperModel.updateIssueDate(req_id);
    //update received quantity
    await storekeeperModel.updateReceivedQuantityNoChange(req_id);
    //updating stocks
    await storekeeperModel.updateStocksReduce(req_id);
    //notify onsite supervisor
    await storekeeperModel.newNotification('Request Fulfilled','on-site supervisor');

    res.redirect('/store/materialrequests');
}

const revisionHandle = async (req,res)=>{
    let req_id = req.params.id;
    let receieved_qty = JSON.parse(JSON.stringify(req.body)). receieved_quantity;


    //update state partially completed
    await storekeeperModel.updateRequestState(req_id,'Partially Completed');
    //update issued date
    await storekeeperModel.updateIssueDate(req_id);
    //update received quantity
    await storekeeperModel.updateReceivedQuantityWithChange(receieved_qty,req_id);
    console.log("updated received qt");
    //updating stocks
    await storekeeperModel.updateStocksReduce(req_id);
    console.log("stock updated");
    //notify onsite supervisor
    await storekeeperModel.newNotification('Request Fulfilled(Quantities updated)','on-site supervisor');

    res.redirect('/store/materialrequests');

}


//received orders handling

const renderMaterialOrders = async (req,res) =>{

    let notifications = await storekeeperModel.getNotification();
    passNotification = notifications;
    notificationView = "/store/materialorders";
    let not_dates =  await convertTime(notifications);

    let orders = await  storekeeperModel.getOrders();

    let all_orders = await storekeeperModel.getCountAllOrd();

    let comp_ord = await storekeeperModel.getCountCompOrd();

    ord_dates = [];

    if (orders.length>0){
        ord_dates = await convertOrd(orders);
    }

    res.render('materialorders',{
        name:req.user.name,
        orders: orders,
        order_dates:ord_dates,
        all_ord:all_orders.count,
        comp_ord:comp_ord.count,
        notifications:notifications,
        not_dates:not_dates
    })

}


// converts date to the correct format
function convertOrd(list) {
    var newList = [];
    for (var i=0;i<list.length;i++){
        var date = new Date(list[i].order_date),
            mnth = ("0" + (date.getMonth() + 1)).slice(-2),
            day = ("0" + date.getDate()).slice(-2);
        var newdate = [date.getFullYear(), mnth, day].join("-");
        newList.push(newdate);
    }

    return newList;
}


const renderMaterialOrderView  = async (req,res) =>{
    let req_id = req.params.id;

    let req_materials = await storekeeperModel.getOrderedMaterials(req_id);

    let req_det = await storekeeperModel.getOrderByID(req_id);

    res.render('materialorderview',{
        name:req.user.name,
        materials: req_materials,
        req_det:req_det[0],
        req_id:req_id
    });
}

const renderChangeMaterialOrderView = async(req,res) =>{

    let req_id = req.params.id;

    let req_materials = await storekeeperModel.getOrderedMaterials(req_id);
    console.log("requested materials");
    console.log(req_materials);
    let req_det = await storekeeperModel.getOrderByID(req_id);
    console.log("order details");
    console.log(req_det);

    res.render('materialorderchangeview',
        {
            name:req.user.name,
            materials: req_materials,
            req_det:req_det[0],
        })

}

const updateStocksNoChange = async (req,res)=>{
    let req_id = req.params.id;
    let receieved_qty = JSON.parse(JSON.stringify(req.body)).ordered_quantity;
    // update the state of the order
    await storekeeperModel.updateOrderState(req_id,'Completed');
    //update the recieved date of the order
    await storekeeperModel.updateReceivedDate(req_id);
    // update the recieved quantity
    await storekeeperModel.updateOrderQuantityNoChange(req_id);
    // update the stocks
    await storekeeperModel.updateStocksAdd(req_id);
    //notify expeditor
    await storekeeperModel.newNotification('Request Fulfilled','expeditor');
    res.redirect('/store/materialorders');
}





const updateStocksWithChange = async (req,res) =>{
    let req_id = req.params.id;
    let receieved_qty = JSON.parse(JSON.stringify(req.body)). receieved_quantity;

    //update state partially completed
    await storekeeperModel.updateOrderState(req_id,'Partially Completed');

    //update the recieved date of the order
    await storekeeperModel.updateReceivedDate(req_id);

    //update received quantity
    await storekeeperModel.updateOrderQuantityWithChange(receieved_qty,req_id);
    console.log("updated received qt");
    //updating stocks
    await storekeeperModel.updateStocksAdd(req_id);
    console.log("stock updated");
    //notify expeditor
    await storekeeperModel.newNotification('Request Fulfilled(Quantites Changed)','expeditor');
    res.redirect('/store/materialorders');

}


const markAsRead = async(req,res) => {
    let notifications = passNotification;
    for(var i=0;i<notifications.length;i++){
        await storekeeperModel.markAsRead(notifications[i].notifi_id);
    }
    await res.redirect(notificationView);
    passNotification=[];
    notificationView='';
    console.log("redirected");
}


module.exports = {
    // renderDashboard,
    renderStock,
    renderStockUpdate,
    renderMaterialRequests,
    renderMaterialRequestView,
    handleReqSubmission,
    issueMaterial,
    revisionHandle,
    renderMaterialOrders,
    renderMaterialOrderView,
    renderChangeMaterialOrderView,
    updateStocksNoChange,
    updateStocksWithChange,
    markAsRead
}
