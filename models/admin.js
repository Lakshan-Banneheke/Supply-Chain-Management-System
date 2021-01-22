const db = require('../config/db');

class Admin {
    static async approveUser(user_id) {
        const query = `UPDATE user_profile SET verified=true WHERE user_id = $1`;
        const out = await db.query(query, [user_id]);
        return out.rows[0];
    }

    static async getAllUnverifiedUsers(){
        const query = 'SELECT * FROM user_profile NATURAL JOIN user_category WHERE verified=false';
        const out = await db.query(query);
        return out.rows;
    }

    static async disapproveUser(user_id) {
        const query = `DELETE FROM user_profile WHERE user_id = $1`;
        const out = await db.query(query, [user_id]);
        return out.rows[0];
    }

}

module.exports = Admin;