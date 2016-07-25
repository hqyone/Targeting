/**
 * Created by qhe on 7/20/16.
 */

var patient_abb_dic={
    ts_site:"tissue_source_site",
    id:"patient_id",
    bc:"bcr_patient_barcode",
    uu:"bcr_patient_uuid",
    age:"age_at_initial_pathologic_diagnosis",
    o3s:"icd_o_3_site",
    o3h:"icd_o_3_histology",
    i10:"icd_10",
    b_days:"days_to_birth",
    d_days:"days_to_death",
    l_days:"days_to_last_known_alive",
    dx:"diagnosis",
    dx_days:"days_to_initial_pathologic_diagnosis",
    dx_age:"age_at_initial_pathologic_diagnosis",
    dx_year:"year_of_initial_pathologic_diagnosis",
    g:"gender",
    r:"race",
    stage:"pathologic_stage",
    p_m:"pathologic_m",
    p_n:"pathologic_n",
    p_t:"pathologic_t",
    tt_site:"tumor_tissue_site",
    vital:"vital_statue",
    c_status:"person_neoplasm_cancer_status",
    tumor:"residual_tumor"
};

function Patient(){
    this.ts_site="";
    this.id="";
    this.bc="";
    this.uu="";
    this.age=null;
    this.o3s="";
    this.o3h="";
    this.i10="";
    this.b_days=null;
    this.d_days=null;
    this.l_days=null;
    this.dx="";
    this.dx_days=null;
    this.dx_age=null;
    this.dx_year=null;
    this.g="";
    this.r="";
    this.stage="";
    this.p_m ="";
    this.p_n ="";
    this.p_t = "";
    this.tt_site="";
    this.vital = "";
    this.c_status = "";
    this.tumor = "";
    this.s_days = -100;
    this.e_days = 0;

    this.samples=[];
    this.malignancys=[];
    this.treatments=[];
    this.followups=[];
    this.radiations=[];
    this.tumor_events=[];
}

Patient.prototype.toTreeJson =function(id){
    var self = this;
    var cid = id;
    var result = {id:cid};
    result.label=self.bc+"[Age:"+self.age+"]";
    result.inode = true;
    result.icon ="patient";
    result.des = "des";
    result.branch=[];
    result = addListToResult(result, self.samples, cid+10, "Sample");
    result = addListToResult(result, self.malignancys, cid+20, "Malignancies");
    result = addListToResult(result, self.treatments, cid+30, "Treatments");
    result = addListToResult(result, self.tumor_events, cid+40, "TumorEvents");
    result = addListToResult(result, self.followups, cid+50, "Followups");
    return result;
}

Patient.prototype.getDaysRange = function(){
    var self =this;
    if(self.malignancy_ls.length>0){
        for (var i=0; i<self.malignancy_ls.length; i++){
            var m = self.malignancy_ls[i];
        }
    }

}

var addListToResult=function(result, list, cid, name){
    if (list.length>0){
        var s_ls =[];
        for (var i=0; i<list.length;i++){
            var s = list[i];
            cid+=1;
            s_ls.push(
                s.toTreeJson(cid)
            )
        }
        cid+=1;
        result.branch.push({
            id:cid,
            label:name+" ["+list.length+"]",
            inode:true,
            des:'des',
            branch:s_ls
        })
    }
    return result;
}

module.exports.Patient = Patient;
module.exports.patient_abb_dic = patient_abb_dic;