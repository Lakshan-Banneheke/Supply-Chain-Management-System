const expeditor = require('../models/expeditor');

class expeditorService {
    static async getProjects(){
        return expeditor.getAllprojects();
    }

    static async showMaterials(){
        return expeditor.getMaterialValues();
    }
    static async addNewOrder({final_materials,final_quantiies, optionProject, shop_name}){
        const project_id = await expeditor.getProjectId(optionProject);
       
        const o_id =(await expeditor.addToMaterialOrder(project_id.project_id, shop_name)).order_id;
        //  console.log(final_materials);
        //  console.log(final_quantiies);
        //  console.log(o_id);
        expeditor.addToOrderItems(final_materials, final_quantiies,o_id);
        return (o_id);
    }

    static async sendOrder({o_id}){
        const today = new Date();
        // const day = (("0" + today.getDate()).slice(-2));
        // const month = ("0" + (today.getMonth() + 1)).slice(-2);
        // const year = today.getFullYear();  
        // const orderDate= year+ '-' + month + '-' +day ;
        // console.log(orderDate);
        return expeditor.changeOrderState(o_id,today);
    }
    static async deleteOrder({o_id}){
        return expeditor.deleteOrder(o_id);
    }
    static async getOrdersAndEstimations({Project_name}){
        // console.log(Project_name);
        const project_id = await expeditor.getProjectId(Project_name);
     
        const estimations = await expeditor.estimationsOfProject(project_id.project_id);
        //  console.log(estimations[0]);
        const orders = await expeditor.ordersOfProject(project_id.project_id);
       
        return [orders, estimations];
    }
    static async showCompleteOrder({o_id}){
        const orderState = await expeditor.getOrderState(o_id);   
        const orderItems = await expeditor.getOrderItems(o_id);  
        // console.log(orderState);
        // console.log(orderItems);
        return [orderState,orderItems];   
    }
    static async showCompleteEstimate({e_id}){
        const estimate_materials = await expeditor.getEstimate(e_id);  
        // console.log(orderState);
        // console.log(orderItems);
        return estimate_materials;   
    }
    
    // static async showEstimate(){
    //     return QS.getEstimate();
    // }
    

}

module.exports = expeditorService;