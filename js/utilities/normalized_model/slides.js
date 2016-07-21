/**
 * Created by quanyuanhe on 7/21/16.
 */
var slide_abb_dic={
    po_bc:"portion_barcode",
    bc:"bcr_slide_barcode",
    uu:"bcr_slide_uuid",
    ffpe:"is_derived_from_ffpe",
    p_necrosis:"percent_necrosis",
    p_normal_c:"percent_normal_cells",
    p_tumor_c:"percent_tumor_cells",
    p_stromal_c:"percent_stromal_cells",
    p_tumor_n:"percent_tumor_nuclei"
};

function Slide(){
    this.po_bc="";
    this.bc="";
    this.uu="";
    this.ffpe="";
    this.p_necrosis=null;
    this.p_normal_c=null;
    this.p_tumor_c=null;
    this.p_tumor_n=null;
}

module.exports.Slide = Slide;
module.exports.slide_abb_dic = slide_abb_dic;