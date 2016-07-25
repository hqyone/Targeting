/**
 * Created by qhe on 7/20/16.
 */
var radiation_abb_dic={
    p_bc:"patient_barcode",
    i:"index",
    site:"anatomic_treatment_site",
    bc:"bcr_radiation_barcode",
    uu:"bcr_radiation_uuid",
    cn:"course_number",
    s_days:"days_to_radiation_therapy_start",
    e_days:"days_to_radiation_therapy_end",
    frac:"numfractions",
    dosage:"radiation_dosage",
    units:"units",
    ongoing:"radiation_treatment_ongoing",
    type:"radiation_type",
    reg:"regimen_indication"
}

function Radiation(){
    this.site = "";
    this.bc="";
    this.i="";
    this.uu="";
    this.cn="";
    this.s_days=null;
    this.e_days=null;
    this.frac="";
    this.dosage="";
    this.units="";
    this.ongoing="";
    this.type="";
    this.reg="";
}


Radiation.prototype.toTreeJson=function(id){
    var self = this;
    return {
        id:id,
        label:self.type,
        inode:false,
        des:self.uu
    }
}
module.exports.Radiation = Radiation;
module.exports.radiation_abb_dic = radiation_abb_dic;