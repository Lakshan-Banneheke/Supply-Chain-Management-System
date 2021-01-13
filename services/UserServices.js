const User = require('../models/User');
const Errors = require('../helpers/error');
const crypto = require('crypto');
const bcrypt = require('bcrypt');


class UserService {
    static async register({
        name, email, password, password2, category, gender, doj, contactNo
    }) {
        if (!crypto.timingSafeEqual(Buffer.from(password), Buffer.from(password2))) {
            throw new Errors.BadRequest('Password does not match retype password');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        return User.registerUser(
            name, email, hashedPassword, category, gender, doj, contactNo
        )
    }
}

module.exports = UserService;