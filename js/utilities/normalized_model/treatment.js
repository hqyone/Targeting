/**
 * Created by qhe on 7/20/16.
 */

var fs = require('fs');


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
    this.name = "Unknown";
    this.ongoing = "";
    this.type ="";
    this.dose="";
    this.unit="";
    this.tx_trial="";
    this.response = "";
}

Treatment.prototype.toTreeJson=function(id){
    var self = this;
    return {
        id:id,
        label:self.name,
        inode:false,
        des:self.uu,
        timeline:"<div style='background-color:yellow;'>"+self.uu+"</div>",
        s_day:self.s_days,
        e_day:self.e_days
    }
}

Treatment.prototype.WriteToDBTables =function(outdir){
    var self =  this;
    var tab_file = outdir+"/treatment.tsv";
    var content_ls = [];
    content_ls.push('NULL');
    content_ls.push(self.p_bc);
    content_ls.push(self.i);
    content_ls.push(self.bc);
    content_ls.push(self.uu);
    content_ls.push(self.s_days);
    content_ls.push(self.e_days);


    content_ls.push(self.name);
    content_ls.push(self.ongoing);
    content_ls.push(self.type);
    content_ls.push(self.dose);

    content_ls.push(self.unit);
    content_ls.push(self.tx_trial);
    content_ls.push(self.response);

    fs.appendFileSync(tab_file, content_ls.join("\t")+"\n", encoding='utf8');
};

module.exports.Treatment = Treatment;
module.exports.treatment_abb_dic = treatment_abb_dic;