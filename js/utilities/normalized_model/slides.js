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

Slide.prototype.WriteToDBTables =function(outdir){
    var self =  this;
    var tab_file = outdir+"/slide.tsv";
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

    fs.appendFileSync(tab_file, content_ls.join("\t"), encoding='utf8');
};

module.exports.Slide = Slide;
module.exports.slide_abb_dic = slide_abb_dic;