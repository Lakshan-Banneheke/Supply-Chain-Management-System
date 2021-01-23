const { types } = require('joi');
const db = require('../config/db');
class expeditor {
    static async getAllprojects() {
        console.log("getallprojects");
        const query=`SELECT * FROM project`;
        const out = await db.query(query);
        return out.rows;
    }
    
    static async getMaterialValues() {
        console.log("getMaterialValues");
        const query=`SELECT * FROM materialvalue`;
        const out = await db.query(query);
        return out.rows;
    }
    
    static async getProjectId(p_name) {
        console.log("getProjectId");
        const query=`SELECT project_id FROM project WHERE project_name = $1`;
        const out = await db.query(query,[p_name]);
        // console.log(out.rows);
        return out.rows[0];
    } 
    
    static async addToMaterialOrder(project_id, shop_name) {
        console.log("addToMaterialOrder");
        const query=`INSERT INTO Material_Order (project_id, shop_name, order_state, ordered)
                     VALUES($1,$2,$3,$4)
                     RETURNING order_id;`;
        const out = await db.query(query,[project_id, shop_name, 'not completed', 'no']);
        return out.rows[0];
    }
    
    static async addToOrderItems(final_materials, final_quantiies,o_id) {
        console.log("addToOrderItems");
        const query=`CALL addOrderItems($1,$2,$3)`;
        const out = await db.query(query,[final_materials, final_quantiies, o_id]);
        // console.log(out.rows);
        return out.rows;
    }
   
    static async  changeOrderState(o_id,today) {
        console.log("changeOrderState");
        const query=`UPDATE Material_Order SET ordered= 'yes',order_date=$1 WHERE order_id = $2`;
        const out = await db.query(query,[today,o_id]);
        return out.rows;
    }

    static async ordersOfProject(p_id) {
        console.log("ordersOfProject");
        const query=`SELECT * FROM material_order where project_id = $1`;
        const out = await db.query(query,[p_id]);
        return out.rows;
    }

    static async estimationsOfProject(p_id) {
        console.log("estimationsOfProject");
        const query=`SELECT * FROM Estimate where project_id = $1 and submit_status= true`;
        const out = await db.query(query,[p_id]);
        return out.rows;
    }
    
    static async getOrderItems(o_id) {
        console.log("getOrderItems");
        const query=`SELECT * FROM order_item join materialvalue USING(m_id) WHERE order_id = $1`;
        const out = await db.query(query,[o_id]);
        return out.rows;
    }

    static async getOrderState(o_id) {
        console.log("getOrderState");
        const query=`SELECT ordered FROM material_order where order_id = $1`;
        const out = await db.query(query,[o_id]);
        return out.rows;
    }

    static async deleteOrder(o_id) {
        console.log("deleteOrder");
        const query=`DELETE FROM material_order where order_id = $1`;
        const out = await db.query(query,[o_id]);
        return out.rows;
    }
    static async getEstimate(e_id) {
        console.log("getEstimate");
        const query=`SELECT * FROM Est_Mat join materialvalue USING(m_id) join Estimate USING(e_id) WHERE e_id = $1 and submit_status= true`;
        const out = await db.query(query,[e_id]);
        return out.rows;
    }
    static async getOneProjectName(projectID) {
        const query  = `SELECT project_name FROM project WHERE project_id = $1`;
        const out = await db.query(query,[projectID]);
        console.log(out.rows[0]);
        return out.rows[0];
    }
    static async getAllsections(projectID) {
        const query  = `SELECT section_id, section_name FROM project_section WHERE project_id = $1`;
        const out = await db.query(query,[projectID]);
        return out.rows;
    }
    static async getConsumptionReport(projectID,sectionID) {
        const query  = `SELECT material_name, unit, SUM(received_quantity) FROM site_request JOIN material_request USING (request_id) JOIN stock USING(material_name) WHERE project_id =$1 AND section_id =$2 GROUP BY material_name, unit`;
        const out = await db.query(query,[projectID,sectionID]);
        return out.rows;
        
    }
}

module.exports = expeditor;