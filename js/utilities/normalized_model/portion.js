/**
 * Created by quanyuanhe on 7/20/16.
 */
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

module.exports.Portion = Portion;
module.exports.portion_abb_dic = portion_abb_dic;