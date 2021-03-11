const expeditorController = require('../../../controllers/expeditorController');
const db = require('../../../config/db');


let server;

describe('order page', ()=>{
    let res;
    let req;

    beforeEach(async () => {
        server = require('../../../index');
    });

    afterEach( () => {
        server.close();
    });
 
    it('should render order page', async ()=>{
        req = {
            user:{
                name:"dilshan"
            }
        
        }
        res = {
            render : jest.fn(),
        }
 
        await db.query(`INSERT INTO project(project_id, project_name,start_date) VALUES (1, 'First project','2021-01-01')`);
        await db.query(`INSERT INTO project(project_id, project_name,start_date) VALUES (2, 'Second project','2021-01-05')`);

        await db.query(`INSERT INTO MaterialValue(m_id, m_name,m_amount,m_cost) VALUES (1, 'Steel','7ft x 80in',40000)`);
        await db.query(`INSERT INTO MaterialValue(m_id, m_name,m_amount,m_cost) VALUES (2, 'Concrete','Cubic yard',10000)`);
        await db.query(`INSERT INTO MaterialValue(m_id, m_name,m_amount,m_cost) VALUES (3, 'Pine','2in x 4in - 12ft',600)`);
        await db.query(`INSERT INTO MaterialValue(m_id, m_name,m_amount,m_cost) VALUES (4, 'Latex Paint','Gallon 2 coats',3000)`);

        await expeditorController.viewOrder(req, res);
        expect(res.render).toHaveBeenCalledWith('order',
        { 
            name: 'dilshan',
            projects: [
                {
                  project_id: 1,
                  project_name: 'First project',
                  start_date: new Date("2020-12-31T18:30:00.000Z")
                },
                {
                  project_id: 2,
                  project_name: 'Second project',
                  start_date: new Date("2021-01-04T18:30:00.000Z") 
                },
            ],
            materials: [
              { 
                m_id: 1,
                m_name: 'Steel',
                m_amount: '7ft x 80in',
                m_cost: '40000' 
              },
              {
                m_id: 2,
                m_name: 'Concrete',
                m_amount: 'Cubic yard',
                m_cost: '10000'
              },
              {
                m_id: 3,
                m_name: 'Pine',
                m_amount: '2in x 4in - 12ft',
                m_cost: '600'
              },
              {
                m_id: 4,
                m_name: 'Latex Paint',
                m_amount: 'Gallon 2 coats',
                m_cost: '3000'
              }
            ]
          }
        );
        
    });
    it('should get Orders And Estimations', async ()=>{

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
        //add test data
        await db.query(`INSERT INTO estimate(e_id, project_id,create_date,submit_status,submit_date) VALUES (1, 1,'2021-01-02','1','2021-01-05')`);
        await db.query(`INSERT INTO estimate(e_id, project_id,create_date,submit_status,submit_date) VALUES (2, 1,'2021-01-06','1','2021-01-09')`);

        await db.query(`INSERT INTO Material_Order(order_id, project_id,shop_name,order_date,order_state,ordered) VALUES (1, 1,'ABC Suppliers','2020-12-12','not completed',true)`);
        await db.query(`INSERT INTO Material_Order(order_id, project_id,shop_name,order_date,order_state,ordered) VALUES (2, 2,'ABC Suppliers1','2020-12-12','not completed',true)`);

        await expeditorController.getOrdersAndEstimations(req, res);
        const expected = {
            orders: [
                {
                    order_id: 1,
                    project_id: 1,
                    shop_name: 'ABC Suppliers',
                    order_date: new Date("2020-12-11T18:30:00.000Z"),
                    ordered: true,
                    order_state: 'not completed',
                    received_date: null
                  }
                  ],
            estimations:  [
                {
                    e_id: 1,
                    project_id: 1,
                    create_date: new Date("2021-01-01T18:30:00.000Z"),
                    submit_status: true,
                    submit_date: new Date("2021-01-04T18:30:00.000Z")
                  },
                  {
                    e_id: 2,
                    project_id: 1,
                    create_date: new Date("2021-01-05T18:30:00.000Z"),
                    submit_status: true,
                    submit_date: new Date("2021-01-08T18:30:00.000Z")
                  }
              ], 
            err: ''}
        expect(res.send).toHaveBeenCalledWith(expected);
    }); 
})

