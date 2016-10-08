/**
 * Created by qhe on 7/20/16.
 */
var fs = require('fs');

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
    this.c_stage=null;
    this.p_stage=null;
    this.p_m=null;
    this.p_n=null;
    this.p_t=null;
    this.site="";
    this.site_tx="";
    this.h_type="";
    this.h_type_tx="";
    this.rad="";
    this.drugs=[];
    this.surgery=null;
    this.dx_days=null;
}

Malignancy.prototype.WriteToDBTables = function(outdir){
    var self =  this;
    var tab_file = outdir+"/malignancy.tsv";
    var content_ls = [];
    content_ls.push('NULL');
    content_ls.push(self.p_bc);
    content_ls.push(self.i);
    content_ls.push(self.bc);
    content_ls.push(self.uu);
    content_ls.push(self.m_type);

    content_ls.push(self.c_stage);
    content_ls.push(self.p_stage);
    content_ls.push(self.p_m);
    content_ls.push(self.p_n);
    content_ls.push(self.p_t);

    content_ls.push(self.site);
    content_ls.push(self.site_tx);
    content_ls.push(self.h_type);
    content_ls.push(self.h_type_tx);
    content_ls.push(self.rad);
    content_ls.push(self.drugs.length);
    content_ls.push(self.surgery);
    content_ls.push(self.dx_days);

    fs.appendFileSync(tab_file, content_ls.join("\t")+"\n", encoding='utf8');
    if (self.drugs.length>0){
        for (var i=0; i<self.drugs.length; i++){
            var t = self.drugs[i];
            t.WriteToDBTables(outdir);
        }
    }

}

Malignancy.prototype.getTimeLineStr =function()
{
    var self =this;
    var result = "";
    if(self.dx_days!=null){
        result = "m,"+self.site+","+self.dx_days+";";
    }
    return result;
};

Malignancy.prototype.getTooltipStr =function()
{
    var self =this;
    var result = "";
    if (self.c_stage!=null ){
        result = "Clinical Stage,"+self.c_stage+";";
    }
    if (self.p_stage!=null){
        result = "Pathologic Stage,"+self.p_stage+";";
    }
    if (self.p_n!=null){
        result = "Pathologic N,"+self.p_n+";";
    }
    if (self.p_m!=null){
        result = "Pathologic M,"+self.p_m+";";
    }
    if (self.p_t!=null){
        result = "Pathologic T,"+self.p_t+";";
    }
    return result;
};

Malignancy.prototype.toTreeJson=function(id){
    var self = this;
    return {
        id:id,
        label:self.site + "["+self.m_type+"]",
        inode:false,
        des:self.uu,
        timeline:self.getTimeLineStr(), //type,status,start,end;
        tooltip:self.getTooltipStr()
    }
};

module.exports.Malignancy = Malignancy;
module.exports.malignancy_abb_dic = malignancy_abb_dic;