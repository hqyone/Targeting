/**
 * Created by qhe on 7/20/16.
 */
var sample_abb_dic={
    p_id:"patient_id",
    bc:"bcr_sample_barcode",
    uu:"bcr_sample_uuid",
    ffpe:"is_ffpe",
    type:"sample_type",
    l_dim:"longest_dimension",
    s_dim:"shortest_dimension",
    dx_slides:"diagnostic_slides",
    col_days:"days_to_collection",
    col_s_days:"the possible earliest days for collection",
    col_e_days:"the possible last days for collection"
};


function Sample(){
    this.p_id="";
    this.bc ="";
    this.uu="";
    this.ffpe="";
    this.type="";
    this.l_dim="";
    this.s_dim="";
    this.col_day="";
    this.dx_slides=[];
}