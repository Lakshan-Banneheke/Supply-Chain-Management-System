const adminController = require('../../../controllers/adminController');
const db = require('../../../config/db');

describe('view admin dashboard', ()=>{
    let req = {
        user:{
            name: "admin",
            cat_id: 1,
        }
    }

    let res = { render : jest.fn() }

    it('should view the dashboard', async ()=>{
        const out = await db.query(`SELECT * FROM user_profile NATURAL JOIN user_category WHERE verified=false`);
        let expectedResult = out.rows;
        // let expectedResult =  [
        //     {
        //         cat_id: 2,
        //         user_id: 'ef29a7ce-1317-48b2-a5ef-b4bc635d18f6',
        //         name: 'Mark',
        //         password: '12345',
        //         email: 'mark@gmail.com',
        //         contact_num: '0000000000',
        //         gender: 'Male',
        //         verified: false,
        //         cat_name: 'Quantity Surveyor'
        //     },
        //     {
        //         cat_id: 2,
        //         user_id: 'dea36877-965b-4fd7-8d14-341610e593e6',
        //         name: 'Mary',
        //         password: '12345',
        //         email: 'mary@gmail.com',
        //         contact_num: '0000000000',
        //         gender: 'Female',
        //         verified: false,
        //         cat_name: 'Quantity Surveyor'
        //     }
        // ]

        await adminController.viewAdminDashboard(req, res);

        expect(res.render).toHaveBeenCalledWith("adminDashboard", {
            name: req.user.name,
            unverifiedUsers : expectedResult,
            cat_id: req.user.cat_id
        });
    });
})

describe('Approve and dissaprove user', ()=>{
    let req = {
        body: {
            user_id: null,
        }
    }
    let res;

    beforeEach(async() => {
        res ={ redirect : jest.fn()}
        await db.query(`CALL registerUser ('Test', '12345', 'test@gmail.com', 2, '0000000000', 'Male')`)
        const out = await db.query(`SELECT user_id FROM user_profile WHERE email='test@gmail.com'`)
        req.body.user_id = out.rows[0].user_id
    });

    afterEach(async () => {
        await db.query(`DELETE FROM user_profile WHERE email='test@gmail.com'`);
    })

    it('should approve user', async()=> {
        await adminController.approveUser(req, res);
        const status = await db.query(`SELECT verified FROM user_profile WHERE email='test@gmail.com'`);
        expect(status.rows[0].verified).toBeTruthy();
        expect(res.redirect).toHaveBeenCalledWith('/admin');
    });

    it('should disapprove user', async()=>{
        await adminController.disapproveUser(req, res);
        const result = await db.query(`SELECT * FROM user_profile WHERE email='test@gmail.com'`) ;
        expect(result.rows[0]).toBeUndefined();
        expect(res.redirect).toHaveBeenCalledWith('/admin');
    })

})