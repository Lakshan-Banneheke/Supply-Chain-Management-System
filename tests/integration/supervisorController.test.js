const request = require('supertest');
const supervisorController = require('../../../controllers/supervisorController');
const db = require('../../../config/db');

let server;

describe('supervisor-views', ()=>{
    let res;
    req = {
        body:{
            projectSelect:0,
            sectionSelect:0,
            shortnote:''
        },
        user:{
            user_id : 1
        }
    }

    beforeEach(async () => {
        res = {
            render : jest.fn(),
        }
    });


    it('should render all project details page', async ()=>{
        await db.query(`INSERT INTO project(project_name,start_date) VALUES ('First project','2021-03-13')`)
        const projects = [{"project_id": 1,"project_name": "First project","start_date":"2021-03-13"}]        
        await supervisorController.renderCreateNewReqP(req, res);
        expect(res.render).toHaveBeenCalledWith("create_new_reqP", projects );
        await db.query(`DELETE FROM project WHERE project_name = 'First project' AND start_date = '2021-03-13')`);
        
    });

    it('should render all section details page', async ()=>{
        await db.query(`INSERT INTO project_section(section_name,project_id) VALUES ('Floor',1)`)
        res.body.projectSelect = 1
        const expected = {"selectedProjectName": "First project","sections": [{"section_id": 1,"section_name":"Floor"}]} 
        await supervisorController.renderCreateNewReqS(req, res);
        expect(res.render).toHaveBeenCalledWith("create_new_reqS", expected );
        await db.query(`DELETE FROM project_section WHERE section_name = 'Floor' AND project_id = 1)`);
    });

    it('should render material request form page', async ()=>{
        await db.query(`INSERT INTO Stock(material_name,material_quantity,unit) VALUES ('Concrete',100,'Cubic yard')`)
        res.body.projectSelect = 1
        res.body.shortnote ='note'
        var today = new Date()
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); 
        var yyyy = today.getFullYear();
        var dates = yyyy + '-' + mm + '-' + dd;
        const expected = {"projectName": "First project","projectSection": "Floor","note": "note","date": dates,"materials": [{"material_name": "Concrete","unit":"Cubic yard"}]} 
        await supervisorController.renderReqForm(req, res);
        expect(res.render).toHaveBeenCalledWith("material_req_form",expected  );
        await db.query(`DELETE FROM Stock WHERE material_name = 'Concrete' AND material_quantity = 100)`);
    });
})

describe('collect-material', ()=>{
    let res;
    let req;
    beforeEach( () => {
        server = require('../../../index');
        req = {
            body: {
                len:2,
                table:[{"Material Name":"cement", "Quantity":24},
                {"Material Name":"wood", "Quantity":14}]
   
            },
            user:{
                user_id : 1
            }
        }

        res = {
            send : jest.fn(),
            status : function () {
                return this;
            }
        }
    });

    afterEach( () => {
        server.close();
    });

    it('should successfully collected', async ()=>{
        await supervisorController.collectSumbitData(req, res);
        const expected = {result: 'redirect', url: '/'}
        expect(res.send).toHaveBeenCalledWith(expected);
    });

    //test
    it('should give error when collection failed', async ()=>{
        req.body.len = 5;
        await supervisorController.collectSumbitData(req, res);
        const expected = {result: 'redirect', url: '/supervisor/material-req-form'}
        expect(res.send).toHaveBeenCalledWith(expected);
    });

    
})

describe('send message to expeditor', ()=>{
    let res;
    let req;
    beforeEach( () => {
        server = require('../../../index');
        req = {
            body: {
                msg:'a'
            },
            user:{
                user_id : 1
            }
        }

        res = {
            render : jest.fn(),
        }
    });

    afterEach( () => {
        server.close();
    });

    it('should successfully send a message to expeditor', async ()=>{
        await supervisorController.sendToExpeditor(req, res);
        expect(res.render).toHaveBeenCalledWith("/",{});
        await db.query(`DELETE FROM notification WHERE message = 'a'`);
    });



    
})
describe('supervisor-get report', ()=>{
    let res;
    req = {
        body:{
            projectSelect:1,
         
        },
        user:{
            user_id : 1
        }
    }

    beforeEach(async () => {
        res = {
            render : jest.fn(),
        }
    });


    it('should render all project details page', async ()=>{
        await db.query(`INSERT INTO project(project_name,start_date) VALUES ('First project','2021-03-13')`)
        const projects = [{"project_id": 1,"project_name": "First project","start_date":"2021-03-13"}]        
        await supervisorController.renderReqReport(req, res);
        expect(res.render).toHaveBeenCalledWith("get_report", projects );
        await db.query(`DELETE FROM project WHERE project_name = 'First project' AND start_date = '2021-03-13')`);
    });

    it('should render consumption report page', async ()=>{
        await db.query(`INSERT INTO project(project_name,start_date) VALUES ('First project','2021-03-13')`)
        await db.query(`INSERT INTO project_section(section_name,project_id) VALUES ('Floor',1)`)
        res.body.projectSelect = 1
        const expected = {
            "selectedProjectName": "First project",
            "sections": [
                {
                    "section_name":"Floor",
                    "projectConsump":[
                        {"material_name":"","unit":"","received_quantity":0}
                    ]
                }
            ]
        
        } 
        
        await supervisorController.renderReport(req, res);
        expect(res.render).toHaveBeenCalledWith("report_show", expected );
        await db.query(`DELETE FROM project WHERE project_name = 'First project' AND start_date = '2021-03-13')`);
        await db.query(`DELETE FROM project_section WHERE section_name = 'Floor' AND project_id = 1)`);
    });

 
})

