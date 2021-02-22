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

    afterEach(() => {
        server.close();
    });
        //passed
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

        //have to fix bug-parse error 
    it('should give email already taken error', async ()=>{
        req.body.new_email = 'john@gmail.com';
        const query = `CALL editProfile ($1, $2, $3, $4)`;
        await db.query(query, [req.body.new_name, req.body.new_email, req.body.new_contact_num, req.user.user_id]);
        await adminController.editInfo(req, res);
        const expected = "/admin/editInfo/?editInfoError=Email error: Email john@gmail.com is already registered&existing_name=Shashini&existing_email=shashw@gmail.com&existing_contactNum=07182266663";
        expect(res.redirect).toHaveBeenCalledWith(expected);
        await db.query(`UPDATE user_profile SET name='Shashini',email ='shashw@gmail.com' where user_id='2fd685ed-979a-4a2e-8c6c-3370eb025228'`);
    });

//     // it('should give password mismatch error', async ()=>{
//     //     req.body.password2 = '567890'
//     //     await userController.register(req, res);
//     //     const expected = {
//     //         result: 'redirect',
//     //         url:  "register/?registrationError=Password does not match retype password&name=Sarah Hyland&email=sarah@gmail.com&category=2&gender=Female&contactNo=07123232323"
//     //     }
//     //     expect(res.send).toHaveBeenCalledWith(expected);
//     // })

//     // it('should give validation error', async ()=>{
//     //     req.body.category = '8';
//     //     await userController.register(req, res);
//     //     const expected = {
//     //         result: 'redirect',
//     //         url :  "register/?registrationError=ValidationError: \"category\" must be one of [2, 3, 4, 5, 6]&name=Sarah Hyland&email=sarah@gmail.com&category=8&gender=Female&contactNo=07123232323"
//     //     }
//     //     expect(res.send).toHaveBeenCalledWith(expected);
//     // })
});
