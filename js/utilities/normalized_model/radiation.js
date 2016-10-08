/**
 * Created by qhe on 7/20/16.
 */

var fs = require('fs');
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

Radiation.prototype.WriteToDBTables =function(outdir){
    var self =  this;
    var tab_file = outdir+"/radiation.tsv";
    var content_ls = [];
    content_ls.push('NULL');
    content_ls.push(self.p_bc);
    content_ls.push(self.i);
    content_ls.push(self.bc);
    content_ls.push(self.uu);
    content_ls.push(self.cn);

    content_ls.push(self.s_days);
    content_ls.push(self.e_days);
    content_ls.push(self.frac);
    content_ls.push(self.dosage);
    content_ls.push(self.units);

    content_ls.push(self.ongoing);
    content_ls.push(self.type);
    content_ls.push(self.reg);

    fs.appendFileSync(tab_file, content_ls.join("\t")+"\n", encoding='utf8');
};


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