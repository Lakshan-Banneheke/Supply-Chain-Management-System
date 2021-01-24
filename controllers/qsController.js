const qsService = require('../services/qsServices');

var estimate_materials = []
let e_id_send;

const viewEstimation = async (req, res) => {
    const materials = await qsService.showMaterials();
    const allprojects = await qsService.showAllProjects();
    res.render('estimation', {name: req.user.name, allprojects,materials,estimate_materials});
}

const sendEstimation = async (req, res) => {
    try{
        await qsService.sendEstimate(e_id_send);
        e_id_send ="";
        return res.status(200).send({result: 'redirect', url: 'estimationView', err: ''});
        }
        catch(err){
            return res.status(200).send({err: `${err}`});
        }
}

const deleteEstimate = async (req, res) => {
    try{
        await qsService.deleteEstimate(e_id_send);
        e_id_send ="";
        return res.status(200).send({result: 'redirect', url: 'estimationView', err: ''});
    }
    catch(err){
        return res.status(200).send({err: `${err}`});
    }
}

// const editEstimation = async (req, res) => {
//     const materials = await qsService.showMaterials();
//     const allprojects = await qsService.showAllProjects();
//     res.render('estimation', {name: req.user.name, allprojects,materials,estimate_materials});
// }

const viewEstimationView = async (req, res) => {
    e_id_send = req.body.e_id;
    const estimates = await qsService.showEstimate(req.body);
    const est_project = await qsService.showEst_Project(req.body);
    const allprojects = await qsService.showAllProjects();
    res.render('estimationView', {name: req.user.name,estimates,est_project,allprojects});
}

const getProjectEstimations = async (req, res) => {
    try{
        const Project_name = req.body.Project_name;
        const project_id = await qsService.getProjectIdFromName(Project_name);
        const projectestimations = await qsService.getProjectEstimations(project_id);
        return res.status(200).send({projectestimations:projectestimations, err: ''});
    } 
    catch(err){
        return res.status(200).send({err: `${err}`});
    }
}

const viewCreateProject = async (req, res) => {
    res.render('createProject', {name: req.user.name});
}

const viewProject = async (req, res) => {
    try{
        const viewProjects = await qsService.ViewProjects(req.body);
        return res.status(200).send({viewProjects:viewProjects, err: ''});
    } 
    catch(err){
        return res.status(200).send({err: `${err}`});
    }
}

const addNewMaterial = async (req, res) => {
    try{
        await qsService.addNewMaterial(req.body);
        return res.status(200).send({result: 'redirect', url: 'estimation', err: ''});
        }
        catch(err){
            return res.status(200).send({err: `${err}`});
    }
}

const addNewestimateMaterial = async (req, res) => {
    try{
        const material_select = req.body.material_select;
        const material_quantity = req.body.material_quantity;
        let material_name;
        let material_amount;
        [material_name,material_amount] = material_select.split(/\s{9}/);
        const estimateMaterials = await qsService.showMaterialtoEstimate(material_name,material_amount);
        let material_cost = (estimateMaterials[0].m_cost)*material_quantity;
        estimate_materials.push({material_name,material_amount,material_quantity,material_cost});
        return res.status(200).send({result: 'redirect', url: 'estimation', err: ''});
    }
    catch(err){
        return res.status(200).send({err: `${err}`});
    }
}

const deleteNewestimateMaterial = async (req, res) => {
    try{
        estimate_materials.pop();
        return res.status(200).send({result: 'redirect', url: 'estimation', err: ''});
    }
    catch(err){
        return res.status(200).send({err: `${err}`});
    }
}

const saveNewEstimate = async (req, res) => {
    try{
        const project_name = req.body.p_name;
        await qsService.saveNewEstimate(project_name,estimate_materials);
        estimate_materials = []
        return res.status(200).send({result: 'redirect', url: 'estimation', err: ''});
        }
        catch(err){
            return res.status(200).send({err: `${err}`});
        }
}
const saveNewProject = async (req, res) => {
    try{
        await qsService.saveNewProject(req.body);
        return res.status(200).send({result: 'redirect', url: 'createProject', err: ''});
        }
        catch(err){
            return res.status(200).send({err: `${err}`});
        }
}



module.exports = {
    viewEstimation,
    viewEstimationView,
    addNewMaterial,
    addNewestimateMaterial,
    deleteNewestimateMaterial,
    saveNewEstimate,
    viewCreateProject,
    saveNewProject,
    sendEstimation,
    deleteEstimate,
    getProjectEstimations,
    viewProject
}
