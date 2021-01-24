const QS = require('../models/qs');

class qsService {
    static async showMaterials(){
        return QS.getMaterialValues();
    }

    static async showMaterialtoEstimate(material_name,material_amount){
        return QS.getMaterialtoEstimate(material_name,material_amount);
    }

    static async addNewMaterial({m_name, m_amount, m_cost}){
        return QS.addNewMaterialTodb(m_name, m_amount, m_cost);
    }
    
    static async saveNewEstimate(project_name,estimate_materials){
        return QS.saveNewEstimateTodb(project_name,estimate_materials);
    }

    static async showEstimate({e_id}){
        return QS.getEstimate(e_id);
    }
    
    static async sendEstimate(e_id){
        return QS.sendEstimate(e_id);
    }

    static async deleteEstimate(e_id){
        return QS.deleteEstimate(e_id);
    }
    
    static async showEst_Project({e_id}){
        return QS.getEst_Project(e_id);
    }

    static async showAllProjects(){
        return QS.getAllProjects();
    }
    
    static async getProjectIdFromName(project_name){
        return QS.getProjectIdFromName(project_name);
    }

    static async getProjectEstimations(project_id){
        return QS.getProjectEstimations(project_id);
    }
    
    static async saveNewProject({p_name,p_startDate}){
        return QS.saveNewProjectTodb(p_name,p_startDate);
    }
    
    static async ViewProjects({from_date,to_date}){
        return QS.ViewProjects(from_date,to_date);
    }
    
}

module.exports = qsService;