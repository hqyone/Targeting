/**
 * Created by qhe on 7/20/16.
 */
var malignancy_abb_dic={
    p_bc:"patient_bc",
    i:"index",
    bc:"bcr_omf_barcode",
    uu:"bcr_omf_uuid",
    m_type:"malignancy_type",
    c_stage:"clinical_stage",
    p_stage:"pathologic_stage",
    p_m:"pathologic_m",
    p_n:"pathologic_n",
    p_t:"pathologic_t",
    site:"other_malignancy_anatomic_site",
    site_tx:"other_malignancy_anatomic_site_text",
    h_type:"other_malignancy_histological_type",
    h_type_tx:"other_malignancy_histological_type_text",
    rad:"radiation_tx_indicator",
    drugs:"drugs",
    surgery:"surgery",
    dx_days:"days_to_other_malignancy_dx"
}


function Malignancy(){
    this.p_bc="";
    this.i=null;
    this.bc="";
    this.uu="";
    this.m_type="";
    this.c_stage="";
    this.p_stage="";
    this.p_m="";
    this.p_n="";
    this.p_t="";
    this.site="";
    this.site_tx="";
    this.h_type="";
    this.h_type_tx="";
    this.rad="";
    this.drugs=[];
    this.surgery=null;
    this.dx_days=null;
}

Malignancy.prototype.toTreeJson=function(id){
    var self = this;
    return {
        id:id,
        label:self.site + "["+self.m_type+"]",
        inode:false,
        des:self.uu
    }
}

module.exports.Malignancy = Malignancy;
module.exports.malignancy_abb_dic = malignancy_abb_dic;