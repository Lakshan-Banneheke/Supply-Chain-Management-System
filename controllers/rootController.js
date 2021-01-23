const userService = require('../services/UserServices')
const storekeeperModel = require('../models/storekeeperModel')


var passNotification = []
var notificationView = ''

// converts date to the correct format
function convertTime(list) {
    var newList = [];
    for (var i=0;i<list.length;i++){
        var date = new Date(list[i].date),
            mnth = ("0" + (date.getMonth() + 1)).slice(-2),
            day = ("0" + date.getDate()).slice(-2);
        var newdate = [date.getFullYear(), mnth, day].join("-");
        newList.push(newdate);
    }

    return newList;
}

const renderDashboard = async(req,res)=> {
    let notifications = await storekeeperModel.getNotification();
    let not_dates =  await convertTime(notifications);
    // console.log(notifications);
    passNotification = notifications;
    notificationView = "/"
    res.render('dashboard', {
        name:req.user.name,
        notifications:notifications,
        not_dates:not_dates
    });
}

module.exports = {
    renderDashboard
};