/**
 * Created by qhe on 7/20/16.
 */

var fs = require('fs');

var sample_abb_dic={
    p_bc:"patient_barcode",
    bc:"bcr_sample_barcode",
    uu:"bcr_sample_uuid",
    ffpe:"is_ffpe",
    type:"sample_type",
    l_dim:"longest_dimension",
    s_dim:"shortest_dimension",
    dx_slides:"diagnostic_slides",
    col_days:"days_to_collection",
    col_s_days:"the possible earliest days for collection",
    col_e_days:"the possible last days for collection",
    weight:"initial_weight"
};


function Sample(){
    this.p_bc="";
    this.bc ="";
    this.uu="";
    this.ffpe="";
    this.type="";
    this.l_dim="";
    this.s_dim="";
    this.col_days=null;
    this.col_s_days=null;
    this.col_e_days=null;
    this.dx_slides=[];
    this.weight=null;
}

Sample.prototype.toTreeJson=function(id){
    var self = this;
    var s_day = self.col_s_days;
    var e_day = self.col_e_days;
    if (self.col_days!=null){
        s_day = self.col_days;
        e_day = self.col_days;
    }
    return {
        id:id,
        label:self.type,
        inode:false,
        des:self.uu,
        s_day:s_day,
        e_day:e_day
    }
}
Sample.prototype.WriteToDBTables =function(outdir){
    var self =  this;
    var tab_file = outdir+"/samples.tsv";
    var content_ls = [];
    content_ls.push('NULL');
    content_ls.push(self.p_bc);
    content_ls.push(self.bc);
    content_ls.push(self.uu);
    content_ls.push(self.ffpe);

    content_ls.push(self.type);
    content_ls.push(self.l_dim);
    content_ls.push(self.s_dim);
    content_ls.push(self.col_days);
    content_ls.push(self.col_s_days);

    content_ls.push(self.col_e_days);
    content_ls.push(self.weight);

    fs.appendFileSync(tab_file, content_ls.join("\t"), encoding='utf8');
}

module.exports.Sample = Sample;
module.exports.sample_abb_dic = sample_abb_dic;