const error404 = (req, res) => {
    res.status(404).render('errors/404');
}

const error405 = (req, res) => {
    res.render('errors/405');
}


module.exports = {
    error404,
    error405
};
