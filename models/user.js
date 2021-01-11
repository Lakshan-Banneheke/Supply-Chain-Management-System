const db = require('../config/db');

class User {
    static async registerUser() {
        const query  = `INSERT INTO test VALUES ('Clarke', 'clarke@gmail.com', '12345')`;
        const out = await db.query(query);
        return out.rows;
    }
}

module.exports = User;