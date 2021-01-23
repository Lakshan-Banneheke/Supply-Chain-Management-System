const error404 = (req, res) => {
    res.status(404).render('errors/404');
}

module.exports = error404;