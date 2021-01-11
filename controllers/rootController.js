const userService = require('../services/UserServices')

class RootController {
    static async root(req, res) {
        try{
            console.log('1');
            await userService.register();
        } catch (e){
            console.log(e);
        }

        res.render('index');
    }
}

module.exports = RootController;
