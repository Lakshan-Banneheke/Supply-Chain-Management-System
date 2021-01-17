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
    db.query( 'SELECT v.*, b.*, v.id id FROM vehicles v LEFT JOIN brands b on v.brand=b.id', (error, result) => {
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
    const {brand, plate_number, registrations, remarks} = req.body;
    db.query( 'INSERT INTO vehicles (brand, plate_number, registrations, remarks) values ($1, $2, $3, $4)', [brand, plate_number, registrations, remarks], (error, result) => {
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
    const {plate_number, brand, registrations, remarks, id} = req.body;
    db.query( 'UPDATE vehicles SET plate_number=$1, brand=$2, registrations=$3, remarks=$4 WHERE id=$5', [plate_number, brand, registrations, remarks, id], (error, result) => {
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
            res.render('./fleet/supplies', {result: result.rows});
        }
    });
}

const newSupply = (req, res) => {
    db.query( 'SELECT * FROM supplies', (error, result) => {
        if( error ) console.log('Sql error', error);
        else {
            const now = new Date();
            res.render('./fleet/newSupply', {date: dateformat(now, "dd/mm/yyyy")});
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
    newSupply
}
