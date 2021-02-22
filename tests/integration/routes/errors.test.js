const errors = require('../../../controllers/errorController');
const request = require('supertest');

let server;


describe('Error controllers', ()=>{
    beforeEach(() => { server = require('../../../index'); })
    afterEach(async () => {
        server.close();
    });

    it('should render 404', async ()=>{
        const res = await request(server).get('/abc');
        expect(res.status).toBe(404);
    })

    it('should render 405', async ()=>{
        let res = {
            render : jest.fn()
        }
        req = {}
        errors.error405(req, res);
        expect(res.render).toHaveBeenCalledWith('errors/405');
    })

})