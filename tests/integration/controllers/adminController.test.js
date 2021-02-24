// const request = require('supertest');
const adminController = require('../../../controllers/adminController');
const db = require('../../../config/db');
const { getMaxListeners } = require('../../../config/db');

let server;

describe('edit info', () => {
    let res;
    let req;
    beforeEach(async () => {
        await db.query(` DELETE FROM user_profile WHERE user_id='2fd685ed-979a-4a2e-8c6c-3370eb025211'`);
        await db.query(`INSERT INTO user_profile(user_id, name,password,email,cat_id,contact_num,gender,verified)
        VALUES ('2fd685ed-979a-4a2e-8c6c-3370eb025211', 'Marieh','$2b$10$2T4uSKF2A0KCwKUFOG74wum.v3xButqprjYP5b2eucUELK0HDbfpy','Marieh@gmail.com',1,'07182266666','Female','true')`);
        await db.query(`DELETE FROM user_profile WHERE user_id='2fd685ed-979a-4a2e-8c6c-3370eb025228'`);
        await db.query(`INSERT INTO user_profile(user_id, name,password,email,cat_id,contact_num,gender,verified)
        VALUES ('2fd685ed-979a-4a2e-8c6c-3370eb025228', 'Shashini','$2b$10$2T4uSKF2A0KCwKUFOG74wum.v3xButqprjYP5b2eucUELK0HDbfpy','shashw@gmail.com',1,'07182266663','Female','true')`);
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
                new_contact_num : '07182266666'
            }
        }

        res = {
            redirect: jest.fn()
        }
    });

    afterEach(async() => {
        //await db.query(`UPDATE user_profile SET name='Shashini',email ='shashw@gmail.com',contact_num='07182266663' where user_id='2fd685ed-979a-4a2e-8c6c-3370eb025228'`);
        server.close();
    });
        
    it('should successfully edit information', async ()=>{
        let expected_result={
            name: 'Mary',
            email: 'mary@gmail.com',
            contact_num : '07182266666'
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


describe('Change Password', () => {
    let res;
    let req;
    beforeEach(async() => {
        server = require('../../../index');
        await db.query(`DELETE FROM user_profile WHERE user_id='2fd685ed-979a-4a2e-8c6c-3370eb025228'`);
        await db.query(`INSERT INTO user_profile(user_id, name,password,email,cat_id,contact_num,gender,verified)
        VALUES ('2fd685ed-979a-4a2e-8c6c-3370eb025228', 'Shashini','$2b$10$2T4uSKF2A0KCwKUFOG74wum.v3xButqprjYP5b2eucUELK0HDbfpy','shashw@gmail.com',1,'07182266663','Female','true')`);
        req = {
            user:{
                name:'Shashini',
                email:'shashw@gmail.com',
                user_id:'2fd685ed-979a-4a2e-8c6c-3370eb025228',
                password:'$2b$10$2T4uSKF2A0KCwKUFOG74wum.v3xButqprjYP5b2eucUELK0HDbfpy'
            },

            body:{
                new_password: 'qwerty',
                confirm_new_password: 'qwerty',
                old_password : 'password'
            }
        }

        res = {
            redirect: jest.fn()
        }
    });

    afterEach(async() => {
        //await db.query(`UPDATE user_profile SET name='Shashini',email ='shashw@gmail.com',contact_num='07182266663',password='$2b$10$2T4uSKF2A0KCwKUFOG74wum.v3xButqprjYP5b2eucUELK0HDbfpy' where user_id='2fd685ed-979a-4a2e-8c6c-3370eb025228'`);
        server.close();
    });
        
    it('should successfully change password', async ()=>{
        await adminController.changePassword(req, res);
        const expected_url = '/admin';

        expect(res.redirect).toHaveBeenCalledWith(expected_url);
    });

    it('should give new password mismatch error', async ()=>{
        req.body.new_password = 'qwerty1';
        await adminController.changePassword(req, res);
        const expected ='/admin/editInfo/?changePasswordError=New password does not match retype new password';
        expect(res.redirect).toHaveBeenCalledWith(expected);
    });

    it('should give old password verification error', async ()=>{
        req.body.old_password = 'password1';
        await adminController.changePassword(req, res);
        const expected ='/admin/editInfo/?changePasswordError=password verification error';
        expect(res.redirect).toHaveBeenCalledWith(expected);
    });

});

describe('Redirect Admin Dashboard', () => {
    let res;
    let req;
    beforeEach(() => {
        server = require('../../../index');
        let req = {
            user:{
                name: "admin",
                cat_id: 1,
            }
        };
        res ={redirect: jest.fn()};
    });

    afterEach(async() => {
        server.close();
    });
    it('should redirect successfully', async () => {
        await adminController.redirectAdminDashboard(req,res);
        const expected='/admin';
        expect(res.redirect).toHaveBeenCalledWith(expected);
    });
    
    
});
