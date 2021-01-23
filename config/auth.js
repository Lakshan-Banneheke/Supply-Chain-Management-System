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

const checkQS = (req, res, next) => {
    if (req.isAuthenticated()){
        if (req.user.cat_id === 2){
            return next();
        } else {
            res.redirect('../405');
        }
    } else {
        res.redirect("/users/login");
    }
}

const checkExpeditor = (req, res, next) => {
    if (req.isAuthenticated()){
        if (req.user.cat_id === 3){
            return next();
        } else {
            res.redirect('../405');
        }
    } else {
        res.redirect("/users/login");
    }
}

const checkSupervisor = (req, res, next) => {
    if (req.isAuthenticated()){
        if (req.user.cat_id === 4){
            return next();
        } else {
            res.redirect('../405');
        }
    } else {
        res.redirect("/users/login");
    }
}

const checkStorekeeper = (req, res, next) => {
    if (req.isAuthenticated()){
        if (req.user.cat_id === 5){
            return next();
        } else {
            res.redirect('../405');
        }
    } else {
        res.redirect("/users/login");
    }
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
    checkQS,
    checkExpeditor,
    checkSupervisor,
    checkStorekeeper,
    checkFleetManager
}