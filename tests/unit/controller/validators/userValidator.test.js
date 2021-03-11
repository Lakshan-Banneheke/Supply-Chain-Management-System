const userVal = require('../../../../controllers/validators/userValidator');

describe('register', () => {
    it('should be validated if required fields true', () => {
        const expected_result={
            name:'shash',
            email: 'shash@gmail.com',
            password: '123456',
            password2: '123456',
            gender: 'Female',
            contactNo :'08878676767'
        }
        expect(userVal.register.validate(expected_result).value).toMatchObject(expected_result);
    });

    // it('should give error if required fields falsy', () => {
        
    //     const values=[null,undefined,NaN,'',0,false];
    //     values.forEach(element => {
    //         const new_expected={name:element};
    //         expect(()=>userVal.register.validate(element)).toThrow();
    //     });
    // });

});