describe('Create Order', ()=>{
    let res;
    let order_id;
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

    it('should save order', async ()=>{
        let req = {
            body: {
                  final_materials: [ 1,2,3 ],
                  final_quantiies: [ '1', '1', '1' ],
                  optionProject: 'First project',
                  shop_name: 'nimal hardware'
            }
        
        }
        await expeditorController.addNewOrder(req, res);
        const o_id = (await db.query(`SELECT order_id FROM Material_Order ORDER BY order_id DESC LIMIT 1`)).rows[0]
        order_id=o_id.order_id
        const expected = {o_id: order_id, err: ''}
        expect(res.send).toHaveBeenCalledWith(expected);
        // await db.query(`DELETE FROM Material_Order WHERE order_id = $1`,[order_id])
    });
    it('should send order', async ()=>{
        let req = {
            body: {
                  o_id:order_id
            }
        
        }
        await expeditorController.sendOrder(req, res);
        const out = (await db.query(`SELECT ordered,order_date FROM Material_Order WHERE order_id = $1`,[order_id])).rows[0]
        expect(out.ordered).toBe(true);
        expect(out.order_date).not.toBeNull();
        const expected = {err: ''}
        expect(res.send).toHaveBeenCalledWith(expected);
    }); 
    it('should delete order', async ()=>{
        let req = {
            body: {
                  o_id:order_id
            }
        
        }
        await expeditorController.deleteOrder(req, res);
        const out = (await db.query(`SELECT * FROM Material_Order WHERE order_id = $1`,[order_id])).rows[0]
        expect(out).toBeUndefined();
        const expected = {err: ''}
        expect(res.send).toHaveBeenCalledWith(expected);
    }); 
   
})    


describe('View order and estimation Details', ()=>{
    let res;
    let req;
   

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
    it('should give estimation details', async ()=>{
        req = {
            body: {
                  e_id:1
            }
        
        }
        //add test data
        await db.query(`INSERT INTO est_mat(e_id,m_id,quantity) VALUES (1,1,5)`);
        await db.query(`INSERT INTO est_mat(e_id,m_id,quantity) VALUES (1,2,3)`);
        await db.query(`INSERT INTO est_mat(e_id,m_id,quantity) VALUES (1,4,1)`);
        await db.query(`INSERT INTO est_mat(e_id,m_id,quantity) VALUES (2,2,10)`);
        await db.query(`INSERT INTO est_mat(e_id,m_id,quantity) VALUES (2,4,8)`);

        await expeditorController.showCompleteEstimate(req, res);
        const expected = {
            estimate_materials:[
                {
                  e_id: 1,
                  m_id: 1,
                  quantity: 5,
                  m_name: 'Steel',
                  m_amount: '7ft x 80in',
                  m_cost: '40000',
                  project_id: 1,
                  create_date: new Date("2021-01-01T18:30:00.000Z"),
                  submit_status: true,
                  submit_date: new Date("2021-01-04T18:30:00.000Z")
                },
                {
                  e_id: 1,
                  m_id: 2,
                  quantity: 3,
                  m_name: 'Concrete',
                  m_amount: 'Cubic yard',
                  m_cost: '10000',
                  project_id: 1,
                  create_date: new Date("2021-01-01T18:30:00.000Z"),
                  submit_status: true,
                  submit_date: new Date("2021-01-04T18:30:00.000Z")
                },
                {
                  e_id: 1,
                  m_id: 4,
                  quantity: 1,
                  m_name: 'Latex Paint',
                  m_amount: 'Gallon 2 coats',
                  m_cost: '3000',
                  project_id: 1,
                  create_date: new Date("2021-01-01T18:30:00.000Z"),
                  submit_status: true,
                  submit_date: new Date("2021-01-04T18:30:00.000Z")
                }
            ],
            err: ''}
        expect(res.send).toHaveBeenCalledWith(expected);
    }); 
    it('should not give any estimation details', async ()=>{
        req = {
            body: {
                  e_id:0
            }
        
        }
        await expeditorController.showCompleteEstimate(req, res);
        const expected = {
            estimate_materials:[],
        err: ''}
        expect(res.send).toHaveBeenCalledWith(expected);
    }); 
    it('should give Order details', async ()=>{
        req = {
            body: {
                  o_id:1
            }
        
        }
        //add test data
        await db.query(`INSERT INTO Order_item(order_id,M_id,ordered_quantity) VALUES (1,1,100)`);
        await db.query(`INSERT INTO Order_item(order_id,M_id,ordered_quantity) VALUES (1,2,100)`);

        await db.query(`INSERT INTO Order_item(order_id,M_id,ordered_quantity) VALUES (2,3,200)`);
        await db.query(`INSERT INTO Order_item(order_id,M_id,ordered_quantity) VALUES (2,4,200)`);
        
        await expeditorController.showCompleteOrder(req, res);
        const expected = {
            order_items:[
                {
                    m_id: 1,
                    order_id: 1,
                    ordered_quantity: 100,
                    received_quantity: null,
                    m_name: 'Steel',
                    m_amount: '7ft x 80in',
                    m_cost: '40000'
                  },
                  {
                    m_id: 2,
                    order_id: 1,
                    ordered_quantity: 100,
                    received_quantity: null,
                    m_name: 'Concrete',
                    m_amount: 'Cubic yard',
                    m_cost: '10000'
                  }
            ],
            order_state:[
                { ordered: true } 
            ],
        err: ''}
        expect(res.send).toHaveBeenCalledWith(expected);
    }); 
    it('should not give any order details', async ()=>{
        req = {
            body: { 
                o_id:0
            }
        
        }
        await expeditorController.showCompleteOrder(req, res);
        const expected = {
            order_items:[],
            order_state:[],
        err: ''}
        expect(res.send).toHaveBeenCalledWith(expected);
    }); 
   
})    

