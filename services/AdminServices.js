
const Admin= require('../models/Admin');
const Errors = require('../helpers/error');
const crypto = require('crypto');
const bcrypt = require('bcrypt');

class AdminService{
    static async editInfo({new_name, new_email, new_contact_num,id}) {
        return Admin.editInfo(
            new_name, new_email, new_contact_num,id
        )
    }
}
 
module.exports = AdminService;