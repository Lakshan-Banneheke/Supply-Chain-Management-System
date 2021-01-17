const checkAuthenticated = (req, res, next) => {
    /*if (req.isAuthenticated()) {
        return res.redirect("/");
    }*/
    next();
}

const checkNotAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()){
        return next();
    }
    res.redirect("/users/login")
}

module.exports = {
    checkAuthenticated,
    checkNotAuthenticated
}