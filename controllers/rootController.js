const userService = require('../services/UserServices')

class RootController {
    static async root(req, res) {
        //res.render('index');
        res.render('dashboard', {name: req.user.name});
    }
}

module.exports = RootController;
