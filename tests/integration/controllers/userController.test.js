const request = require('supertest');
const userController = require('../../../controllers/userController');
const db = require('../../../config/db');

let server;

describe('register', () => {
    let res;
    let req;
    beforeEach(async () => {
        server = require('../../../index');
        req = {
            body: {
                name: 'Sarah Hyland',
                email: 'sarah@gmail.com',
                password: '123456',
                password2: '123456',
                category: '2',
                gender: 'Female',
                contactNo: '07123232323'
            }
        }

        res = {
            send : jest.fn(),
            status : function () {
                return this;
            }
        }
    });

    afterEach(async () => {
        server.close();
    });

    it('should successfully register', async ()=>{
        await userController.register(req, res);
        const expected = {result: 'redirect', url: 'login'}
        const out = await db.query(`SELECT email FROM user_profile WHERE email = 'sarah@gmail.com'`)
        expect(out.rows[0]).toEqual({"email": "sarah@gmail.com"});
        expect(res.send).toHaveBeenCalledWith(expected);
        await db.query(`DELETE FROM user_profile WHERE email = 'sarah@gmail.com'`)
    })

    it('should give email already registered error', async ()=>{
        req.body.email = 'sarah123@gmail.com';
        const query = `CALL registerUser ($1, $2, $3, $4, $5, $6)`;
        await db.query(query, [req.body.name, req.body.password, req.body.email, req.body.category, req.body.contactNo, req.body.gender]);
        await userController.register(req, res);
        const expected = {
            result: 'redirect',
            url:  "register/?registrationError=Email error: Email sarah123@gmail.com is already registered already registered&name=Sarah Hyland&email=sarah123@gmail.com&category=2&gender=Female&contactNo=07123232323"
        }
        expect(res.send).toHaveBeenCalledWith(expected);
        await db.query(`DELETE FROM user_profile WHERE email = 'sarah123@gmail.com'`)
    })

    it('should give password mismatch error', async ()=>{
        req.body.password2 = '567890'
        await userController.register(req, res);
        const expected = {
            result: 'redirect',
            url:  "register/?registrationError=Password does not match retype password&name=Sarah Hyland&email=sarah@gmail.com&category=2&gender=Female&contactNo=07123232323"
        }
        expect(res.send).toHaveBeenCalledWith(expected);
    })

    it('should give validation error', async ()=>{
        req.body.category = '8';
        await userController.register(req, res);
        const expected = {
            result: 'redirect',
            url :  "register/?registrationError=ValidationError: \"category\" must be one of [2, 3, 4, 5, 6]&name=Sarah Hyland&email=sarah@gmail.com&category=8&gender=Female&contactNo=07123232323"
        }
        expect(res.send).toHaveBeenCalledWith(expected);
    })
})
