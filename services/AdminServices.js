
const Admin= require('../models/admin');
const Errors = require('../helpers/error');
const crypto = require('crypto');
const bcrypt = require('bcrypt');

class AdminService{
    static async editInfo({new_name, new_email, new_contact_num,id}) {
        return Admin.editInfo(
            new_name, new_email, new_contact_num,id
        )
    }
    static async changePassword({new_password, confirm_new_password,old_password,id,original_hashed_password}) {

        //console.log("admin service");
        if (new_password.length!==confirm_new_password.length || !crypto.timingSafeEqual(Buffer.from(new_password), Buffer.from(confirm_new_password))) {
            //console.log('New password does not match retype new password');
            //throw new Errors.BadRequest('New password does not match retype new password');
            throw ('New password does not match retype new password');
        }

        //console.log('verification testing');
        const verification=await bcrypt.compare(old_password,original_hashed_password);
        //console.log(verification);
        if (!verification) {
            //console.log('password verification error');
            throw ('password verification error');
        }

        const hashed_new_password=await bcrypt.hash(new_password, 10);
        return Admin.changePassword(
                hashed_new_password,id
        )
        
    }
}
 
module.exports = AdminService;