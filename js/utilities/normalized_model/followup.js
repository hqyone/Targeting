/**
 * Created by qhe on 7/20/16.
 */
var followup_abb_dic={
    p_id:"patient_id",
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
    m_surgery:"metastatic_procedure"
}


function FollowUp(){
    this.p_id="";
    this.bc="";

}