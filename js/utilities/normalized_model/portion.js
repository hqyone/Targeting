/**
 * Created by quanyuanhe on 7/20/16.
 */
var fs = require('fs');

var portion_abb_dic={
    s_bc:"sample_barcode",
    bc:"bcr_portion_barcode",
    uu:"bcr_protein_uuid",
    c_days:"create_days",
    ship_bc:"shipment_portion_bcr_aliquot_barcode",
    ship_day:"shipment_portion_day",
    ffpe:"is_ffpe",
    weight:"weight"
}

function Portion(){
    this.s_id="";
    this.bc="";
    this.uu="";
    this.c_days=null;
    this.ship_bc="";
    this.ffpe="";
    this.weight=null;
}

Portion.prototype.toTreeJson=function(id){
    var self = this;
    return {
        id:id,
        label:self.bc,
        inode:false,
        des:self.uu
    }
}

Portion.prototype.WriteToDBTables =function(outdir){
    var self =  this;
    var tab_file = outdir+"/portion.tsv";
    var content_ls = [];
    content_ls.push('NULL');
    content_ls.push(self.s_bc);
    content_ls.push(self.bc);
    content_ls.push(self.uu);
    content_ls.push(self.c_days);

    content_ls.push(self.ship_bc);
    content_ls.push(self.ffpe);
    content_ls.push(self.weight);

    fs.appendFileSync(tab_file, content_ls.join("\t")+"\n", encoding='utf8');
}

module.exports.Portion = Portion;
module.exports.portion_abb_dic = portion_abb_dic;