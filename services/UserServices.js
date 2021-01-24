// const User = require('../models/User');

// class UserService {
//     static async register() {
//         return User.registerUser();
//     }
// }

// module.exports = UserService;

const User = require('../models/User');
const Errors = require('../helpers/error');
const crypto = require('crypto');
const bcrypt = require('bcrypt');


class UserService {
    static async register({
        name, email, password, password2, category, gender, contactNo
    }) {
        if (!crypto.timingSafeEqual(Buffer.from(password), Buffer.from(password2))) {
            throw new Errors.BadRequest('Password does not match retype password');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        return User.registerUser(
            name, email, hashedPassword, category, gender, contactNo
        )
    }

    static async login({ email, password }) {
        //console.log("user service login called");
        const user = await User.getRegisteredUserByEmail(email);
        return user;


        // if (!user) {
        //     console.log("no user returned");
        //     throw new Errors.BadRequest('Email is not registered');
        // }
        //
        // const hashedPassword = user.password;
        // console.log(hashedPassword);
        // console.log(password);
        // const passwordCorrect = await bcrypt.compare(password, hashedPassword);
        // console.log(passwordCorrect);
        // if (!passwordCorrect) {
        //     console.log('Invalid Email or Password');
        //     throw new Errors.BadRequest('Invalid Email or Password');
        // }
        //
        // return user;
    }
   
    // eslint-disable-next-line no-empty-function
    static async logout() {}
}

module.exports = UserService;