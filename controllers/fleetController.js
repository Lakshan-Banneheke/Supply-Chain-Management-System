const db = require('../config/db');
const dateformat = require('dateformat');

function stringToDate(string) {
    var string = string.split("/")
    return new Date(string[2], string[1] - 1, string[0])
}

const brands = (req, res) => {
    db.query( 'SELECT * FROM brands', (error, result) => {
        if( error ) console.log('Sql error', error);
        else {
            res.render('./fleet/brands', {result: result.rows});
        }
    });
}

const newBrand = (req, res) => {
    var query = db.query( 'INSERT INTO brands (title) values ($1);', [req.body.brandname], (error, result) => {
        if( error ) console.log('Sql error', error);
        else {
            res.redirect('/fleet-management/brands');
        }
    });
}

const delBrand = (req, res) => {
    id = req.params.id;
    db.query( 'DELETE FROM brands WHERE id = $1', [id], (error, result) => {
        if( error ) console.log('Sql error', error);
        else {
            res.redirect('/fleet-management/brands');
        }
    });
}

const editBrand = (req, res) => {
    const {id, title} = req.params;
    db.query( 'UPDATE brands set title = $1 WHERE id = $2', [title, id], (error, result) => {
        if( error ) console.log('Sql error', error);
        else {
            res.redirect('/fleet-management/brands');
        }
    });
}

const vehicles = (req, res) => {
    db.query( 'SELECT v.*, b.*, v.id id, v.title title, b.title brand FROM vehicles v LEFT JOIN brands b on v.brand=b.id', (error, result) => {
        if( error ) console.log('Sql error', error);
        else {
            res.render('./fleet/vehicles', {result: result.rows});
        }
    });
}

const newVehicles = (req, res) => {
    db.query( 'SELECT * FROM brands;', (error, result) => {
        if( error ) console.log('Sql error', error);
        else {
            res.render('./fleet/newVehicle', {brands: result.rows, data: false, title: "New Vehicle"});
        }
    });
}

const addNewVehicles = (req, res) => {
    const {title, brand, plate_number, registrations, remarks} = req.body;
    db.query( 'INSERT INTO vehicles (title, brand, plate_number, registrations, remarks) values ($1, $2, $3, $4, $5)', [title, brand, plate_number, registrations, remarks], (error, result) => {
        if( error ) console.log('Sql error', error);
        else {
            res.redirect('/fleet-management/vehicles');
        }
    });
}

const editVehicles = async (req, res) => {
    db.query( 'SELECT * FROM brands;', async (error, result) => {
        if( error ) console.log('Sql error', error);
        else {
            const result2 = await db.query('SELECT * FROM vehicles WHERE id=$1', [req.params.id]);
            res.render('./fleet/newVehicle', {brands: result.rows, data: result2.rows[0], title: "Edit Vehicle"});
        }
    });
}

const editVehiclesSubmit = (req, res) => {
    const {title, plate_number, brand, registrations, remarks, id} = req.body;
    db.query( 'UPDATE vehicles SET plate_number=$1, brand=$2, registrations=$3, remarks=$4, title=$5 WHERE id=$6', [plate_number, brand, registrations, remarks, title, id], (error, result) => {
        if( error ) console.log('Sql error', error);
        else {
            res.redirect('/fleet-management/vehicles');
        }
    });
}

const deleteVehicles = (req, res) => {
    id = req.params.id;
    db.query( 'DELETE FROM vehicles WHERE id = $1', [id], (error, result) => {
        if( error ) console.log('Sql error', error);
        else {
            res.redirect('/fleet-management/vehicles');
        }
    });
}

const supplies = (req, res) => {
    const dbstatus = req.req ? '0' : '1';
    db.query( 'SELECT * FROM supplies where status=$1 order by id desc',[dbstatus], (error, result) => {
        if( error ) console.log('Sql error', error);
        else {
            res.render('./fleet/supplies', {result: result.rows, dateformat, req: req.req});
        }
    });
}

const newSupply = (req, res) => {
    db.query( 'SELECT v.title, v.id, b.title brand FROM vehicles v left join brands b on v.brand = b.id;', (error, result) => {
        if( error ) console.log('Sql error', error);
        else {
            const now = new Date();
            res.render('./fleet/newSupply', {date: dateformat(now, "dd/mm/yyyy"), vehicles: result.rows, supply: false, req: req.req});
        }
    });
}

