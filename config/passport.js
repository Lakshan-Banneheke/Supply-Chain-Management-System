const LocalStrategy = require("passport-local").Strategy;
const userController = require('../controllers/userController');
const userModel = require('../models/user');


function initialize(passport){
    console.log("Passport initialized");

    const authenticateUser = async (email, password, done) => {
        await userController.login(email,password, done);
    };

    passport.use(
        new LocalStrategy(
            {usernameField: "email", passwordField: "password"},
            authenticateUser
        )
    );
    // Stores user details inside session. serializeUser determines which data of the user
    // object should be stored in the session. The result of the serializeUser method is attached
    // to the session as req.session.passport.user = {}. Here for instance, it would be (as we provide
    //   the user id as the key) req.session.passport.user = {id: 'xyz'}
    passport.serializeUser((user, done) => done(null, user.user_id));

    // In deserializeUser that key is matched with the in memory array / database or any data resource.
    // The fetched object is attached to the request object as req.user

    passport.deserializeUser(async(id, done) => {
        const user = await userModel.getRegisteredUserByID(id);
        console.log("Deserialize");
        return done(null, user);
    })
}

module.exports = initialize;