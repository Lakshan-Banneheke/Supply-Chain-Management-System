const userValidator = require('./validators/userValidator');
const expeditorServices = require('../services/expeditorServices');
const bcrypt = require('bcrypt');
const db = require('../config/db');

var project_id = 0 
const viewSendRequest = async (req, res) => {
    res.render('sendRequest', {name: req.user.name});
}
const viewOrder = async (req, res) => {
    const projects = await expeditorServices.getProjects();
    const materials = await expeditorServices.showMaterials();
//    console.log(projects);
  
    res.render('order', {name: req.user.name, projects, materials});
}
// const viewUsedMaterial = async (req, res) => {
//     res.render('usedMaterial', {name: req.user.name});
// }

const addNewOrder = async (req, res) => {
    try{
    const o_id =await expeditorServices.addNewOrder(req.body);
// console.log(o_id);
    return res.status(200).send({o_id: o_id, err: ''});
    }
    catch(err){
        return res.status(200).send({err: `${err}`});
    }
}

const sendOrder = async (req, res) => {
    try{
    await expeditorServices.sendOrder(req.body);
    return res.status(200).send({err: ''});
    }
    catch(err){
        return res.status(200).send({err: `${err}`});
    }
    
}
const getOrdersAndEstimations = async (req, res) => {
    try{
    const [orders, estimations]= await expeditorServices.getOrdersAndEstimations(req.body);
    // console.log(estimations);
    return res.status(200).send({orders: orders ,estimations:estimations, err: ''});
    } 
    catch(err){
        return res.status(200).send({err: `${err}`});
    }
    
}

const showCompleteOrder = async (req, res) => {
    try{
    const [order_state,order_items]= await expeditorServices.showCompleteOrder(req.body);
    return res.status(200).send({order_items: order_items, order_state:order_state, err: ''});
    } 
    catch(err){
        return res.status(200).send({err: `${err}`});
    }
    
}

const showCompleteEstimate = async (req, res) => {
    try{
    const estimate_materials= await expeditorServices.showCompleteEstimate(req.body);
    return res.status(200).send({estimate_materials: estimate_materials, err: ''});
    } 
    catch(err){
        return res.status(200).send({err: `${err}`});
    }
    
}

const deleteOrder = async (req, res) => {
    try{
    await expeditorServices.deleteOrder(req.body);
    return res.status(200).send({err: ''});
    }
    catch(err){
        return res.status(200).send({err: `${err}`});
    }
    
}
//-----------------Get Report----------------

const renderReqReport = async (req,res)=>{
    var allprojects = await expeditorServices.getProjects();// projects
    res.render('usedMaterial', {
        projects: allprojects,

    })
}

const renderReport = async (req,res)=>{
    var proj_id = parseInt(req.body.projectSelect);
    // console.log(proj_id);
    var Details = [];
    var project_name = await expeditorServices.getOneProjectName(proj_id);
    var sections_set = await expeditorServices.getAllsections(proj_id);

    for (var i = 0; i < sections_set.length; i++) {
        var section = []
        var section_name = sections_set[i].section_name;
        var sect_id = sections_set[i].section_id;
        section.push(section_name);
        var projectConsump = await expeditorServices.getConsumptionReport(proj_id,sect_id);
        section.push(projectConsump);
        Details.push(section);
    }
    console.log(Details);

    res.render('report_show',{
        projectName: project_name.project_name,
        report: Details,

    })
}

//----------------------------------------

module.exports = {
    viewSendRequest,
    viewOrder,
    addNewOrder,
    sendOrder,
    getOrdersAndEstimations,
    showCompleteOrder,
    deleteOrder,
    showCompleteEstimate,
    renderReqReport,
    renderReport
    
   
}
