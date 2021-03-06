const userValidator = require('./validators/userValidator');
const userService = require('../services/UserServices');
const bcrypt = require('bcrypt');

const viewRegister = async (req, res) => {
    res.render('register', {
        registrationError: req.query.registrationError,
        name: req.query.name,
        email: req.query.email,
        category: req.query.category,
        gender: req.query.gender,
        contactNo : req.query.contactNo,
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
        return res.status(200).send({result: 'redirect', url: 'login'});

    } catch (err){
        return res.status(200).send({
            result: 'redirect',
            url:`register/?registrationError=${err}&name=${req.body.name}&email=${req.body.email}&category=${req.body.category}&gender=${req.body.gender}&contactNo=${req.body.contactNo}`

    });
    }

}

const login = async (email, password, done) => {
    try{
        const {value, error} = await userValidator.login.validate({email:email, password: password});
        if (error) throw (error);
        const user = await userService.login(value);
        if (user != null) {
            if (!user.verified){
                return done(null, false, {
                    message: "Email has not been approved yet"
                });
            } else {
                const isMatch = await bcrypt.compare(password, user.password);

                if (isMatch) {
                    return done(null, user);
                } else {
                    //password is incorrect
                    return done(null, false, {message: "Password is incorrect"});
                }

                // bcrypt.compare(password, user.password, (err, isMatch) => {
                //     if (err) {
                //         throw err;
                //     }
                //     if (isMatch) {
                //         return done(null, user);
                //     } else {
                //         //password is incorrect
                //         return done(null, false, {message: "Password is incorrect"});
                //     }
                // });
            }
        } else {
            // No user
            return done(null, false, {
                message: "No user with that email address"
            });
        }

    } catch (err){
        return done(null, false, {
            message: "Login Error"
        });
    }

}

const logout = async (req, res) => {
    req.logout();
    req.flash("logoutMessage","Logged out successfully!");
    res.redirect("/users/login");
}

const viewFaq = async (req, res) => {
    res.render('faq');
}

module.exports = {
    viewRegister,
    viewLogin,
    register,
    login,
    logout,
    viewFaq,
}
