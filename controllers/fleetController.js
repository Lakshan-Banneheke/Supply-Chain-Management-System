const db = require('../config/db');
const dateformat = require('dateformat');

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
    db.query( 'SELECT v.*, b.*, v.id id, v.title title FROM vehicles v LEFT JOIN brands b on v.brand=b.id', (error, result) => {
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
    db.query( 'INSERT INTO vehicles (title, brand, plate_number, registrations, remarks) values ($1, $2, $3, $4)', [title, brand, plate_number, registrations, remarks], (error, result) => {
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
    db.query( 'SELECT * FROM supplies', (error, result) => {
        if( error ) console.log('Sql error', error);
        else {
            res.render('./fleet/supplies', {result: result.rows, dateformat});
        }
    });
}

const newSupply = (req, res) => {
    db.query( 'SELECT v.title, v.id, b.title brand FROM vehicles v left join brands b on v.brand = b.id;', (error, result) => {
        if( error ) console.log('Sql error', error);
        else {
            const now = new Date();
            res.render('./fleet/newSupply', {date: dateformat(now, "dd/mm/yyyy"), vehicles: result.rows, supply: false});
        }
    });
}

const addNewSupply = async (req, res) => {
    var {reference, created, period, remarks, address, vehicle, qty, description, amount} = req.body;
    const from_date = dateformat(period.split(' - ')[0], "yyyy-mm-dd");
    const to_date = dateformat(period.split(' - ')[1], "yyyy-mm-dd");
    created = (created === '') ? dateformat(new Date, "yyyy-mm-dd") : created;
    const query = `INSERT INTO supplies (reference, from_date, to_date, remarks, status, created, address) values ($1, $2, $3, $4, $5, $6, $7) RETURNING id`;
    const supply =  await db.query(query, [reference, from_date, to_date, remarks, '1', created, address]).then( result => result.rows[0].id).catch( console.log);
    var q = ``;
    vehicle.forEach( (item, id) => {
        q += ` ('${supply}', '${vehicle[id]}', '${(qty[id]?qty[id]:0)}', '${amount[id]?amount[id]:0}', '${description[id]}', '1'),`
    });
    q = q.substring(0, q.length-1);
    const query2 = `INSERT INTO supply_items (supply, vehicle, qty, amount, description, status) values ${q}`;
    db.query(query2).then( _ => {
        res.redirect('/fleet-management/supplies');
    }).catch(console.log);
}

const editSupply = async (req, res) => {
    const id = req.params.id;
    const supply = await db.query(`SELECT * FROM supplies where id=$1`, [id]).then( result => result.rows[0]).catch(console.log);
    const items = await db.query(`SELECT * FROM supply_items where supply=$1`, [id]).then( result => result.rows).catch(console.log);
    const vehicles = await db.query( 'SELECT v.title, v.id, b.title brand FROM vehicles v left join brands b on v.brand = b.id;').then( result => result.rows).catch(console.log);
    const now = new Date();
    res.render('./fleet/newSupply', {date: dateformat(now, "dd/mm/yyyy"), vehicles, supply, items, dateformat});
}

const editSupplySubmit = (req, res) => {
    var {reference, created, period, remarks, address, vehicle, qty, description, amount, supply} = req.body;
    console.log(period.split(' - ')[0], created);
    const from_date = dateformat(period.split(' - ')[0], "yyyy-mm-dd");
    //const to_date = dateformat(period.split(' - ')[1], "yyyy-mm-dd");
    //created = (created === '') ? dateformat(new Date(), "yyyy-mm-dd") : created;
    //db.query('UPDATE supplies SET reference=$1, from_date=$2, to_date=$3, remarks=$4, status=$5, created=$6, address=$7 WHERE id=$8', [reference, from_date, to_date, remarks, '1', created, address, supply]).catch(console.log);
    //res.redirect('/fleet-management/supplies');
}

const deleteSupply = (req, res) => {
    id = req.params.id;
    db.query( 'DELETE FROM vehicles WHERE id = $1', [id], (error, result) => {
        if( error ) console.log('Sql error', error);
        else {
            res.redirect('/fleet-management/vehicles');
        }
    });
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
    deleteSupply
}
