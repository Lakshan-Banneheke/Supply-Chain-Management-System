const userValidator = require('./validators/userValidator');
const userService = require('../services/UserServices');


const viewRegister = async (req, res) => {
    res.render('register', {
        registrationError: req.query.registrationError,
        name: req.query.name,
        email: req.query.email,
        category: req.query.category,
        gender: req.query.gender,
        contactNo : req.query.contactNo,
        doj : req.query.doj
    });
}

const viewLogin = async (req, res) => {
    res.render('login');
}

const register = async (req, res) => {
    try{
        const {value, error} = await userValidator.register.validate(req.body);
        if (error) throw (error);
        await userService.register(value);
        return res.redirect('login');

    } catch (err){
        return res.redirect(`register/?registrationError=${err}&name=${req.body.name}&email=${req.body.email}&category=${req.body.category}&doj=${req.body.doj}&gender=${req.body.gender}&contactNo=${req.body.contactNo}`);
    }

}

const login = async (req, res) => {
    try{
        const {value, error} = await userValidator.login.validate(req.body);
        if (error) throw (error);

    } catch(err) {

    }
}

module.exports = {
    viewRegister,
    viewLogin,
    register
}