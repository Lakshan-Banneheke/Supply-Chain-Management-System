const User = require('../models/User');

class UserService {
    static async register() {
        console.log('2');

        return User.registerUser();
    }
}

module.exports = UserService;