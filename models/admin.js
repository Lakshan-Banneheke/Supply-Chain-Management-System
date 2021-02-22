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
    static async editInfo(new_name, new_email,new_contact_num,id) {
        //const query = `UPDATE user_profile SET name= $1,email=$2,contact_num=$3 WHERE user_id = $4`;
        const query=`CALL editProfile($1,$2,$3,$4)`;
        const out = await db.query(query, [new_name, new_email,new_contact_num,id]);
        return out.rows[0];
    }
    static async changePassword(hashed_new_password,id) {
        const query = `UPDATE user_profile SET password= $1 WHERE user_id = $2`;
        const out = await db.query(query, [hashed_new_password,id]);
        return out.rows[0];
    }
}

module.exports = Admin;