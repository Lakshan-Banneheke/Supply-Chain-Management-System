const request = require('supertest');
const userController = require('../../../controllers/userController');
const db = require('../../../config/db');

let server;

describe('register', () => {
    let res;
    let req;
    beforeEach( () => {
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

    afterEach( () => {
        server.close();
    });

    it('should successfully register', async ()=>{
        await userController.register(req, res);
        const expected = {result: 'redirect', url: 'login'}
        const out = await db.query(`SELECT email FROM user_profile WHERE email = 'sarah@gmail.com'`)
        expect(out.rows[0]).toEqual({"email": "sarah@gmail.com"});
        expect(res.send).toHaveBeenCalledWith(expected);
        await db.query(`DELETE FROM user_profile WHERE email = 'sarah@gmail.com'`)
    });

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
    });

    it('should give password mismatch error', async ()=>{
        req.body.password2 = '567890'
        await userController.register(req, res);
        const expected = {
            result: 'redirect',
            url:  "register/?registrationError=Password does not match retype password&name=Sarah Hyland&email=sarah@gmail.com&category=2&gender=Female&contactNo=07123232323"
        }
        expect(res.send).toHaveBeenCalledWith(expected);
    });

    it('should give validation error', async ()=>{
        req.body.category = '8';
        await userController.register(req, res);
        const expected = {
            result: 'redirect',
            url :  "register/?registrationError=ValidationError: \"category\" must be one of [2, 3, 4, 5, 6]&name=Sarah Hyland&email=sarah@gmail.com&category=8&gender=Female&contactNo=07123232323"
        }
        expect(res.send).toHaveBeenCalledWith(expected);
    });
});

describe('views', ()=>{
    let res;
    req = {
        query:{}
    }

    beforeEach(async () => {
        res = {
            render : jest.fn(),
        }
    });


    it('should render register page', async ()=>{
        await userController.viewRegister(req, res);
        expect(res.render).toHaveBeenCalledWith("register", {"category": undefined, "contactNo": undefined, "email": undefined, "gender": undefined, "name": undefined, "registrationError": undefined}
        );
    });

    it('should render login page', async ()=>{
        await userController.viewLogin(req, res);
        expect(res.render).toHaveBeenCalledWith("login");
    });

    it('should render faq page', async ()=>{
        await userController.viewFaq(req, res);
        expect(res.render).toHaveBeenCalledWith("faq");
    });
})

describe('logout', () => {
    let res;
    let req;

    beforeEach(async () => {
        req = {
            logout: jest.fn(),
            flash: jest.fn()
        }
        res = {
            redirect : jest.fn(),
        }
    });

    it('should log out', async ()=>{
        await userController.logout(req, res);
        expect(req.logout).toHaveBeenCalled();
        expect(req.flash).toHaveBeenCalledWith("logoutMessage","Logged out successfully!");
        expect(res.redirect).toHaveBeenCalledWith("/users/login");
    })
});


describe('login', () => {
    let done;
    let email;
    let password;
    beforeEach( () => {
        email = 'claire@gmail.com';;
        password = '12345';
        server = require('../../../index');
        done = jest.fn();
    });

    afterEach( () => {
        server.close();
    });

    it('should successfully login', async () => {

        let user;
        await userController.login(email, password, done);
        const out = await db.query(`SELECT * FROM user_profile WHERE email = $1`, [email]);
        user = out.rows[0];

        expect(done).toHaveBeenCalledWith(null, user);
    });

    it('should give validation error', async () =>{
        email = 'abc';
        await userController.login(email, password, done);
        expect(done).toHaveBeenCalledWith(null, false, {
            message: "Login Error"
        });
    });

    it('should give user does not exist error', async () =>{
        email = '123@gmail.com';
        await userController.login(email, password, done);
        expect(done).toHaveBeenCalledWith(null, false, {
            message: "No user with that email address"
        });
    });

    it('should give user unverfied user error', async () =>{
        req = {
            body: {
                name: 'New user',
                email: 'new@gmail.com',
                password: '123456',
                password2: '123456',
                category: '2',
                gender: 'Male',
                contactNo: '07123232323'
            }
        }
        const query = `CALL registerUser ($1, $2, $3, $4, $5, $6)`;
        await db.query(query, [req.body.name, req.body.password, req.body.email, req.body.category, req.body.contactNo, req.body.gender]);
        email = 'new@gmail.com';
        await userController.login(email, password, done);
        expect(done).toHaveBeenCalledWith(null, false, {
            message: "Email has not been approved yet"
        });
        await db.query(`DELETE FROM user_profile WHERE email = 'new@gmail.com'`)
    });

    it('should give password incorrect error', async () =>{
        password = '1';
        await userController.login(email, password, done);
        expect(done).toHaveBeenCalledWith(null, false, {
            message: "Password is incorrect"
        });
    });


});



