/**
 * Created by qhe on 7/20/16.
 */
var followup_abb_dic={
    p_bc:"patient_barcode",
    i:"index",
    bc:"bcr_followup_barcode",
    uu:"bcr_followup_uuid",
    su:"followup_treatment_success",
    l_days:"days_to_last_followup",
    n_days:"days_to_new_tumor_event_after_initial_treatment",
    re:"followup_case_report_form_submission_reason",
    statue:"person_neoplasm_cancer_statue",
    days:"The days of followup",
    l_surgery:"locoregional_procedure",
    m_surgery:"metastatic_procedure",
    rad:"radiation_therapy",
    drug_tx:"targeted_molecular_therapy",
    vital:"vital_status"
}


function FollowUp(){
    this.p_id="";
    this.i=null;
    this.bc="";
    this.uu="";
    this.su ="";
    this.l_days=null;
    this.n_days=null;
    this.re="";
    this.statue="";
    this.days=null;
    this.l_surgery="";
    this.m_surgery="";
    this.rad="";
    this.drug_tx ="";
    this.vital="";
}

module.exports.FollowUp = FollowUp;
module.exports.followup_abb_dic = followup_abb_dic;