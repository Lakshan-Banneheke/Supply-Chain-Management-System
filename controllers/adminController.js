const admin = require('../models/admin');


const viewAdminDashboard = async (req, res) => {
    let unverifiedUsers = await admin.getAllUnverifiedUsers();
    res.render('adminDashboard', {
        name: req.user.name,
        unverifiedUsers : unverifiedUsers,
        cat_id: req.user.cat_id
    });
}


const approveUser = async (req, res) => {
    await admin.approveUser(req.body.user_id);
    res.redirect('/admin');
}

const disapproveUser = async (req, res) => {
    await admin.disapproveUser(req.body.user_id);
    res.redirect('/admin');
}

module.exports = {
    viewAdminDashboard,
    approveUser,
    disapproveUser
}