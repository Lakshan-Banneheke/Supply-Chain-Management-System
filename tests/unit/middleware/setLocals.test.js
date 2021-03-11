const setLocals = require('../../../middleware/setLocals');

describe('check setLocals', () => {
    const req = {
        user : {
            cat_id : 1,
            name : 'user'
        },
        originalUrl : 'sampleURL'
    };

    it('should set the values', () => {
        const res = {
            locals : {
                cat_id : null,
                name : null,
                url : null
            }
        };

        const next = jest.fn();
        req.isAuthenticated = jest.fn().mockReturnValue(true);

        setLocals(req, res, next);

        expect(res.locals.name).toEqual('user');
        expect(res.locals.cat_id).toBe(1);
        expect(res.locals.url).toEqual('sampleURL');
        expect(next).toHaveBeenCalled();
    })

});