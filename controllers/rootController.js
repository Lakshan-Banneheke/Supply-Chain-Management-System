const userService = require('../services/UserServices')

class RootController {
    static async root(req, res) {
        res.render('index');
    }
}

module.exports = RootController;
