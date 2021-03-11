const qsController = require('../../../controllers/qsController');
const db = require('../../../config/db');

let server;

describe('viewestimation', ()=>{
    beforeEach(() => { server = require('../../../index'); })
    afterEach(async () => { server.close(); });

    it('should render estimationView', async ()=>{
        await db.query(`INSERT INTO project(project_name,start_date) VALUES ('First project','2021-01-01')`);
        await db.query(`INSERT INTO estimate(project_id,create_date,submit_status) VALUES (1,'2021-01-02','0')`);
        await db.query(`INSERT INTO MaterialValue(m_name,m_amount,m_cost) VALUES ('Steel','7ft x 80in',40000)`);
        await db.query(`INSERT INTO est_mat(e_id,m_id,quantity) VALUES (1,1,5)`);
        
        req = {
            user:{
                name:"danuka"
            },
            body:{
                e_id:1
            }
        
        }
        res = {
            render : jest.fn(),
        }
        await qsController.viewEstimationView(req, res);
        expect(res.render).toHaveBeenCalledWith('estimationView',
        { 
            name: 'danuka',
            allprojects: [
                {
                    project_id: 1,
                    project_name: "First project",
                    start_date: new Date("2020-12-31T18:30:00.000Z"),
                }
            ],
            est_project: [
                {
                    e_id: 1,
                    project_id: 1,
                    project_name: "First project",
                    create_date: new Date("2021-01-01T18:30:00.000Z"),   
                    start_date: new Date("2020-12-31T18:30:00.000Z"),    
                    submit_status: false,
                    submit_date: null,   
                }
            ],
            estimates: [
                {
                    m_amount: "7ft x 80in",
                    m_cost: "40000",
                    m_name: "Steel",
                    project_id: 1,
                    quantity: 5,
                }
            ]
          }
        );
    });

    it('should get project Estimations', async ()=>{
        req = {
            body: {
                Project_name:'First project'
            }
        
        }
        res = {
            send : jest.fn(),
            status : function () {
                return this;
            }
        }
        await qsController.getProjectEstimations(req, res);
        const expected = {
            projectestimations:  [
                {
                    e_id: 1,
                    submit_status: false,
                    to_char: "2021-01-02",
                }
            ], 
            err: ''}
        expect(res.send).toHaveBeenCalledWith(expected);

    });

    it('should not get any project Estimations', async ()=>{
        req = {
            body: {}
        }
        res = {
            send : jest.fn(),
            status : function () {
                return this;
            }
        }
        await qsController.getProjectEstimations(req, res);
        const expected = { err: "TypeError: Cannot read property 'project_id' of undefined" }
        expect(res.send).toHaveBeenCalledWith(expected);
    });

    it('should send estimation', async ()=>{
        await qsController.sendEstimation(req, res);
        const expected = {result: 'redirect', url: 'estimationView',err: ''}
        expect(res.send).toHaveBeenCalledWith(expected);
    });

    it('should delete estimation', async ()=>{
        await qsController.deleteEstimate(req, res);
        const expected = {result: 'redirect', url: 'estimationView',err: ''}
        expect(res.send).toHaveBeenCalledWith(expected);
    });

});



