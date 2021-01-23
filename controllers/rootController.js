const userService = require('../services/UserServices')

class RootController {
    static async root(req, res) {
        //res.render('index');
        res.render('dashboard', {name: req.user.name, cat_id: req.user.cat_id});
    }
}

module.exports = RootController;
