const fleetController = require('../../controllers/fleetController');
const db = require('../../config/db');
const dateformat = require('dateformat');


let res;
let req;



beforeEach(async () => {
    res = {
        render: jest.fn(),
        redirect: jest.fn()
    }
    req = {
        user: {
            name: "Pranavan"
        }
    }
});
afterEach(() => { });
beforeAll(async () => {
    //initiate
    res = {
        render: jest.fn(),
        redirect: jest.fn()
    }
    req = {
        user: {
            name: "Pranavan"
        }
    }
    //truncate all tables
    await db.query('TRUNCATE supply_items, supplies, vehicles, brands RESTART IDENTITY;');
    // insert brand
    req = {
        body: {
            brandname: 'van'
        }
    }
    await fleetController.newBrand(req, res)
    req = {
        body: {
            brandname: 'lorry'
        }
    }
    await fleetController.newBrand(req, res)

    //insert vehicles
    req = {
        body: {
            title: 'Employees - vehicle',
            brand: '1',
            plate_number: '1234',
            registrations: 'reg - 123',
            remarks: 'vehicle for employees'
        }
    }
    await fleetController.addNewVehicles(req, res)
    req = {
        body: {
            title: 'transport - vehicle',
            brand: '2',
            plate_number: '987456',
            registrations: 'reg - 456',
            remarks: 'vehicle for tranportation'
        }
    }
    await fleetController.addNewVehicles(req, res)

    //supplies
    req = {
        body: {
            reference: '1111',
            created: '22/01/2021',
            period: '10/03/2021 - 10/03/2021',
            remarks: 'remarks',
            address: 'address',
            vehicle: ['1', '2'],
            qty: ['5', '10'],
            description: ['des', 'des'],
            amount: ['1000', '2000'],
            status: '1'
        }
    }
    await fleetController.addNewSupply(req, res)
    req = {
        body: {
            reference: '2222',
            created: '22/01/2021',
            period: '10/03/2021 - 10/03/2021',
            remarks: 'remarks',
            address: 'address',
            vehicle: ['1', '1'],
            qty: ['15', '40'],
            description: ['des', 'des'],
            amount: ['1000', '2000'],
            status: '1'
        }
    }
    await fleetController.addNewSupply(req, res)

    //requests
    req = {
        body: {
            reference: '1111',
            created: '22/01/2021',
            period: '10/03/2021 - 10/03/2021',
            remarks: 'remarks',
            address: 'address',
            vehicle: ['1', '2'],
            qty: ['5', '10'],
            description: ['des', 'des'],
            amount: ['1000', '2000'],
            status: '0'
        }
    }
    await fleetController.addNewSupply(req, res)
    req = {
        body: {
            reference: '2222',
            created: '22/01/2021',
            period: '10/03/2021 - 10/03/2021',
            remarks: 'remarks',
            address: 'address',
            vehicle: ['1', '1'],
            qty: ['15', '40'],
            description: ['des', 'des'],
            amount: ['1000', '2000'],
            status: '0'
        }
    }
    await fleetController.addNewSupply(req, res)
})

describe('vehicle brands menu', () => {

    describe('vehicles/brands - get', () => {
        it('should render brands page', async () => {
            await fleetController.brands(req, res)
            const result = await db.query('SELECT * FROM brands');
            expect(res.render).toHaveBeenCalledWith('./fleet/brands', { result: result.rows })
        })
    })

    describe('vehicles/newBrand - post', () => {
        it('should redirect to /fleet-management/brands page after insertion', async () => {
            req = {
                user: {
                    name: "Pranavan"
                },
                body: {
                    brandname: 'testing'
                }
            }
            await fleetController.newBrand(req, res)
            expect(res.redirect).toHaveBeenCalledWith('/fleet-management/brands')
        })
    })

    describe('vehicles/editBrand - post', () => {
        it('should redirect to /fleet-management/brands page after edit', async () => {
            const id = await db.query('SELECT id FROM brands order by id desc limit 1').then(res => res.rows[0].id)
            req = {
                user: {
                    name: "Pranavan"
                },
                params: {
                    id,
                    title: 'edited'
                }
            }
            await fleetController.editBrand(req, res)
            expect(res.redirect).toHaveBeenCalledWith('/fleet-management/brands')
        })
    })

    describe('vehicles/delBrand - post', () => {
        it('should redirect to /fleet-management/brands page after deletion', async () => {
            const id = await db.query('SELECT id FROM brands order by id desc').then(res => res.rows[0].id)
            req = {
                user: {
                    name: "Pranavan"
                },
                params: {
                    id
                }
            }
            await fleetController.delBrand(req, res)
            expect(res.redirect).toHaveBeenCalledWith('/fleet-management/brands')
        })
    })

})


