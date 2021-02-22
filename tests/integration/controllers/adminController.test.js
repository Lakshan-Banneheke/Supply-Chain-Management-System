const request = require('supertest');
const adminController = require('../../../controllers/adminController');
const db = require('../../../config/db');

let server;

describe('edit info', () => {
    let res;
    let req;
    beforeEach(() => {
        server = require('../../../index');
        req = {
            body: {
                id:'2fd685ed-979a-4a2e-8c6c-3370eb025228',
                name: 'Shashini',
                email: 'shashininew@gmail.com',
                contact_num: '07123232323'
            }
        }

        res = {
            redirect: jest.fn(),
            send : jest.fn(),
            status : function () {
                return this;
            }
        }
    });

    afterEach(() => {
        server.close();
    });

    it('should successfully edit information', async ()=>{
        await adminController.editInfo(req, res);
        const expected = '/admin';
        const out = `SELECT name,email,contact_num FROM user_profile WHERE user_id ='2fd685ed-979a-4a2e-8c6c-3370eb025228'`;
        expect(out.rows[0]).toEqual({name: 'Shashini',email: 'shashini@gmail.com',contact_num: '07123232323'});
        expect(res.redirect).toHaveBeenCalledWith(expected);
        //await db.query(`DELETE FROM user_profile WHERE email = 'shashini@gmail.com'`)
    });
    // it('should give email already registered error', async ()=>{
    //     req.body.email = 'sarah123@gmail.com';
    //     const query = `CALL registerUser ($1, $2, $3, $4, $5, $6)`;
    //     await db.query(query, [req.body.name, req.body.password, req.body.email, req.body.category, req.body.contactNo, req.body.gender]);
    //     await userController.register(req, res);
    //     const expected = {
    //         result: 'redirect',
    //         url:  "register/?registrationError=Email error: Email sarah123@gmail.com is already registered already registered&name=Sarah Hyland&email=sarah123@gmail.com&category=2&gender=Female&contactNo=07123232323"
    //     }
    //     expect(res.send).toHaveBeenCalledWith(expected);
    //     await db.query(`DELETE FROM user_profile WHERE email = 'sarah123@gmail.com'`)
    // })

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
