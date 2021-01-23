const supervisorModel = require('../models/supervisorModel')


var designation = 'on-site-supervisor'

var user_id = 0
var user_name = ""

var project_id = 0 
var section_id = 0

var project_name = ""
var section_name = ''
var req_note = ''

var errors = ''

var tempNotificationt =[]

const renderDashboard = async (req,res)=>{
    user_id = req.user.user_id;
    user_name = req.user.name;
 
    res.render('supervisorDashboard',{
        // desig:designation,
        // name: user_name,
        // error: errors
    });
}

const renderCreateNewReqP = async (req,res)=>{
    var allprojects = await supervisorModel.getAllprojects();
    initiateProject();
    res.render('create_new_reqP',{
        projects: allprojects
    })
}
const renderCreateNewReqS = async (req,res)=>{
    project_id = parseInt(req.body.projectSelect);
    project_name = await supervisorModel.getOneProjectName(project_id);
    var projectSections = await supervisorModel.getAllsections(project_id);

    res.render('create_new_reqS',{
        selectedProjectName: project_name.project_name,
        sections: projectSections,
    })
}

const renderReqForm = async (req,res)=>{
    section_id = parseInt(req.body.sectionSelect);
    section_name = await supervisorModel.getProjectSectionName(project_id,section_id);
    req_note = req.body.shortnote;
    var MaterialsInStock = await supervisorModel.getAllmaterial()
    var today = new Date()
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); 
    var yyyy = today.getFullYear();
    var date = yyyy + '-' + mm + '-' + dd;
    res.render('material_req_form',{

        projectName: project_name.project_name,    //project_name
        projectSection: section_name.section_name, // section_name
        note: req_note,
        date: date,
        materials: MaterialsInStock,  

    })
}


const collectSumbitData = async (req,res)=>{
    
    var today = new Date()
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); 
    var yyyy = today.getFullYear();
    var date = yyyy + '-' + mm + '-' + dd;
    var projectData = { project_id,section_id,user_id,req_note,date}
    console.log(section_id);
    console.log(projectData);
    try {
 
        var materialData = req.body
        var len = materialData["len"];
        var matLis = []
        for (var i = 0; i < len; i ++) {
            var material_name = materialData["table["+i+"][Material Name]"];
            var material_qt =  parseInt(materialData["table["+i+"][Quantity]"]) ;
            var material = {material_name,material_qt}
            matLis.push(material);
        }
        //console.log(matLis)
        saveToSiteReqTable(projectData,matLis)
        initiateProject()
        var msg = saveToNotificationTable("New Material Request Create","store-keeper","on-site-supervisor")
        return res.status(200).send({ result: 'redirect', url: '/supervisor-dashboard' });
    } catch (err) {
        console.log(err)
            return res.status(200).send({
                result: 'redirect',
                url: `/material-req-form`
            });
    }
   
}


const sendToExpeditor = async (req,res)=>{
    var msg = saveToNotificationTable(req.body.msg,"Expeditor","On-Site-Supervisor")
    res.render('supervisorDashboard', {
        // desig:designation,
        // name: loggedUser,
        // error: msg      // msg
    });
}

function initiateProject(){
    project_id = 0 
    section_id = 0
    
    project_name = ""
    section_name = ''
    
    req_note = ''
}



const saveToSiteReqTable = async (projectData,materialData)=>{

    var out_put =  await supervisorModel.createNewRequest(projectData['project_id'],projectData['section_id'],projectData['user_id'],projectData['date'],projectData['req_note']);
    var req_id = out_put.request_id 
    for (var i = 0; i < materialData.length; i++) {
        saveToMatReqTable(req_id,materialData[i])
    }
    

}
const saveToMatReqTable = async (rID,materialSingleData)=>{
   
    var out_put =  await supervisorModel.addReqMaterial(rID,materialSingleData["material_name"],materialSingleData["material_qt"]);
}

const saveToNotificationTable = async (msg,to_d,from_d) =>{
    var today = new Date()
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); 
    var yyyy = today.getFullYear();
    var today = yyyy + '-' + mm + '-' + dd;
    var out_put =  await supervisorModel.addNotification(msg,to_d,"unread",from_d,today);
    return "Send Success";
}


//-----------------Get Report----------------

const renderReqReport = async (req,res)=>{
    var allprojects = await supervisorModel.getAllprojects(); // projects
    res.render('get_report', {
        projects: allprojects,

    })
}

const renderReport = async (req,res)=>{
    var proj_id = parseInt(req.body.projectSelect);
    
    var Details = [];
    var project_name = await supervisorModel.getOneProjectName(proj_id);
    var sections_set = await supervisorModel.getAllsections(proj_id);

    for (var i = 0; i < sections_set.length; i++) {
        var section = []
        var section_name = sections_set[i].section_name;
        var sect_id = sections_set[i].section_id;
        section.push(section_name);
        var projectConsump = await supervisorModel.getConsumptionReport(proj_id,sect_id);
        section.push(projectConsump);
        Details.push(section);
    }

    res.render('report_show',{
        projectName: project_name,
        report: Details,

    })
}


//----------------------------------------

module.exports = {
    renderDashboard,
    renderCreateNewReqP,
    renderCreateNewReqS,
    renderReqForm,
    collectSumbitData,
    renderReqReport,
    renderReport,
    sendToExpeditor
}
