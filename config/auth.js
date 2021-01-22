const checkAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return res.redirect("/");
    }
    next();
}

const checkNotAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()){
        return next();
    }
    res.redirect("/users/login")
}

const checkFleetManager = (req, res, next) => {
    if (req.isAuthenticated()){
        if (req.user.cat_id === 6){
            return next();
        } else {
            res.redirect('../405');
        }
    } else {
        res.redirect("/users/login");
    }
}


module.exports = {
    checkAuthenticated,
    checkNotAuthenticated,
    checkFleetManager
}