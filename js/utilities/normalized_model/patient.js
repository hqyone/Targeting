/**
 * Created by qhe on 7/20/16.
 */

var patient_abb_dic={
    ts_site:"tissue_source_site",
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

    this.samples=[];
    this.malignancies=[];
    this.treatments=[];
    this.followups=[];
    this.radiations=[];
    this.tumor_events=[];
}


module.exports.Patient = Patient;
module.exports.patient_abb_dic = patient_abb_dic;