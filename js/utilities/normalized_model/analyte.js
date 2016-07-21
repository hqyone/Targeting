/**
 * Created by quanyuanhe on 7/20/16.
 */
var analyte_abb_dic={
    po_bc:"portion_barcode",
    type:"analyte_type",
    bc:"bcr_analyte_barcode",
    uu:"bcr_analyte_uuid"
}

function Analyte(){
    this.po_id="";
    this.type="";
    this.bc="";
    this.uu="";
}


module.exports.Analyte = Analyte;
module.exports.analyte_abb_dic = analyte_abb_dic;