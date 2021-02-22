const userModel = require('../../../models/user');

test('get registered user by ID', async ()=>{
    expectedResult =  {
        user_id: '478159af-5f2c-422f-a8d5-12a5ff550a79',
        name: 'admin',
        password: '$2a$10$C7B15U6UIoB2H5E2EvxSVecVXhv9lu.dS9IK8B/2ybNUa1.cyPgm2',
        email: 'admin@gmail.com',
        cat_id: 1,
        contact_num: null,
        gender: null,
        verified: true
    }

    const user = await userModel.getRegisteredUserByID("478159af-5f2c-422f-a8d5-12a5ff550a79");
    expect(user).toEqual(expectedResult);
})