const addNewSupply = async (req, res) => {
    var {reference, created, period, remarks, address, vehicle, qty, description, amount, status} = req.body;
    vehicle = typeof vehicle === 'undefined' ? []: vehicle;
    const from_date = dateformat( stringToDate(period.split(' - ')[0]), "yyyy-mm-dd");
    const to_date = dateformat( stringToDate(period.split(' - ')[1]), "yyyy-mm-dd");
    created = (created === '') ? dateformat(new Date, "yyyy-mm-dd") : dateformat( stringToDate(created), "yyyy-mm-dd" );
    const query = `INSERT INTO supplies (reference, from_date, to_date, remarks, status, created, address) values ($1, $2, $3, $4, $5, $6, $7) RETURNING id`;
    const supply =  await db.query(query, [reference, from_date, to_date, remarks, status, created, address]).then( result => result.rows[0].id).catch( console.log);
    var q = ``;
    vehicle.forEach( (item, id) => {
        q += ` ('${supply}', '${vehicle[id]}', '${(qty[id]?qty[id]:0)}', '${amount[id]?amount[id]:0}', '${description[id]}', '1'),`
    });
    q = q.substring(0, q.length-1);
    const query2 = `INSERT INTO supply_items (supply, vehicle, qty, amount, description, status) values ${q}`;
    if( vehicle.length > 0 ){
        db.query(query2).then( _ => {
            res.redirect( req.exp ? '/expeditor/requests' : '/fleet-management/supplies');
        }).catch(console.log);
    }else res.redirect( req.exp ? '/expeditor/requests' : '/fleet-management/supplies');
}

const editSupply = async (req, res) => {
    const id = req.params.id;
    const supply = await db.query(`SELECT * FROM supplies where id=$1`, [id]).then( result => result.rows[0]).catch(console.log);
    const items = await db.query(`SELECT v.id, i.qty, i.amount, i.description, v.title as label FROM supply_items i inner join vehicles v on i.vehicle = v.id where i.supply=$1`, [id]).then( result => result.rows).catch(console.log);
    const vehicles = await db.query( 'SELECT v.title, v.id, b.title brand FROM vehicles v left join brands b on v.brand = b.id;').then( result => result.rows).catch(console.log);
    const now = new Date();
    res.render('./fleet/newSupply', {date: dateformat(now, "dd/mm/yyyy"), vehicles, supply, items, dateformat, req: req.req});
}

const editSupplySubmit = async (req, res) => {
    var {reference, created, period, remarks, address, vehicle, qty, description, amount, supply} = req.body;
    vehicle = typeof vehicle === 'undefined' ? []: vehicle;
    const from_date = dateformat( stringToDate(period.split(' - ')[0]), "yyyy-mm-dd");
    const to_date = dateformat( stringToDate(period.split(' - ')[1]), "yyyy-mm-dd");
    created = (created === '') ? dateformat(new Date, "yyyy-mm-dd") : dateformat( stringToDate(created), "yyyy-mm-dd" );
    //console.table({reference, created, period, remarks, address, vehicle, qty, description, amount, supply, from_date, to_date});
    await db.query('UPDATE supplies SET reference=$1, from_date=$2, to_date=$3, remarks=$4, created=$5, address=$6 WHERE id=$7', [reference, from_date, to_date, remarks, created, address, supply]).catch(console.log);
    await db.query('DELETE FROM supply_items where supply=$1', [supply]).catch(console.log);
    var q = ``;
    vehicle.forEach( (item, id) => {
        q += ` ('${supply}', '${vehicle[id]}', '${(qty[id]?qty[id]:0)}', '${amount[id]?amount[id]:0}', '${description[id]}', '1'),`
    });
    q = q.substring(0, q.length-1);
    const query2 = `INSERT INTO supply_items (supply, vehicle, qty, amount, description, status) values ${q}`;
    if( vehicle.length > 0 ){
        db.query(query2).then( _ => {
            res.redirect('/fleet-management/supplies');
        }).catch(console.log);
    }else res.redirect('/fleet-management/supplies');
}

const deleteSupply = (req, res) => {
    id = req.params.id;
    db.query( 'DELETE FROM supplies WHERE id = $1', [id], (error, result) => {
        if( error ) console.log('Sql error', error);
        else {
            res.redirect('/fleet-management/supplies');
        }
    });
}

// requests 

const requests = (req, res) => {
    db.query( 'SELECT * FROM supplies where status=0 order by id desc', (error, result) => {
        if( error ) console.log('Sql error', error);
        else {
            res.render('./fleet/requests', {result: result.rows, dateformat});
        }
    });
}

const handelRequests = (req, res) => {
    const {id, action} = req.body;
    if ( action === 'approve' ){
        db.query( "UPDATE supplies SET status='1' WHERE id=$1", [id], _ => {
            res.redirect('/fleet-management/requests');
        } );
    }else {
        db.query( "DELETE FROM supplies WHERE id=$1", [id], _ => {
            res.redirect('/fleet-management/requests');
        } );
    }
}

const test = async (req, res) => {
    const result = await db.query('alter table supply_items add constraint supply foreign key (supply) references supplies(id) on delete cascade');
    //console.table(result.rows);
    //console.log( dateformat( stringToDate('21/05/2020'), "yyyy-mm-dd" ) )
}

module.exports = {
    brands,
    newBrand,
    delBrand,
    editBrand,
    vehicles,
    newVehicles,
    addNewVehicles,
    editVehicles,
    editVehiclesSubmit,
    deleteVehicles,
    supplies,
    newSupply,
    addNewSupply,
    editSupply,
    editSupplySubmit,
    deleteSupply,
    requests,
    handelRequests,

    test
}