describe('Get Report-expeditor', ()=>{
    let res;
    let req;
    beforeEach(async () => {
        server = require('../../../index');
        res = {
            render : jest.fn(),
        }
    });

    afterEach( () => {
        server.close();
    });

    it('should render get report page ', async ()=>{
        await expeditorController.renderReqReport(req, res);
        
        expect(res.render).toHaveBeenCalledWith('usedMaterial', 
            {
                projects: [
                    {
                      project_id: 1,
                      project_name: 'First project',
                      start_date: new Date("2020-12-31T18:30:00.000Z")
                    },
                    {
                      project_id: 2,
                      project_name: 'Second project',
                      start_date: new Date("2021-01-04T18:30:00.000Z") 
                    },
                ],
            }
        );
    });
    it('should show the report', async ()=>{
        req = {
            body: {
                projectSelect: 1,
            }
        
        } 
        //add test data
        await db.query(`INSERT INTO project_section(section_id, section_name,project_id) VALUES (1, 'Floor',1);`);
        await db.query(`INSERT INTO project_section(section_id, section_name,project_id) VALUES (2, 'Roof',1);`);

        await expeditorController.renderReport(req, res);
        expect(res.render).toHaveBeenCalledWith('report_show',
            {
                projectName: 'First project',
                report: [ [ 'Floor', [] ], [ 'Roof', [] ] ],
            }
        );
        // delete all test data
        await db.query(`DELETE FROM project_section WHERE section_id=1;`);
        await db.query(`DELETE FROM project_section WHERE section_id=2;`);
        await db.query(`DELETE FROM project WHERE project_id=1;`);
        await db.query(`DELETE FROM project WHERE project_id=2;`);
        await db.query(`DELETE FROM estimate WHERE e_id=1;`);
        await db.query(`DELETE FROM estimate WHERE e_id=2;`);
        await db.query(`DELETE FROM MaterialValue WHERE m_id=1;`);
        await db.query(`DELETE FROM MaterialValue WHERE m_id=2;`);
        await db.query(`DELETE FROM MaterialValue WHERE m_id=3;`);
        await db.query(`DELETE FROM MaterialValue WHERE m_id=4;`);
    }); 
})  
