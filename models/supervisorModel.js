const db = require('../config/db')


class supervisorModel {

    static async getAllprojects() {
        const query  = "SELECT * FROM project";
        const out = await db.query(query);
        // console.log(out.rows);
        return out.rows;
    }

    static async getAllsections(projectID) {
        const query  = `SELECT section_id, section_name FROM project_section WHERE project_id = $1`;
        const out = await db.query(query,[projectID]);
        return out.rows;
    }
    static async getOneProjectName(projectID) {
        const query  = `SELECT project_name FROM project WHERE project_id = $1`;
        const out = await db.query(query,[projectID]);
        console.log(out.rows[0]);
        return out.rows[0];
    }
    static async getProjectSectionName(projectID,sectionID) {
        const query  = `SELECT section_name FROM project_section WHERE project_id = $1 AND section_id = $2`;
        const out = await db.query(query,[projectID,sectionID]);
        return out.rows[0];
    }
    static async getAllmaterial() {
        const query  = `SELECT material_name, unit FROM stock`;
        const out = await db.query(query);
        return out.rows;
    }

    static async createNewRequest(projectID,sectionID,userID,requestDate,request_note) {
        const query  = `INSERT INTO site_request ( project_id, section_id, user_id, request_state, request_date,request_note) VALUES ($1,$2,$3,'not-complete',$4,$5)`;
        const out = await db.query(query,[projectID,sectionID,userID,requestDate,request_note]);
        return superviosrModel.getRequestID(projectID, sectionID);
    }

    static async getRequestID(projectID,sectionID) {
        const query  = `SELECT request_id FROM site_request WHERE project_id = $1 AND section_id = $2 ORDER BY request_date DESC `;
        const out = await db.query(query, [projectID,sectionID]);
        return out.rows[0];
    }


    static async addReqMaterial(requestID,materialName,materialQt) {
        const query  = `INSERT INTO material_request (request_id, material_name, requested_quantity) VALUES ($1,$2,$3)`;
        const out = await db.query(query,[requestID,materialName,materialQt]);
        return out.rows;
    }
//--------------------

    static async getConsumptionReport(projectID,sectionID) {
        const query  = `SELECT material_name, received_quantity FROM site_request JOIN material_request USING (request_id) WHERE project_id =$1 AND section_id =$2 GROUP BY section_id`;
        const out = await db.query(query,[projectID,sectionID]);
        return out.rows;
        
    }
//----------------------------------
    static async addNotification(message,to_designation,state,from_designation,date) {
            const query  = `INSERT INTO notification (message, to_designation, state,from_designation,date) VALUES ($1,$2,$3,$4,$5)`;
            const out = await db.query(query,[message,to_designation,state,from_designation,date]);
            return out.rows;
        

    }

    // static async getNotification(to_designation) {
    //     const query  = `SELECT * FROM notification WHERE to_designation = $1 AND state ="unread" ORDER BY date DESC`;
    //     const out = await db.query(query,[to_designation]);
    //     return out.rows;
    // }

    // static async markNotification(notifi_id) {
    //     const query  = `UPDATE notification SET state = "read" WHERE notifi_id = $1`;
    //     const out = await db.query(query,[notifi_id]);
    //     return out.rows;
    // }

}

module.exports = supervisorModel