/**
 * Created by qhe on 7/20/16.
 */
var fs = require('fs');

var followup_abb_dic={
    p_bc:"patient_barcode",
    i:"index",
    bc:"bcr_followup_barcode",
    uu:"bcr_followup_uuid",
    su:"followup_treatment_success",
    f_days:"days_to_first_followup",
    l_days:"days_to_last_followup",
    n_days:"days_to_new_tumor_event_after_initial_treatment",
    d_days:"days_to_death",
    re:"followup_case_report_form_submission_reason",
    status:"person_neoplasm_cancer_status",
    l_surgery:"locoregional_procedure",
    m_surgery:"metastatic_procedure",
    rad:"radiation_therapy",
    drug_tx:"targeted_molecular_therapy",
    vital:"vital_status"
}


function FollowUp(){
    this.p_bc="";
    this.i=null;
    this.bc="";
    this.uu="";
    this.su ="";
    this.f_days =0;
    this.l_days=null;
    this.n_days=null;
    this.d_days=null;
    this.re="";
    this.status="";
    this.l_surgery="";
    this.m_surgery="";
    this.rad="";
    this.drug_tx ="";
    this.vital="";
}

FollowUp.prototype.WriteToDBTables =function(outdir){
    var self =  this;
    var tab_file = outdir+"/followups.tsv";
    var content_ls = [];
    content_ls.push('NULL');
    content_ls.push(self.p_bc);
    content_ls.push(self.i);
    content_ls.push(self.bc);
    content_ls.push(self.uu);
    content_ls.push(self.su);

    content_ls.push(self.f_days);
    content_ls.push(self.l_days);
    content_ls.push(self.n_days);
    content_ls.push(self.d_days);
    content_ls.push(self.re);

    content_ls.push(self.status);
    content_ls.push(self.l_surgery);
    content_ls.push(self.m_surgery);
    content_ls.push(self.rad);
    content_ls.push(self.drug_tx);
    content_ls.push(self.vital);

    fs.appendFileSync(tab_file, content_ls.join("\t")+"\n", encoding='utf8');
};

FollowUp.prototype.getTimeLineStr =function()
{
    var self =this;
    var result = "f,"+self.status+","+self.f_days+","+self.l_days+";";
    if (self.n_days!=null){
        result = "fn,,"+self.n_days+";";
    }
    if (self.d_days!=null){
        result = "fd,,"+self.d_days+";";
    }
    return result;
};

FollowUp.prototype.getTooltipStr =function()
{
    var self =this;
    var result = "";
    if (self.n_days!=null){
        result = "days of new tumor,"+self.n_days+";";
    }
    if (self.status!=null){
        result = "Cancer status,"+self.status+";";
    }
    return result;
};

FollowUp.prototype.toTreeJson=function(id){
    var self = this;
    return {
        id:id,
        label:"Followup ["+self.status+"]",
        inode:false,
        des:self.uu,
        timeline:self.getTimeLineStr(), //type,status,start,end;
        tooltip:self.getTooltipStr()
    }
}



module.exports.FollowUp = FollowUp;
module.exports.followup_abb_dic = followup_abb_dic;