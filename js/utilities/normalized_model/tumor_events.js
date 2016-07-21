/**
 * Created by qhe on 7/20/16.
 */

var tumor_event_abb_dic={
    pharm:"additional_pharmaceutical_therapy",
    rad:"additional_radiation_therapy",
    days:"days_to_new_tumor_event_after_initial_treatment",
    type:"new_neoplasm_event_type",
    determine:"progression_determined_by"
}


function TumorEvent(){
    this.pharm ="";
    this.rad="";
    this.days=null;
    this.type="";
    this.determine="";
}