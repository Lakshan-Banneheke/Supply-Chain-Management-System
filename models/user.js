const db = require('../config/db');

class User {
    static async registerUser(name, email, hashedPassword, category, gender, doj, contactNo) {
        const query  = `CALL registerUser ($1, $2, $3, $4, $5, $6, $7)`;
        const out = await db.query(query, [name, hashedPassword, email, category, contactNo, gender, doj]);
        return out.rows;
    }
}

module.exports = User;