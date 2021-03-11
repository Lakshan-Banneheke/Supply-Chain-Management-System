const setHeader = require('../../../middleware/setHeader');

describe('check setHeader', () => {
    const req = {};

    it('should set the values', () => {
        const res = {
            set: jest.fn()
        }
        const next = jest.fn();
        setHeader(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(res.set).toHaveBeenCalled();

    })

});