describe('vehicle menu', () => {

    describe('GET', () => {
        describe('/vehicles get', () => {
            it('should render vehicles page', async () => {
                await fleetController.vehicles(req, res)
                const result = await db.query('SELECT v.*, b.*, v.id id, v.title title, b.title brand FROM vehicles v LEFT JOIN brands b on v.brand=b.id');
                expect(res.render).toHaveBeenCalledWith('./fleet/vehicles', { result: result.rows })
            })
        });

        describe('/vehicles/new - get', () => {
            it('should render add vehicles page', async () => {
                await fleetController.newVehicles(req, res)
                const result = await db.query('SELECT * FROM brands;');
                expect(res.render).toHaveBeenCalledWith('./fleet/newVehicle', { brands: result.rows, data: false, title: "New Vehicle" })
            })
        })

        describe('/vehicles/edit - get', () => {
            it('should render edit vehicles page', async () => {
                const id = await db.query('SELECT id FROM vehicles order by id desc limit 1').then(res => res.rows[0].id)
                req = {
                    user: {
                        name: "Pranavan"
                    },
                    params: {
                        id
                    }
                }
                await fleetController.editVehicles(req, res)
                const result = await db.query('SELECT * FROM brands;')
                const result2 = await db.query('SELECT * FROM vehicles WHERE id=$1', [req.params.id]);
                expect(res.render).toHaveBeenCalledWith('./fleet/newVehicle', { brands: result.rows, data: result2.rows[0], title: "Edit Vehicle" })
            })
        })
    })

    describe('POST', () => {

        describe('vehicles/add vehicles', () => {
            it('should redirect to /fleet-management/vehicles page after insertion', async () => {
                const brand = await db.query('SELECT id FROM brands order by id desc limit 1').then(res => res.rows[0].id)
                req = {
                    body: {
                        title: 'testing',
                        brand,
                        plate_number: '1111',
                        registrations: '22222',
                        remarks: 'Remarks'
                    }
                }
                await fleetController.addNewVehicles(req, res)
                expect(res.redirect).toHaveBeenCalledWith('/fleet-management/vehicles')
            })
        })

        describe('vehicles/edit vehicles', () => {
            it('should redirect to /fleet-management/vehicles page after edit', async () => {
                const brand = await db.query('SELECT id FROM brands order by id desc limit 1').then(res => res.rows[0].id)
                const id = await db.query('SELECT id FROM vehicles order by id desc limit 1').then(res => res.rows[0].id)
                req = {
                    body: {
                        title: 'testing c',
                        brand,
                        plate_number: '1111 c',
                        registrations: '22222 c',
                        remarks: 'Remarks c',
                        id
                    }
                }
                await fleetController.editVehiclesSubmit(req, res)
                expect(res.redirect).toHaveBeenCalledWith('/fleet-management/vehicles')
            })
        })

        describe('vehicles/del vehicles', () => {
            it('should redirect to /fleet-management/vehicles page after deletion', async () => {
                const id = await db.query('SELECT id FROM vehicles order by id desc limit 1').then(res => res.rows[0].id)
                req = {
                    params: {
                        id
                    }
                }
                await fleetController.deleteVehicles(req, res)
                expect(res.redirect).toHaveBeenCalledWith('/fleet-management/vehicles')
            })
        })

    })
})

