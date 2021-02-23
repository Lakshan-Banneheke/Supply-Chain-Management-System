// const request = require('supertest');
const adminController = require('../../../controllers/adminController');
const db = require('../../../config/db');
const { getMaxListeners } = require('../../../config/db');

let server;

describe('edit info', () => {
    let res;
    let req;
    beforeEach(() => {
        server = require('../../../index');
        req = {
            user:{
                name:'Shashini',
                email:'shashw@gmail.com',
                user_id:'2fd685ed-979a-4a2e-8c6c-3370eb025228',
                contact_num:'07182266663'
            },

            body:{
                new_name: 'Mary',
                new_email: 'mary@gmail.com',
                new_contact_num : '07182266663'
            }
        }

        res = {
            redirect: jest.fn()
        }
    });

    afterEach(async() => {
        await db.query(`UPDATE user_profile SET name='Shashini',email ='shashw@gmail.com',contact_num='07182266663' where user_id='2fd685ed-979a-4a2e-8c6c-3370eb025228'`);
        server.close();
    });
        
    it('should successfully edit information', async ()=>{
        let expected_result={
            name: 'Mary',
            email: 'mary@gmail.com',
            contact_num : '07182266663'
        };
        await adminController.editInfo(req, res);
        const expected_url = '/admin';
        const out = await db.query(`SELECT name,email,contact_num FROM user_profile WHERE user_id ='2fd685ed-979a-4a2e-8c6c-3370eb025228'`);
        expect(out.rows[0]).toEqual(expected_result);
        expect(res.redirect).toHaveBeenCalledWith(expected_url);
        await db.query(`UPDATE user_profile SET name='Shashini',email ='shashw@gmail.com' where user_id='2fd685ed-979a-4a2e-8c6c-3370eb025228'`);
    });

        
    it('should give email already taken error', async ()=>{
        req.body.new_email = 'Marieh@gmail.com';
        await adminController.editInfo(req, res);
        const expected = '/admin/editInfo/?editInfoError=Email error: Email Marieh@gmail.com is already registered&existing_name=Shashini&existing_email=shashw@gmail.com&existing_contactNum=07182266663';
        expect(res.redirect).toHaveBeenCalledWith(expected);
        await db.query(`UPDATE user_profile SET name='Shashini',email ='shashw@gmail.com' where user_id='2fd685ed-979a-4a2e-8c6c-3370eb025228'`);
    });

});
