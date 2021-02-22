const setSession = function(req, res, next) {
    if ((req.isAuthenticated())){
        res.locals.cat_id = req.user.cat_id;
        res.locals.name = req.user.name;
        res.locals.url = req.originalUrl;
        next();
    } else {
        next();
    }
}

module.exports = setSession;