const request = require('supertest');
const storekeeperController = require('../../../controllers/storekeeperController');
const db = require('../../../config/db');
const { default: expectCt } = require('helmet/dist/middlewares/expect-ct');
const { dropView } = require('node-pg-migrate/dist/operations/views');

let server;

describe('get stock', ()=>{
    let res;
    let req = {
        user:{
            name:"pasan"
        }
    
    }

    beforeEach(async () => {
        server = require('../../../index');
        res = {
            render : jest.fn(),
        }
    });

    afterEach( () => {
        server.close();
    });

    it('should render stock page', async ()=>{
        await storekeeperController.renderStock(req, res);
        // expectCt(res.render).toHaveBeenCalled();
        expect(res.render).toHaveBeenCalledWith('stock',
        {
            name: 'pasan',
            notifications: [],
            stocks: [
              {
                stock_id: 1,
                material_name: 'Cement',
                material_quantity: 100,
                unit: 'pct'
              },
              {
                stock_id: 2,
                material_name: 'Steel',
                material_quantity: 100,
                unit: 'pct'
              },
              {
                stock_id: 3,
                material_name: 'Sand',
                material_quantity: 100,
                unit: 'cube'
              },
              {
                stock_id: 4,
                material_name: 'Plate',
                material_quantity: 100,
                unit: 'pcs'
              },
              {
                stock_id: 5,
                material_name: 'Bolts',
                material_quantity: 100,
                unit: 'pcs'
              }
            ],
            not_dates: []
          }
        );
        
    });
})




describe('material requests', ()=>{
    let res;
    let req = {
        user:{
            name:"pasan"
        },
        params:{
            id:1
        }
    
    }

    beforeEach(async () => {
        server = require('../../../index');
        res = {
            render : jest.fn(),
            redirect:jest.fn()
        }
    });

    afterEach( () => {
        server.close();
    });

    it('should render all material requests page', async ()=>{
        await storekeeperController.renderMaterialRequests(req, res);
        expect(res.render).toHaveBeenCalledWith('materialrequests',
        {
            name: 'pasan',
            materialRequests: [],
            request_dates: [],
            count_req: '0',
            count_comp_req: '0',
            notifications: [],
            not_dates: []
          }
        );
      
        
    });

    it('should render material requests view', async ()=>{
        await storekeeperController.renderMaterialRequestView(req, res);
        expect(res.render).toHaveBeenCalledWith('materialrequestview',
        {
            name:"pasan",
            materials: [],
            req_det:undefined,
            req_id:1
          }
        );
        
    });


    it('should issue materials - (redirect to /store/materialrequests)', async ()=>{
        await storekeeperController.renderMaterialRequestView(req, res);
        expect(res.render).toHaveBeenCalledWith('materialrequestview',{
            name:"pasan",
            materials: [],
            req_det:undefined,
            req_id:1
        })
        //check this error
    });


    it('should render material request submit success view',async ()=>{
        await storekeeperController.handleReqSubmission(req, res);
        expect(res.render).toHaveBeenCalledWith('materialrequestsuccessview',{
            name:"pasan",
            materials: [],
            req_det:undefined,
            req_id:1,
        }
        );})

    it('should render material request revision view',async ()=>{

        // await db.query("insert into site_request (project_id,section_id,user_id,request_state,request_date) values(1,1,'5f47831c-bdce-4e32-ba9c-473d51dbc1b1','not completed','2020-01-01')")
        // await db.query("insert into material_request(request_id,material_name,requested_quantity) values (12,'Steel',1000)")

        await storekeeperController.handleReqSubmission(req, res);
        expect(res.render).toHaveBeenCalledWith('materialrequestsuccessview',{
            name:"pasan",
            materials: [],
            req_det:undefined,
            req_id:1,
        }
    );})

    
})



describe('material orders', ()=>{
    let res;
    let req = {
        user:{
            name:"pasan"
        },
        params:{
            id:1
        }
    
    }

    beforeEach(async () => {
        server = require('../../../index');
        res = {
            render : jest.fn(),
        }
    });

    afterEach( () => {
        server.close();
    });

    it('should render material orders page', async ()=>{
        await storekeeperController.renderMaterialOrders(req, res);
        expect(res.render).toHaveBeenCalledWith('materialorders',
         {
            name: 'pasan',
            orders: [],
            order_dates: [],
            all_ord: '0',
            comp_ord: '0',
            notifications: [],
            not_dates: []
          }
        );
        
    });

    it('should render material order view', async ()=>{
        await storekeeperController.renderMaterialOrderView(req, res);
        expect(res.render).toHaveBeenCalledWith('materialorderview',
        {
            name:"pasan",
            materials: [],
            req_det:undefined,
            req_id:1
          }
        );
        
    });


    it('should render change material order view', async ()=>{
        await storekeeperController.renderChangeMaterialOrderView(req, res);
        expect(res.render).toHaveBeenCalledWith('materialorderchangeview',
        {
            name:"pasan",
            materials: [],
            req_det:undefined,
          }
        );
        
    });


})




describe('update stocks', ()=>{
    let res;
    let req = {
        user:{
            name:"pasan"
        },
        params:{
            id:1
        },
        body:{}
    }

    beforeEach(async () => {
        server = require('../../../index');
        res = {
            redirect : jest.fn(),
            render:jest.fn()
        }
    });

    afterEach( () => {
        server.close();
    });


    it('should render stock update view', async ()=>{
        await storekeeperController.renderStockUpdate(req, res);
        expect(res.render).toHaveBeenCalledWith('stockupdates',
        {
            name:"pasan",
            materialOrders: []
          }
        );
    });

    it('should update stocks with no change', async ()=>{
        await storekeeperController.updateStocksNoChange(req, res);
        expect(res.redirect).toHaveBeenCalled() 
    });

    it('should update stocks with change', async ()=>{
        await storekeeperController.updateStocksWithChange(req, res);
        expect(res.redirect).toHaveBeenCalled() 
    });
   
})


describe('issue materials', ()=>{
    let res;
    let req = {
        user:{
            name:"pasan"
        },
        params:{
            id:1
        },
        body:{}
    }

    beforeEach(async () => {
        server = require('../../../index');
        res = {
            redirect : jest.fn(),
        }
    });

    afterEach( () => {
        server.close();
    });


    it('issue materials - redirect to materialsreqests', async ()=>{
        await storekeeperController.issueMaterial(req, res);
        expect(res.redirect).toHaveBeenCalled()
    });

    it('handle revision - redirect to materialsreqests', async ()=>{
        await storekeeperController.revisionHandle(req, res);
        expect(res.redirect).toHaveBeenCalled()
    });

  
   
})


describe('update stocks', ()=>{
    let res;
    let req = {
        user:{
            name:"pasan"
        },
        params:{
            id:1
        },
        body:{}
    }

    beforeEach(async () => {
        server = require('../../../index');
        res = {
            redirect : jest.fn(),
            render:jest.fn()
        }
    });

    afterEach( () => {
        server.close();
    });


    it('should render stock update view', async ()=>{
        await storekeeperController.renderStockUpdate(req, res);
        expect(res.render).toHaveBeenCalledWith('stockupdates',
        {
            name:"pasan",
            materialOrders: []
          }
        );
    });

    it('should update stocks with no change', async ()=>{
        await storekeeperController.updateStocksNoChange(req, res);
        expect(res.redirect).toHaveBeenCalled() 
    });

    it('should update stocks with change', async ()=>{
        await storekeeperController.updateStocksWithChange(req, res);
        expect(res.redirect).toHaveBeenCalled() 
    });
   
})