describe('supplies menu', () => {
    describe('GET', () => {
        describe('/supplies', () => {
            it('should render supplies page with req=1', async () => {
                req = {
                    user: {
                        name: "Pranavan"
                    },
                    req: true
                }
                await fleetController.supplies(req, res)
                const dbstatus = req.req ? '0' : '1';
                const result = await db.query('SELECT * FROM supplies where status=$1 order by id desc', [dbstatus])
                expect(res.render).toHaveBeenCalledWith('./fleet/supplies', { result: result.rows, dateformat, req: req.req, name: req.user.name })
            })
            it('should render supplies page with req=0', async () => {
                req = {
                    user: {
                        name: "Pranavan"
                    },
                    req: false
                }
                await fleetController.supplies(req, res)
                const dbstatus = req.req ? '0' : '1';
                const result = await db.query('SELECT * FROM supplies where status=$1 order by id desc', [dbstatus])
                expect(res.render).toHaveBeenCalledWith('./fleet/supplies', { result: result.rows, dateformat, req: req.req, name: req.user.name })
            })
        })
        describe('new supply', () => {
            it('should render new supply page', async () => {
                await fleetController.newSupply(req, res)
                const result = await db.query('SELECT v.title, v.id, b.title brand FROM vehicles v left join brands b on v.brand = b.id;')
                const now = new Date();
                expect(res.render).toHaveBeenCalledWith('./fleet/newSupply', { date: dateformat(now, "dd/mm/yyyy"), vehicles: result.rows, supply: false, req: req.req })
            })
        })
        describe('edit supply', () => {
            it('should render edit supply page', async () => {
                const id = await db.query('SELECT id FROM supplies where status=1 order by id desc limit 1').then(res => res.rows[0].id)
                req = {
                    params: {
                        id
                    }
                }
                await fleetController.editSupply(req, res)
                const supply = await db.query(`SELECT * FROM supplies where id=$1`, [id]).then(result => result.rows[0]).catch(console.log);
                const items = await db.query(`SELECT v.id, i.qty, i.amount, i.description, v.title as label FROM supply_items i inner join vehicles v on i.vehicle = v.id where i.supply=$1`, [id]).then(result => result.rows).catch(console.log);
                const vehicles = await db.query('SELECT v.title, v.id, b.title brand FROM vehicles v left join brands b on v.brand = b.id;').then(result => result.rows).catch(console.log);
                const now = new Date();
                expect(res.render).toHaveBeenCalledWith('./fleet/newSupply', { date: dateformat(now, "dd/mm/yyyy"), vehicles, supply, items, dateformat, req: req.req })
            })
        })
    })

    describe('POST', () => {

        describe('supplies/add supplies', () => {
            describe('for fleet manager - Without expedictor var', () => {
                it('should redirect to /fleet-management/supplies page after insertion with some vehicles', async () => {
                    const brand = await db.query('SELECT id FROM brands order by id desc limit 1').then(res => res.rows[0].id)
                    req = {
                        body: {
                            reference: '1111',
                            created: '22/01/2021',
                            period: '10/03/2021 - 10/03/2021',
                            remarks: 'remarks',
                            address: 'address',
                            vehicle: ['1', '2'],
                            qty: ['5', '10'],
                            description: ['des', 'des'],
                            amount: ['1000', '2000'],
                            status: '1'
                        }
                    }
                    await fleetController.addNewSupply(req, res)
                    expect(res.redirect).toHaveBeenCalledWith('/fleet-management/supplies')
                })
                it('should redirect to /fleet-management/supplies page after insertion with no vehicles', async () => {
                    const brand = await db.query('SELECT id FROM brands order by id desc limit 1').then(res => res.rows[0].id)
                    req = {
                        body: {
                            reference: '1111',
                            created: '22/01/2021',
                            period: '10/03/2021 - 10/03/2021',
                            remarks: 'remarks',
                            address: 'address',
                            status: '1'
                        }
                    }
                    await fleetController.addNewSupply(req, res)
                    expect(res.redirect).toHaveBeenCalledWith('/fleet-management/supplies')
                })
            })
            describe('for expeditor - With expedictor var', () => {
                it('should redirect to /fleet-management/supplies page after insertion with some vehicles', async () => {
                    const brand = await db.query('SELECT id FROM brands order by id desc limit 1').then(res => res.rows[0].id)
                    req = {
                        body: {
                            reference: '1111',
                            created: '22/01/2021',
                            period: '10/03/2021 - 10/03/2021',
                            remarks: 'remarks',
                            address: 'address',
                            vehicle: ['1', '2'],
                            qty: ['5', '10'],
                            description: ['des', 'des'],
                            amount: ['1000', '2000'],
                            status: '1'
                        },
                        exp: true
                    }
                    await fleetController.addNewSupply(req, res)
                    expect(res.redirect).toHaveBeenCalledWith('/expeditor/requests')
                })
                it('should redirect to /fleet-management/supplies page after insertion with no vehicles', async () => {
                    const brand = await db.query('SELECT id FROM brands order by id desc limit 1').then(res => res.rows[0].id)
                    req = {
                        body: {
                            reference: '1111',
                            created: '22/01/2021',
                            period: '10/03/2021 - 10/03/2021',
                            remarks: 'remarks',
                            address: 'address',
                            status: '1'
                        },
                        exp: true
                    }
                    await fleetController.addNewSupply(req, res)
                    expect(res.redirect).toHaveBeenCalledWith('/expeditor/requests')
                })
            })
            describe('with created text as empty', () => {
                it('should redirect to /fleet-management/supplies page after insertion with some vehicles', async () => {
                    const brand = await db.query('SELECT id FROM brands order by id desc limit 1').then(res => res.rows[0].id)
                    req = {
                        body: {
                            reference: '1111',
                            created: '',
                            period: '10/03/2021 - 10/03/2021',
                            remarks: 'remarks',
                            address: 'address',
                            vehicle: ['1', '2'],
                            qty: ['5', '10'],
                            description: ['des', 'des'],
                            amount: ['1000', '2000'],
                            status: '1'
                        }
                    }
                    await fleetController.addNewSupply(req, res)
                    expect(res.redirect).toHaveBeenCalledWith('/fleet-management/supplies')
                })
            })
            describe('with some fault vehicle details', () => {
                it('should redirect to /fleet-management/supplies page after insertion with some vehicles', async () => {
                    const brand = await db.query('SELECT id FROM brands order by id desc limit 1').then(res => res.rows[0].id)
                    req = {
                        body: {
                            reference: '1111',
                            created: '',
                            period: '10/03/2021 - 10/03/2021',
                            remarks: 'remarks',
                            address: 'address',
                            vehicle: ['1', '2'],
                            qty: [],
                            description: [],
                            amount: [],
                            status: '1'
                        }
                    }
                    await fleetController.addNewSupply(req, res)
                    expect(res.redirect).toHaveBeenCalledWith('/fleet-management/supplies')
                })
            })
        })

        describe('supplies/edit supplies', () => {
            describe('for fleet manager - Without expedictor var', () => {
                it('should redirect to /fleet-management/supplies page after edit with some vehicles', async () => {
                    const id = await db.query('SELECT id FROM supplies order by id desc limit 1').then(res => res.rows[0].id)
                    req = {
                        body: {
                            reference: '1111',
                            created: '22/01/2021',
                            period: '10/03/2021 - 10/03/2021',
                            remarks: 'remarks',
                            address: 'address',
                            vehicle: ['1', '2'],
                            qty: ['5', '10'],
                            description: ['des', 'des'],
                            amount: ['1000', '2000'],
                            supply: id
                        }
                    }
                    await fleetController.editSupplySubmit(req, res)
                    expect(res.redirect).toHaveBeenCalledWith('/fleet-management/supplies')
                })
                it('should redirect to /fleet-management/supplies page after edit with no vehicles', async () => {
                    const id = await db.query('SELECT id FROM supplies order by id desc limit 1').then(res => res.rows[0].id)
                    req = {
                        body: {
                            reference: '1111',
                            created: '22/01/2021',
                            period: '10/03/2021 - 10/03/2021',
                            remarks: 'remarks',
                            address: 'address',
                            supply: id
                        }
                    }
                    await fleetController.editSupplySubmit(req, res)
                    expect(res.redirect).toHaveBeenCalledWith('/fleet-management/supplies')
                })
            })
            describe('for expeditor - With expedictor var', () => {
                it('should redirect to /fleet-management/supplies page after edit with some vehicles', async () => {
                    const id = await db.query('SELECT id FROM supplies order by id desc limit 1').then(res => res.rows[0].id)
                    req = {
                        body: {
                            reference: '1111',
                            created: '22/01/2021',
                            period: '10/03/2021 - 10/03/2021',
                            remarks: 'remarks',
                            address: 'address',
                            vehicle: ['1', '2'],
                            qty: ['5', '10'],
                            description: ['des', 'des'],
                            amount: ['1000', '2000'],
                            supply: id
                        },
                        exp: true
                    }
                    await fleetController.editSupplySubmit(req, res)
                    expect(res.redirect).toHaveBeenCalledWith('/expeditor/requests')
                })
                it('should redirect to /fleet-management/supplies page after edit with no vehicles', async () => {
                    const id = await db.query('SELECT id FROM supplies order by id desc limit 1').then(res => res.rows[0].id)
                    req = {
                        body: {
                            reference: '1111',
                            created: '22/01/2021',
                            period: '10/03/2021 - 10/03/2021',
                            remarks: 'remarks',
                            address: 'address',
                            supply: id
                        },
                        exp: true
                    }
                    await fleetController.editSupplySubmit(req, res)
                    expect(res.redirect).toHaveBeenCalledWith('/expeditor/requests')
                })
            })
            describe('with created date as empty', () => {
                it('should redirect to /fleet-management/supplies page after edit with some vehicles', async () => {
                    const id = await db.query('SELECT id FROM supplies order by id desc limit 1').then(res => res.rows[0].id)
                    req = {
                        body: {
                            reference: '1111',
                            created: '',
                            period: '10/03/2021 - 10/03/2021',
                            remarks: 'remarks',
                            address: 'address',
                            vehicle: ['1', '2'],
                            qty: ['5', '10'],
                            description: ['des', 'des'],
                            amount: ['1000', '2000'],
                            supply: id
                        }
                    }
                    await fleetController.editSupplySubmit(req, res)
                    expect(res.redirect).toHaveBeenCalledWith('/fleet-management/supplies')
                })
            })
            describe('for some wrong vehicle details', () => {
                it('should redirect to /fleet-management/supplies page after edit with some vehicles', async () => {
                    const id = await db.query('SELECT id FROM supplies order by id desc limit 1').then(res => res.rows[0].id)
                    req = {
                        body: {
                            reference: '1111',
                            created: '',
                            period: '10/03/2021 - 10/03/2021',
                            remarks: 'remarks',
                            address: 'address',
                            vehicle: ['1', '2'],
                            qty: [],
                            description: [],
                            amount: [],
                            supply: id
                        }
                    }
                    await fleetController.editSupplySubmit(req, res)
                    expect(res.redirect).toHaveBeenCalledWith('/fleet-management/supplies')
                })
            })
        })

        describe('supplies/del supplies', () => {
            it('should redirect to /fleet-management/supplies page after deletion', async () => {
                const id = await db.query('SELECT id FROM supplies order by id desc limit 1').then(res => res.rows[0].id)
                req = {
                    params: {
                        id
                    }
                }
                await fleetController.deleteSupply(req, res)
                expect(res.redirect).toHaveBeenCalledWith('/fleet-management/supplies')
            })
            it('should redirect to /expeditor/requests page after deletion - expeditor', async () => {
                const id = await db.query('SELECT id FROM supplies order by id desc limit 1').then(res => res.rows[0].id)
                req = {
                    params: {
                        id
                    },
                    exp: true
                }
                await fleetController.deleteSupply(req, res)
                expect(res.redirect).toHaveBeenCalledWith('/expeditor/requests')
            })
        })

    })
})

