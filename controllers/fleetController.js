const db = require('../config/db');
const dateformat = require('dateformat');

function stringToDate(string) {
    var string = string.split("/")
    return new Date(string[2], string[1] - 1, string[0])
}

//------------------------------------------------ brands ---------------------------------------------------------- 

const brands = async (req, res) => {
    const result = await db.query('SELECT * FROM brands');
    res.msg = 'brands rendered';
    res.render('./fleet/brands', { result: result.rows });
}

const newBrand = async (req, res) => {
    var result = await db.query('INSERT INTO brands (title) values ($1);', [req.body.brandname])
    res.redirect('/fleet-management/brands');
}

const delBrand = async (req, res) => {
    id = req.params.id;
    const result = await db.query('DELETE FROM brands WHERE id = $1', [id])
    res.redirect('/fleet-management/brands');
}

const editBrand = async (req, res) => {
    const { id, title } = req.params;
    const result = await db.query('UPDATE brands set title = $1 WHERE id = $2', [title, id])
    res.redirect('/fleet-management/brands');
}

//------------------------------------------------ vehicles ---------------------------------------------------------- 

const vehicles = async (req, res) => {
    res.msg = 'vehicles called';
    const result = await db.query('SELECT v.*, b.*, v.id id, v.title title, b.title brand FROM vehicles v LEFT JOIN brands b on v.brand=b.id')
    res.msg = 'vehicles rendered';
    res.render('./fleet/vehicles', { result: result.rows });
}

const newVehicles = async (req, res) => {
    const result = await db.query('SELECT * FROM brands;')
    res.render('./fleet/newVehicle', { brands: result.rows, data: false, title: "New Vehicle" });
}

const addNewVehicles = async (req, res) => {
    const { title, brand, plate_number, registrations, remarks } = req.body;
    const result = await db.query('INSERT INTO vehicles (title, brand, plate_number, registrations, remarks) values ($1, $2, $3, $4, $5)', [title, brand, plate_number, registrations, remarks])
    res.redirect('/fleet-management/vehicles');
}

const editVehicles = async (req, res) => {
    const result = await db.query('SELECT * FROM brands;')
    const result2 = await db.query('SELECT * FROM vehicles WHERE id=$1', [req.params.id]);
    res.render('./fleet/newVehicle', { brands: result.rows, data: result2.rows[0], title: "Edit Vehicle" });
}

const editVehiclesSubmit = async (req, res) => {
    const { title, plate_number, brand, registrations, remarks, id } = req.body;
    const result = await db.query('UPDATE vehicles SET plate_number=$1, brand=$2, registrations=$3, remarks=$4, title=$5 WHERE id=$6', [plate_number, brand, registrations, remarks, title, id])
    res.redirect('/fleet-management/vehicles');
}

const deleteVehicles = async (req, res) => {
    id = req.params.id;
    const result = await db.query('DELETE FROM vehicles WHERE id = $1', [id])
    res.redirect('/fleet-management/vehicles');
}

//------------------------------------------------ supplies ---------------------------------------------------------- 

const supplies = async (req, res) => {
    const dbstatus = req.req ? '0' : '1';
    const result = await db.query('SELECT * FROM supplies where status=$1 order by id desc', [dbstatus])
    res.render('./fleet/supplies', { result: result.rows, dateformat, req: req.req, name: req.user.name });
}

const newSupply = async (req, res) => {
    const result = await db.query('SELECT v.title, v.id, b.title brand FROM vehicles v left join brands b on v.brand = b.id;')
    const now = new Date();
    res.render('./fleet/newSupply', { date: dateformat(now, "dd/mm/yyyy"), vehicles: result.rows, supply: false, req: req.req });
}

