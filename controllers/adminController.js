const admin = require('../models/admin');
const userValidator = require('./validators/userValidator');
//const userService = require('../services/UserServices');
const adminService = require('../services/AdminServices');
const bcrypt = require('bcrypt');

const viewAdminDashboard = async (req, res) => {
    let unverifiedUsers = await admin.getAllUnverifiedUsers();
    res.render('adminDashboard', {
        name: req.user.name,
        unverifiedUsers : unverifiedUsers,
    });
}


const approveUser = async (req, res) => {
    await admin.approveUser(req.body.user_id);
    res.redirect('/admin');
}

const disapproveUser = async (req, res) => {
    await admin.disapproveUser(req.body.user_id);
    res.redirect('/admin');
}

const viewAdminEditInfo = async (req, res) => {
    // console.log(req.user.name);
    // console.log(req.user.password);
    // console.log(req.user.email);
    // console.log(req.user.contact_num);
    // console.log(req.user.user_id);
   
    res.render('adminEditInfo',{
        existing_name:req.user.name,
        existing_email:req.user.email,
        existing_contactNum:req.user.contact_num,
        changePasswordError: req.query.changePasswordError,
        editInfoError:req.query.editInfoError


    });

    // });
}

const editInfo = async (req, res) => {
    try{
        let {value, error} = await userValidator.editInfo.validate(req.body);
        if (error) throw (error);
        value.id=req.user.user_id;
        //console.log(typeof value);
        //console.log(value);
        await adminService.editInfo(value);
        //return res.status(200).send({result: 'redirect', url: '/admin/'});
        
        res.redirect('/admin');
    } catch (err){
        return res.status(200).send({
            result: 'redirect',
            url:`/admin/editInfo/?editInfoError=${err}&existing_name=${req.body.new_name}&existing_email=${req.body.new_email}&existing_contactNum=${req.body.new_contact_num}`

    });
    }

}



const changePassword = async (req,res) => {
    try{
        console.log("Change password testing 2");
        let {value, error} = await userValidator.changePassword.validate(req.body);
        if (error) throw (error);
        console.log(value);
        // const hashed_old_password = await bcrypt.hash(value.old_password, 10);
        value.id=req.user.user_id;
        // value.old_hashed_password=hashed_old_password;
        value.original_hashed_password=req.user.password;
        console.log(value);
        await adminService.changePassword(value);
        
        res.redirect('/admin');


    } catch (err){
        // return res.status(200).send({
        //     result: 'redirect',
        //     url:`/admin/changePassword/?changePasswordError=${err}`

        //});
        return res.redirect(
            `/admin/editInfo/?changePasswordError=${err}`
        );
    }
    

}




const redirectAdminDashboard = async (req, res) => {
    res.redirect('/admin');
}

module.exports = {
    viewAdminDashboard,
    approveUser,
    disapproveUser,
    viewAdminEditInfo,
    redirectAdminDashboard,
    editInfo,
    changePassword
}