describe('requests menu', () => {
    describe('GET', () => {
        describe('/supplies/req', () => {
            it('should render new ./fleet/requests page', async () => {
                await fleetController.requests(req, res)
                const result = await db.query('SELECT * FROM supplies where status=0 order by id desc')
                expect(res.render).toHaveBeenCalledWith('./fleet/requests', { result: result.rows, dateformat })
            })
        })
    })

    describe('POST', () => {

        describe('handle request', () => {
            it('should redirect to /fleet-management/requests page after approve', async () => {
                const id = await db.query('SELECT id FROM supplies where status=0 order by id desc limit 1').then(res => res.rows[0].id)
                req = {
                    body: {
                        id,
                        action: 'approve'
                    }
                }
                await fleetController.handelRequests(req, res)
                expect(res.redirect).toHaveBeenCalledWith('/fleet-management/requests')
            })
            it('should redirect to /fleet-management/requests page after reject', async () => {
                const id = await db.query('SELECT id FROM supplies where status=0 order by id desc limit 1').then(res => res.rows[0].id)
                req = {
                    body: {
                        id,
                        action: 'reject'
                    }
                }
                await fleetController.handelRequests(req, res)
                expect(res.redirect).toHaveBeenCalledWith('/fleet-management/requests')
            })
        })

    })
})