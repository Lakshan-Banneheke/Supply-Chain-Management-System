const db = require('../config/db');

class StoreKeeper {

    static async getStock() {
        const query=`SELECT * FROM Stock`;
        const out = await db.query(query);
        return out.rows;
    }

    static async getStockUpdateRequests(){
        const query = 'SELECT * FROM Material_order';
        const out = await db.query(query);
        return out.rows;
    }

    static async getMaterialRequests(){
        const query = "SELECT * FROM Site_Request where request_state='not completed'";
        const out = await db.query(query);
        return out.rows;
    }

    static async getCompletedMaterialRequests(){
        const query = "SELECT * FROM Site_Request where request_state='Completed' OR request_state='Partially Completed'";
        const out = await db.query(query);
        return out.rows;
    }

    static async getCountAllReq(){
        const query = "SELECT COUNT(request_id) from Site_Request";
        const out  = await  db.query(query);
        return out.rows[0];
    }

    static async getCountCompReq(){
        const query="SELECT COUNT(request_id) from Site_Request where request_state='not completed'";
        const out  = await  db.query(query);
        return out.rows[0];
    }

    static async getMaterialRequestByID(id){
        const query = 'SELECT * FROM Site_Request where request_id='+id;
        const out = await db.query(query);
        return out.rows;
    }

    static async getRequestedMaterials(id){
        const query = 'SELECT * FROM Material_Request where request_id=' + id;
        const out = await db.query(query);
        return out.rows;
    }

    static async getQuantityByName(name){
        const query = "SELECT material_quantity FROM Stock where material_name=$1";
        const out =  await db.query(query,[name]);
        return out.rows;
    }

    static async updateRequestState(req_id,state){
        const query = "UPDATE Site_Request SET request_state=$1 WHERE request_id=$2";
        await db.query(query,[state,req_id]);
        console.log("State update is sucessful");
    }

    static async updateReceivedQuantityNoChange(req_id){

        let mat = await this.getRequestedMaterials(req_id);
        let query = 'UPDATE Material_Request SET received_quantity=$1 WHERE material_name=$2 and request_id=$3';
        for(let i=0; i<mat.length; i++){
            var material = mat[i].material_name;

            var qty =  mat[i].requested_quntity;

            await db.query(query,[qty,material,req_id]);
        }
        let mat2 = await this.getRequestedMaterials(req_id);


    }

    static async updateStocksReduce(req_id){
        let mat = await this.getRequestedMaterials(req_id);
        let query1 = 'SELECT material_quantity from Stock where material_name=$1';
        let query2 = 'UPDATE Stock SET material_quantity=$1 WHERE material_name=$2';
        for(let i=0;i<mat.length;i++){
            let material = mat[i].material_name;

            let qty = await db.query(query1,[material]);
            qty = qty.rows[0].material_quantity;
            let qty2 = mat[i].received_quantity;
            let qty1 = qty - qty2;
            await db.query(query2,[qty1,material]);
        }
    }


    // update received quantity and stocks when there is a value change
    static async updateReceivedQuantityWithChange(rec_mat,req_id){
        let req_mat = await this.getRequestedMaterials(req_id);
        let query = 'UPDATE Material_Request SET received_quantity=$1 WHERE material_name=$2 and request_id=$3';

        for(var i=0;i<req_mat.length;i++){
            if(rec_mat[i]==''){
                var rec_qty = req_mat[i].requested_quntity;
                var mat_name = req_mat[i].material_name;
                await db.query(query,[rec_qty,mat_name,req_id]);

            }else{
                var rec_qty = Number(rec_mat[i]);

                var mat_name = req_mat[i].material_name;

                await db.query(query,[rec_qty,mat_name,req_id]);

            }
        }

    }

    static async updateIssueDate(req_id){
        const query = "UPDATE Site_Request SET issue_date=current_date WHERE request_id=$1";

        await db.query(query,[req_id]);

    }


    //stock update models


    static async getOrders(){
        console.log("done");
        const query = "SELECT * FROM Material_Order where order_state='not completed'  and ordered=true";
        console.log("done2");
        const out = await db.query(query);
        console.log(out.rows);
        return out.rows;
    }


    static async getOrderedMaterials(id){
        // const query = 'select * from order_item where order_id= + id;'
        const query = 'SELECT * FROM Order_item,MaterialValue where MaterialValue.M_id=Order_item.M_id and Order_item.order_id=' + id;
        const out = await db.query(query);
        return out.rows;
    }

