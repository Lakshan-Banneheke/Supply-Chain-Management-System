const Joi = require('joi');

const register = Joi.object(
).options({abortEarly: false}).keys({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(5).required().label('Password'),
    password2: Joi.string().valid(Joi.ref('password')).required().label('Password Confirmation'),
    category: Joi.string().valid('1','2','3','4','5'),
    gender: Joi.string().required().valid('Male', 'Female', 'Other').label('Gender'),
    doj: Joi.string().required(),
    contactNo : Joi.string().required().label('Contact Number')
});

const login = Joi.object(
).options({abortEarly: false}).keys({
    email: Joi.string().email().required(),
    password: Joi.string().required().label('Password'),
});



module.exports = {
    register,
    login
}