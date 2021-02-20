const auth = require('../../../config/auth');

describe('check authentication', () => {
    const req = {};

    describe('checkAuthenticated', ()=>{
        it('should be authenticated', ()=>{
            const res = { redirect : jest.fn() };
            const next = jest.fn();
            req.isAuthenticated = jest.fn().mockReturnValue(true);
            auth.checkAuthenticated(req, res,next);
            expect(res.redirect).toHaveBeenCalledWith('/');
        })

        it('should not be authenticated', ()=>{
            const res = { redirect : jest.fn() };
            const next = jest.fn();
            req.isAuthenticated = jest.fn().mockReturnValue(false);
            auth.checkAuthenticated(req, res,next);
            expect(next).toHaveBeenCalled();
        })

    })

    describe('checkNotAuthenticated', ()=>{
        it('should be authenticated', ()=>{
            const res = { redirect : jest.fn() };
            const next = jest.fn();
            req.isAuthenticated = jest.fn().mockReturnValue(true);
            auth.checkNotAuthenticated(req, res,next);
            expect(next).toHaveBeenCalled();
        });

        it('should not be authenticated', ()=>{
            const res = { redirect : jest.fn() };
            const next = jest.fn();
            req.isAuthenticated = jest.fn().mockReturnValue(false);
            auth.checkNotAuthenticated(req, res,next);
            expect(res.redirect).toHaveBeenCalledWith('/users/login');
        });
    });
})

describe('check user category', () => {
    let req = {
        'user' : {
            'cat_id' : null,
        }
    };

    describe('checkQS', ()=>{
        it('should not be authenticated', ()=>{
            const res = { redirect : jest.fn() };
            const next = jest.fn();
            req.isAuthenticated = jest.fn().mockReturnValue(false);
            auth.checkQS(req, res, next);
            expect(res.redirect).toHaveBeenCalledWith('/users/login');
        });

        it('should allow access', ()=>{
            const res = { redirect : jest.fn() };
            const next = jest.fn();
            req.isAuthenticated = jest.fn().mockReturnValue(true);
            req.user.cat_id = 2;
            auth.checkQS(req, res, next);
            expect(next).toHaveBeenCalled();
        });

        it('should not allow access', ()=>{
            const res = { redirect : jest.fn() };
            const next = jest.fn();
            req.isAuthenticated = jest.fn().mockReturnValue(true);
            req.user.cat_id = 1;
            auth.checkQS(req, res, next);
            expect(next).not.toHaveBeenCalled();
            expect(res.redirect).toHaveBeenCalledWith('../405');
        });
    });


    describe('checkExpeditor', ()=>{
        it('should not be authenticated', ()=>{
            const res = { redirect : jest.fn() };
            const next = jest.fn();
            req.isAuthenticated = jest.fn().mockReturnValue(false);
            auth.checkExpeditor(req, res, next);
            expect(res.redirect).toHaveBeenCalledWith('/users/login');
        });

        it('should allow access', ()=>{
            const res = { redirect : jest.fn() };
            const next = jest.fn();
            req.isAuthenticated = jest.fn().mockReturnValue(true);
            req.user.cat_id = 3;
            auth.checkExpeditor(req, res, next);
            expect(next).toHaveBeenCalled();
        });

        it('should not allow access', ()=>{
            const res = { redirect : jest.fn() };
            const next = jest.fn();
            req.isAuthenticated = jest.fn().mockReturnValue(true);
            req.user.cat_id = 1;
            auth.checkExpeditor(req, res, next);
            expect(next).not.toHaveBeenCalled();
            expect(res.redirect).toHaveBeenCalledWith('../405');
        });
    });


    describe('checkSupervisor', ()=>{
        it('should not be authenticated', ()=>{
            const res = { redirect : jest.fn() };
            const next = jest.fn();
            req.isAuthenticated = jest.fn().mockReturnValue(false);
            auth.checkSupervisor(req, res, next);
            expect(res.redirect).toHaveBeenCalledWith('/users/login');
        });

        it('should allow access', ()=>{
            const res = { redirect : jest.fn() };
            const next = jest.fn();
            req.isAuthenticated = jest.fn().mockReturnValue(true);
            req.user.cat_id = 4;
            auth.checkSupervisor(req, res, next);
            expect(next).toHaveBeenCalled();
        });

        it('should not allow access', ()=>{
            const res = { redirect : jest.fn() };
            const next = jest.fn();
            req.isAuthenticated = jest.fn().mockReturnValue(true);
            req.user.cat_id = 1;
            auth.checkSupervisor(req, res, next);
            expect(next).not.toHaveBeenCalled();
            expect(res.redirect).toHaveBeenCalledWith('../405');
        });
    });

    describe('checkStorekeeper', ()=>{
        it('should not be authenticated', ()=>{
            const res = { redirect : jest.fn() };
            const next = jest.fn();
            req.isAuthenticated = jest.fn().mockReturnValue(false);
            auth.checkStorekeeper(req, res, next);
            expect(res.redirect).toHaveBeenCalledWith('/users/login');

        });

        it('should allow access', ()=>{
            const res = { redirect : jest.fn() };
            const next = jest.fn();
            req.isAuthenticated = jest.fn().mockReturnValue(true);
            req.user.cat_id = 5;
            auth.checkStorekeeper(req, res, next);
            expect(next).toHaveBeenCalled();
        });

        it('should not allow access', ()=>{
            const res = { redirect : jest.fn() };
            const next = jest.fn();
            req.isAuthenticated = jest.fn().mockReturnValue(true);
            req.user.cat_id = 1;
            auth.checkStorekeeper(req, res, next);
            expect(next).not.toHaveBeenCalled();
            expect(res.redirect).toHaveBeenCalledWith('../405');
        });
    });

    describe('checkFleetManager', ()=>{
        it('should not be authenticated', ()=>{
            const res = { redirect : jest.fn() };
            const next = jest.fn();
            req.isAuthenticated = jest.fn().mockReturnValue(false);
            auth.checkFleetManager(req, res, next);
            expect(res.redirect).toHaveBeenCalledWith('/users/login');
        });

        it('should allow access', ()=>{
            const res = { redirect : jest.fn() };
            const next = jest.fn();
            req.isAuthenticated = jest.fn().mockReturnValue(true);
            req.user.cat_id = 6;
            auth.checkFleetManager(req, res, next);
            expect(next).toHaveBeenCalled();
        });

        it('should not allow access', ()=>{
            const res = { redirect : jest.fn() };
            const next = jest.fn();
            req.isAuthenticated = jest.fn().mockReturnValue(true);
            req.user.cat_id = 1;
            auth.checkFleetManager(req, res, next);
            expect(next).not.toHaveBeenCalled();
            expect(res.redirect).toHaveBeenCalledWith('../405');
        });
    });
})