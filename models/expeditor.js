const { types } = require('joi');
const db = require('../config/db');
class expeditor {
    static async getAllprojects() {
        console.log("getallprojects");
        const query=`SELECT name FROM project`;
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
        const query=`SELECT p_id FROM project WHERE name = $1`;
        const out = await db.query(query,[p_name]);
        // console.log(out.rows);
        return out.rows[0];
    } 
    
    static async addToMaterialOrder(project_id, shop_name) {
        console.log("addToMaterialOrder");
        const query=`INSERT INTO Material_Order (P_id, shop_name, ordered, received)
                     VALUES($1,$2,$3,$4)
                     RETURNING O_id;`;
        const out = await db.query(query,[project_id, shop_name, 'no', 'no']);
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
        const query=`UPDATE Material_Order SET ordered= 'yes',order_date=$1 WHERE O_id = $2`;
        const out = await db.query(query,[today,o_id]);
        return out.rows;
    }

    static async ordersOfProject(p_id) {
        console.log("ordersOfProject");
        const query=`SELECT * FROM material_order where p_id = $1`;
        const out = await db.query(query,[p_id]);
        return out.rows;
    }

    static async estimationsOfProject(p_id) {
        console.log("estimationsOfProject");
        const query=`SELECT * FROM Estimate where p_id = $1 and submit_status= true`;
        const out = await db.query(query,[p_id]);
        return out.rows;
    }
    
    static async getOrderItems(o_id) {
        console.log("getOrderItems");
        const query=`SELECT * FROM order_items join materialvalue USING(m_id) WHERE o_id = $1`;
        const out = await db.query(query,[o_id]);
        return out.rows;
    }

    static async getOrderState(o_id) {
        console.log("getOrderState");
        const query=`SELECT ordered FROM material_order where o_id = $1`;
        const out = await db.query(query,[o_id]);
        return out.rows;
    }

    static async deleteOrder(o_id) {
        console.log("deleteOrder");
        const query=`DELETE FROM material_order where o_id = $1`;
        const out = await db.query(query,[o_id]);
        return out.rows;
    }
    static async getEstimate(e_id) {
        console.log("getEstimate");
        const query=`SELECT * FROM Est_Mat join materialvalue USING(m_id) join Estimate USING(e_id) WHERE e_id = $1 and submit_status= true`;
        const out = await db.query(query,[e_id]);
        return out.rows;
    }
    
    
}

module.exports = expeditor;