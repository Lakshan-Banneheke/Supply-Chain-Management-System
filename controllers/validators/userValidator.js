const Joi = require('joi');

const register = Joi.object(
).options({abortEarly: false}).keys({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(5).required().label('Password'),
    password2: Joi.string().valid(Joi.ref('password')).required().label('Password Confirmation'),
    category: Joi.string().valid('2','3','4','5', '6'),
    gender: Joi.string().required().valid('Male', 'Female', 'Other').label('Gender'),
    doj: Joi.string().required(),
    contactNo : Joi.string().required().label('Contact Number')
});

const login=Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

const editInfo = Joi.object().options({abortEarly: false}).keys({
        new_name: Joi.string().required().label('Name'),
        new_email: Joi.string().email().required().label('Email'),
        new_contact_num : Joi.string().required().label('Contact Number')
    });
const changePassword = Joi.object().options({abortEarly: false}).keys({
    new_password: Joi.string().required().label('New Password'),
    confirm_new_password: Joi.string().required().label('New Password Confirmation'),
    old_password : Joi.string().required().label('Old Password')
});
module.exports = {
    register,
    login,
    editInfo,
    changePassword
}