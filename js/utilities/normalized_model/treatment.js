/**
 * Created by qhe on 7/20/16.
 */
var treatment_abb_dic={
    p_bc:"patient_barcode",
    i:"index",
    bc:"bcr_drug_barcode",
    uu:"bcr_drug_uuid",
    e_days:"days_to_drug_therapy_end",
    s_days:"days_to_drug_therapy_start",
    name:"drug_name",
    ongoing:"therapy_ongoing",
    type:"therapy_type",
    dose:"total_dose",
    unit:"total_dose_units",
    tx_trial:"tx_on_clinical_trial",
    response:"measure_of_response"
}

function Treatment(){
    this.p_bc="";
    this.i=null;
    this.bc = "";
    this.uu = "";
    this.e_days = null;
    this.s_days = null;
    this.name = "";
    this.ongoing = "";
    this.type ="";
    this.dose="";
    this.unit="";
    this.tx_trial="";
    this.response = "";
}

module.exports.Treatment = Treatment;
module.exports.treatment_abb_dic = treatment_abb_dic;