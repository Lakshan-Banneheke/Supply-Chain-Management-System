const request = require('supertest');
const db = require('../../../config/db');

let server;
describe('/users', ()=>{
    beforeEach(() => { server = require('../../../index'); })
    afterEach(async () => {
        server.close();
    });
   describe('GET /register', () => {
       it('should register successfully', async ()=>{
           const res = await request(server).post('/users/register')
                            .send({
                                name: 'Clarke',
                                email: 'clarke@gmail.com',
                                password: '123456',
                                password2: '123456',
                                category: '2',
                                gender: 'Female',
                                contactNo: '07123232323'
                            });
           const out = await db.query(`SELECT email FROM user_profile WHERE email = 'clarke@gmail.com'`)
           expect(out.rows[0]).toEqual({"email": "clarke@gmail.com"});
           expect(res.status).toBe(200);
           await db.query(`DELETE FROM user_profile WHERE email = 'clarke@gmail.com'`)
       })
})
})