const User = require('../models/User');

class UserService {
    static async register() {
        return User.registerUser();
    }
}

module.exports = UserService;