const addNewSupply = async (req, res) => {
    var { reference, created, period, remarks, address, vehicle, qty, description, amount, status } = req.body;
    vehicle = typeof vehicle === 'undefined' ? [] : vehicle;
    const from_date = dateformat(stringToDate(period.split(' - ')[0]), "yyyy-mm-dd");
    const to_date = dateformat(stringToDate(period.split(' - ')[1]), "yyyy-mm-dd");
    created = (created === '') ? dateformat(new Date, "yyyy-mm-dd") : dateformat(stringToDate(created), "yyyy-mm-dd");
    const query = `INSERT INTO supplies (reference, from_date, to_date, remarks, status, created, address) values ($1, $2, $3, $4, $5, $6, $7) RETURNING id`;
    const supply = await db.query(query, [reference, from_date, to_date, remarks, status, created, address]).then(result => result.rows[0].id).catch(console.log);
    var q = ``;
    vehicle.forEach((item, id) => {
        q += ` ('${supply}', '${vehicle[id]}', '${(qty[id] ? qty[id] : 0)}', '${amount[id] ? amount[id] : 0}', '${description[id]}', '1'),`
    });
    q = q.substring(0, q.length - 1);
    const query2 = `INSERT INTO supply_items (supply, vehicle, qty, amount, description, status) values ${q}`;
    if (vehicle.length > 0) {
        await db.query(query2)
        res.redirect(req.exp ? '/expeditor/requests' : '/fleet-management/supplies');
    } else res.redirect(req.exp ? '/expeditor/requests' : '/fleet-management/supplies');
}

const editSupply = async (req, res) => {
    const id = req.params.id;
    const supply = await db.query(`SELECT * FROM supplies where id=$1`, [id]).then(result => result.rows[0]).catch(console.log);
    const items = await db.query(`SELECT v.id, i.qty, i.amount, i.description, v.title as label FROM supply_items i inner join vehicles v on i.vehicle = v.id where i.supply=$1`, [id]).then(result => result.rows).catch(console.log);
    const vehicles = await db.query('SELECT v.title, v.id, b.title brand FROM vehicles v left join brands b on v.brand = b.id;').then(result => result.rows).catch(console.log);
    const now = new Date();
    res.render('./fleet/newSupply', { date: dateformat(now, "dd/mm/yyyy"), vehicles, supply, items, dateformat, req: req.req });
}

const editSupplySubmit = async (req, res) => {
    var { reference, created, period, remarks, address, vehicle, qty, description, amount, supply } = req.body;
    vehicle = typeof vehicle === 'undefined' ? [] : vehicle;
    const from_date = dateformat(stringToDate(period.split(' - ')[0]), "yyyy-mm-dd");
    const to_date = dateformat(stringToDate(period.split(' - ')[1]), "yyyy-mm-dd");
    created = (created === '') ? dateformat(new Date, "yyyy-mm-dd") : dateformat(stringToDate(created), "yyyy-mm-dd");
    //console.table({reference, created, period, remarks, address, vehicle, qty, description, amount, supply, from_date, to_date});
    await db.query('UPDATE supplies SET reference=$1, from_date=$2, to_date=$3, remarks=$4, created=$5, address=$6 WHERE id=$7', [reference, from_date, to_date, remarks, created, address, supply]).catch(console.log);
    await db.query('DELETE FROM supply_items where supply=$1', [supply]).catch(console.log);
    var q = ``;
    vehicle.forEach((item, id) => {
        q += ` ('${supply}', '${vehicle[id]}', '${(qty[id] ? qty[id] : 0)}', '${amount[id] ? amount[id] : 0}', '${description[id]}', '1'),`
    });
    q = q.substring(0, q.length - 1);
    const query2 = `INSERT INTO supply_items (supply, vehicle, qty, amount, description, status) values ${q}`;
    if (vehicle.length > 0) {
        await db.query(query2)
        res.redirect(req.exp ? '/expeditor/requests' : '/fleet-management/supplies');
    } else res.redirect(req.exp ? '/expeditor/requests' : '/fleet-management/supplies');
}

const deleteSupply = async (req, res) => {
    id = req.params.id;
    const result = await db.query('DELETE FROM supplies WHERE id = $1', [id])
    res.redirect(req.exp ? '/expeditor/requests' : '/fleet-management/supplies');
}

//------------------------------------------------ requests ---------------------------------------------------------- 

const requests = async (req, res) => {
    const result = await db.query('SELECT * FROM supplies where status=0 order by id desc')
    res.render('./fleet/requests', { result: result.rows, dateformat });
}

const handelRequests = async (req, res) => {
    const { id, action } = req.body;
    if (action === 'approve') {
        const result = await db.query("UPDATE supplies SET status='1' WHERE id=$1", [id])
        res.redirect('/fleet-management/requests');
    } else {
        const result = await db.query("DELETE FROM supplies WHERE id=$1", [id])
        res.redirect('/fleet-management/requests');
    }
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
}
