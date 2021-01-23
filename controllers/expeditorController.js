const userValidator = require('./validators/userValidator');
const expeditorServices = require('../services/expeditorServices');
const bcrypt = require('bcrypt');


const viewSendRequest = async (req, res) => {
    res.render('sendRequest', {name: req.user.name});
}
const viewOrder = async (req, res) => {
    const projects = await expeditorServices.getProjects();
    const materials = await expeditorServices.showMaterials();
//    console.log(projects);
  
    res.render('order', {name: req.user.name, projects, materials});
}
const viewUsedMaterial = async (req, res) => {
    res.render('usedMaterial', {name: req.user.name});
}

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


module.exports = {
    viewSendRequest,
    viewOrder,
    viewUsedMaterial,
    addNewOrder,
    sendOrder,
    getOrdersAndEstimations,
    showCompleteOrder,
    deleteOrder,
    showCompleteEstimate
   
}
