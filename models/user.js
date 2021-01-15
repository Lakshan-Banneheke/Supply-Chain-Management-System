const db = require('../config/db');

class User {
    // static async registerUser() {
    //     const query  = `INSERT INTO test VALUES ('Clarke', 'clarke@gmail.com', '12345')`;
    //     const out = await db.query(query);
    //     console.log
    //     return out.rows;
    // }
    static async registerUser(name, email, hashedPassword, category, gender, doj, contactNo) {
        try {
            const query = `CALL registerUser ($1, $2, $3, $4, $5, $6, $7)`;
            const out = await db.query(query, [name, hashedPassword, email, category, contactNo, gender, doj]);
            return out.rows;
        } catch (e) {
            throw (`Email ${e} already registered`);
        }
    }

    static async getRegisteredUserByEmail(email) {
        console.log("getRegisteredUserByEmail");
        const query=`SELECT * FROM user_profile WHERE email = $1`;
        const out = await db.query(query, [email]);
        return out.rows[0];
    }

    static async getRegisteredUserByID(id) {
        const query=`SELECT * FROM user_profile WHERE user_id = $1`;
        const out = await db.query(query, [id]);
        return out.rows[0];
    }
}

module.exports = User;