    static async getOrderByID(id){
        const query = 'SELECT * FROM Material_Order where order_id='+id;
        const out = await db.query(query);
        return out.rows;
    }

    static async getCountAllOrd(){
        const query = "SELECT COUNT(order_id) from Material_Order";
        const out  = await  db.query(query);
        return out.rows[0];
    }

    static async getCountCompOrd(){
        const query="SELECT COUNT(order_id) from Material_Order where order_state='not completed'";
        const out  = await  db.query(query);
        return out.rows[0];
    }

    static async updateOrderState(ord_id,state){
        const query = "UPDATE Material_Order SET order_state=$1 WHERE order_id=$2";
        await db.query(query,[state,ord_id]);
        console.log("State update is sucessful");
    }




    static async updateOrderQuantityNoChange(req_id){
        let mat = await this.getOrderedMaterials(req_id);
        console.log("changing materials");
        console.log(mat);
        let query = 'UPDATE Order_Item SET received_quantity=$1 WHERE M_id=$2 and order_id=$3';
        for(let i=0; i<mat.length; i++){
            var material = mat[i].m_id;
            console.log(material);
            var qty =  mat[i].ordered_quantity;
            console.log(qty);
            await db.query(query,[qty,material,req_id]);
        }
        // let mat2 = await this.getRequestedMaterials(req_id);
        console.log("requested quantity update successful");

    }

    static async updateOrderQuantityWithChange(rec_mat,req_id) {
        let req_mat = await this.getOrderedMaterials(req_id);
        let query = 'UPDATE Order_Item SET received_quantity=$1 WHERE M_id=$2 and order_id=$3';
        // console.log(req_mat);
        for (var i = 0; i < req_mat.length; i++) {
            if (rec_mat[i] == '') {
                var rec_qty = req_mat[i].ordered_quantity;
                var mat_name = req_mat[i].m_id;
                await db.query(query, [rec_qty, mat_name, req_id]);

            } else {
                var rec_qty = Number(rec_mat[i]);

                var mat_name = req_mat[i].m_id;

                await db.query(query, [rec_qty, mat_name, req_id]);

            }
        }
    }


    static async updateReceivedDate(order_id){
        const query = "UPDATE Material_Order SET received_date=current_date WHERE order_id=$1";

        await db.query(query,[order_id]);

    }


    static async updateStocksAdd(req_id){
        let mat = await this.getOrderedMaterials(req_id);
        // console.log(mat);
        let query1 = 'SELECT material_quantity from Stock where material_name=$1';
        let query2 = 'UPDATE Stock SET material_quantity=$1 WHERE material_name=$2';
        let query3 = 'INSERT INTO STOCK(material_name,material_quantity,unit) VALUES ($1,$2,$3)';
        for(let i=0;i<mat.length;i++){
            let material = mat[i].m_name;
            // console.log(material);
            let qty = await db.query(query1,[material]);
            qty = qty.rows;
            console.log(qty);
            if(qty.length==0){
                var mat_name= mat[i].m_name;
                var mat_qty= mat[i].received_quantity;
                var mat_unit= mat[i].m_amount;
                db.query(query3,[mat_name,mat_qty,mat_unit])
            }
            else{
                qty = qty[0].material_quantity;
                let qty2 = mat[i].received_quantity;
                let qty1 = qty + qty2;
            // console.log(qty1);
            await db.query(query2,[qty1,material]);
            }
        }
        console.log("stocks added successfully");
    }


    static async getMaterialsStocks(req_id){

        let mat = await this.getRequestedMaterials(req_id);

        let avail_qty = [];
        let query1 = 'SELECT material_quantity from Stock where material_name=$1';
        for(let i=0; i<mat.length;i++){
            var mat_name = mat[i].material_name;
            var out = await db.query(query1,[mat_name]);
            avail_qty.push(out.rows[0].material_quantity);
        }
        return avail_qty;
    }

    //get unread notifications
    static async getNotification(){
        let query = "SELECT * from Notification where to_designation='storekeeper' and state='unread'";
        let out = await db.query(query);
        return out.rows;
    }

    //update notification state

    static async markAsRead(not_id){
        let query = "UPDATE Notification SET state='read' WHERE notifi_id=$1";
        await db.query(query,[not_id]);
    }

    static async newNotification(msg,to_des){
        let query = "INSERT INTO Notification(message,to_designation,state,from_Designation,date) VALUES($1,$2,'unread','storekeeper',current_date)";
        await db.query(query,[msg,to_des]);
    }


}



module.exports = StoreKeeper;