describe('create estimation', ()=>{
    let res;
    beforeEach(async () => {
        server = require('../../../index');
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
    
    it('should render estimation', async ()=>{
        req = {
            user:{
                name:"danuka"
            }
        
        }
        res = {
            render : jest.fn(),
        }
        await qsController.viewEstimation(req, res);
        expect(res.render).toHaveBeenCalledWith('estimation',
        { 
            name: 'danuka',
            allprojects: [
                {
                    project_id: 1,
                    project_name: "First project",
                    start_date: new Date("2020-12-31T18:30:00.000Z"),
                }
            ],
            materials: [
                {
                    m_amount: "7ft x 80in",      
                    m_cost: "40000",
                    m_id: 1,
                    m_name: "Steel",
                }
            ],
            estimate_materials: []
          }
        );

    });

    it('should add newestimatematerials', async ()=>{
        let req = {
            body: {
                material_select: "Steel         7ft x 80in",
                material_quantity: 10,
            }
        }
        await qsController.addNewestimateMaterial(req, res);
        const expected = {result: 'redirect', url: 'estimation',err: ''}
        expect(res.send).toHaveBeenCalledWith(expected);
    });

    it('should not add newestimatematerials', async ()=>{
        let req = {
            body: {}
        }
        await qsController.addNewestimateMaterial(req, res);
        const expected = {err: "TypeError: Cannot read property 'split' of undefined"}
        expect(res.send).toHaveBeenCalledWith(expected);
    });
    
    it('should delete newestimatematerials', async ()=>{
        await qsController.deleteNewestimateMaterial(req, res);
        const expected = {result: 'redirect', url: 'estimation',err: ''}
        expect(res.send).toHaveBeenCalledWith(expected);
    });

    it('should save estimate', async ()=>{
        let req = {
            body: {
                p_name: "First project",
            }
        }
        await qsController.saveNewEstimate(req, res);
        const expected = {result: 'redirect', url: 'estimation',err: ''}
        expect(res.send).toHaveBeenCalledWith(expected);
    });

    it('should not save estimate', async ()=>{
        let req = {
            body: {}
        }
        await qsController.saveNewEstimate(req, res);
        const expected = { err: "TypeError: Cannot read property 'project_id' of undefined" }
        expect(res.send).toHaveBeenCalledWith(expected);
    });
});

describe('view project', ()=>{
    let res;
    beforeEach(async () => {
        server = require('../../../index');
        res = {
            send : jest.fn(),
        }
    });

    afterEach( () => {
        server.close();
    });

    it('should get projects', async ()=>{
        req = {
            body: {
                from_date: "2021-01-01",
                to_date: "2021-01-10"
            }
        
        }
        res = {
            send : jest.fn(),
            status : function () {
                return this;
            }
        }
        await qsController.viewProject(req, res);
        const expected = {
            viewProjects:  [
                {
                    project_id: 1,
                    project_name: "First project",
                    to_char: "2021-01-01",
                }
            ], 
            err: ''}
        expect(res.send).toHaveBeenCalledWith(expected);
    });

    it('should not get projects', async ()=>{
        req = {}
        res = {
            send : jest.fn(),
            status : function () {
                return this;
            }
        }
        await qsController.viewProject(req, res);
        const expected = { err: "TypeError: Cannot destructure property 'from_date' of 'undefined' as it is undefined." }
        expect(res.send).toHaveBeenCalledWith(expected);
    });
});


describe('create project', ()=>{
    let res;
    beforeEach(async () => {
        server = require('../../../index');
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

    it('should save project', async ()=>{
        let req = {
            body: {
                p_name: "Second project",
                p_startDate: "2021-03-08"
            }
        }
        await qsController.saveNewProject(req, res);
        const expected = {result: 'redirect', url: 'createProject',err: ''}
        expect(res.send).toHaveBeenCalledWith(expected);
    });

    it('should not save project', async ()=>{
        let req = {}
        await qsController.saveNewProject(req, res);
        const expected = { err: "TypeError: Cannot destructure property 'p_name' of 'undefined' as it is undefined." }
        expect(res.send).toHaveBeenCalledWith(expected);
    });

    it('should render createProject', async ()=>{
        req = {
            user:{
                name:"danuka"
            }
        
        }
        res = {
            render : jest.fn(),
        }
        await qsController.viewCreateProject(req, res);
        expect(res.render).toHaveBeenCalledWith('createProject',
        { 
            name: 'danuka',
            allprojects: [
                {
                    project_id: 1,
                    project_name: "First project",
                    start_date: new Date("2020-12-31T18:30:00.000Z"),
                },
                {
                    project_id: 2,
                    project_name: "Second project",
                    start_date: new Date("2021-03-07T18:30:00.000Z"),
                }
            ]
          }
        );
    });
});



describe('create projectsection', ()=>{
    let res;
    beforeEach(async () => {
        server = require('../../../index');
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

    it('should save projectsection', async ()=>{
        let req = {
            body: {
                project_name: "First project",
                section_name: "AAA"
            }
        }
        await qsController.saveNewProjectSection(req, res);
        const expected = {result: 'redirect', url: 'createProject',err: ''}
        expect(res.send).toHaveBeenCalledWith(expected);
    });

    it('should not save projectsection', async ()=>{
        let req = {
            body: {}
        }
        await qsController.saveNewProjectSection(req, res);
        const expected = {err: "TypeError: Cannot read property 'project_id' of undefined" }
        expect(res.send).toHaveBeenCalledWith(expected);
    });
});



describe('Create Material', ()=>{
    let res;
    beforeEach(async () => {
        server = require('../../../index');
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

    it('should save material', async ()=>{
        let req = {
            body: {
                m_name: "Steel 2",
                m_amount: "9ft x 80in",
                m_cost: 8000
            }
        }
        await qsController.addNewMaterial(req, res);
        const expected = {result: 'redirect', url: 'estimation',err: ''}
        expect(res.send).toHaveBeenCalledWith(expected);
    });
    
    it('should not save material', async ()=>{
        let req = {}
        await qsController.addNewMaterial(req, res);
        const expected = { err: "TypeError: Cannot destructure property 'm_name' of 'undefined' as it is undefined." }
        expect(res.send).toHaveBeenCalledWith(expected);
        
        async function cleardb() {
            await db.query(`DELETE FROM est_mat`);
            await db.query(`DELETE FROM MaterialValue`);
            await db.query(`DELETE FROM estimate`);
            await db.query(`DELETE FROM project_section`);
            await db.query(`DELETE FROM project`);
        }
        cleardb();
    });       
})