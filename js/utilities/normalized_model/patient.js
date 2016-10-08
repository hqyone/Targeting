/**
 * Created by qhe on 7/20/16.
 */

var fs = require('fs');

var patient_abb_dic={
    ts_site:"tissue_source_site",
    id:"patient_id",
    bc:"bcr_patient_barcode",
    uu:"bcr_patient_uuid",
    age:"age_at_initial_pathologic_diagnosis",
    o3s:"icd_o_3_site",
    o3h:"icd_o_3_histology",
    i10:"icd_10",
    b_days:"days_to_birth",
    d_days:"days_to_death",
    l_days:"days_to_last_known_alive",
    dx:"diagnosis",
    dx_days:"days_to_initial_pathologic_diagnosis",
    dx_age:"age_at_initial_pathologic_diagnosis",
    dx_year:"year_of_initial_pathologic_diagnosis",
    g:"gender",
    r:"race",
    stage:"pathologic_stage",
    p_m:"pathologic_m",
    p_n:"pathologic_n",
    p_t:"pathologic_t",
    tt_site:"tumor_tissue_site",
    vital:"vital_statue",
    c_status:"person_neoplasm_cancer_status",
    tumor:"residual_tumor"
};

function Patient(){
    this.ts_site="";
    this.id="";
    this.bc="";
    this.uu="";
    this.age=null;
    this.o3s="";
    this.o3h="";
    this.i10="";
    this.b_days=null;
    this.d_days=null;
    this.l_days=null;
    this.dx="";
    this.dx_days=null;
    this.dx_age=null;
    this.dx_year=null;
    this.g="";
    this.r="";
    this.stage="";
    this.p_m ="";
    this.p_n ="";
    this.p_t = "";
    this.tt_site="";
    this.vital = "";
    this.c_status = "";
    this.tumor = "";
    this.s_days = -100;
    this.e_days = 0;
    this.lineage_id ="";
    this.lineage ="";

    this.samples=[];
    this.malignancys=[];
    this.treatments=[];
    this.followups=[];
    this.radiations=[];
    this.tumor_events=[];
};

Patient.prototype.toTreeJson =function(id){
    var self = this;
    var cid = id;
    var result = {id:cid};
    result.label=self.bc+"[Age:"+self.age+"]";
    result.inode = true;
    result.icon ="patient";
    result.des = "des";
    result.branch=[];
    result = addListToResult(result, self.samples, cid+10, "Sample");
    result = addListToResult(result, self.malignancys, cid+20, "Malignancies");
    result = addListToResult(result, self.treatments, cid+30, "Treatments");
    result = addListToResult(result, self.tumor_events, cid+40, "TumorEvents");
    result = addListToResult(result, self.followups, cid+50, "Followups");
    return result;
};
Patient.prototype.WriteToDBTables =function(outdir, lineage_id){
    var self = this;
    var patient_f = outdir+"/patient.tsv";

    var content_ls = [];
    content_ls.push(self.id);
    content_ls.push(self.bc);
    content_ls.push(self.uu);
    content_ls.push(self.age);
    content_ls.push(self.i10);

    content_ls.push(self.o3s);
    content_ls.push(self.o3h);
    content_ls.push(self.b_days);
    content_ls.push(self.d_days);
    content_ls.push(self.l_days);

    content_ls.push(self.dx);
    content_ls.push(self.dx_days);
    content_ls.push(self.dx_age);
    content_ls.push(self.dx_year);
    content_ls.push(self.g);

    content_ls.push(self.r);
    content_ls.push(self.stage);
    content_ls.push(self.p_m);
    content_ls.push(self.p_n);
    content_ls.push(self.p_t);

    content_ls.push(self.tt_site);
    content_ls.push(self.vital);
    content_ls.push(self.c_status);
    content_ls.push(self.tumor);
    content_ls.push(lineage_id);

    fs.appendFileSync(patient_f, content_ls.join("\t")+"\n", encoding='utf8');
    for (var i =0; i<self.samples.length; i++){
        var cur_sample = self.samples[i];
        cur_sample.WriteToDBTables(outdir)
    }
    for (var i =0; i<self.malignancys.length; i++){
        var cur_obj = self.malignancys[i];
        cur_obj.WriteToDBTables(outdir)
    }
    for (var i =0; i<self.treatments.length; i++){
        var cur_obj = self.treatments[i];
        cur_obj.WriteToDBTables(outdir)
    }
    for (var i =0; i<self.followups.length; i++){
        var cur_obj = self.followups[i];
        cur_obj.WriteToDBTables(outdir)
    }
    for (var i =0; i<self.radiations.length; i++){
        var cur_obj = self.radiations[i];
        cur_obj.WriteToDBTables(outdir)
    }
    for (var i =0; i<self.tumor_events.length; i++){
        var cur_obj = self.tumor_events[i];
        cur_obj.WriteToDBTables(outdir)
    }
}


Patient.prototype.getDaysRange = function(){
    var self =this;
    var s_value_ls = [self.s_days];
    if(self.dx_days!=null){s_value_ls.push(self.dx_days);}
    var e_value_ls = [self.e_days];
    if(self.d_days!=null){e_value_ls.push(self.d_days);}
    if(self.l_days!=null){e_value_ls.push(self.l_days);}
    if(self.malignancys.length>0){
        for (var i=0; i<self.malignancys.length; i++){
            var m = self.malignancys[i];
            if (m.dx_days!=null){s_value_ls.push(m.dx_days);}
        }
        for (var i=0; i<self.treatments.length; i++){
            var t = self.treatments[i];
            if (t.s_days!=null){s_value_ls.push(t.s_days);}
            if (t.e_days!=null){s_value_ls.push(t.e_days);}
        }

        for (var i=0; i<self.followups.length; i++){
            var s = self.samples[i];
            if (s.col_days != null){s_value_ls.push(s.col_days)}
            if (s.col_s_days != null){s_value_ls.push(s.col_s_days)}
            if (s.col_e_days != null){e_value_ls.push(s.col_e_days)}
        }

        for (var i=0; i<self.radiations.length; i++){
            var r=self.radiations[i];
            if (r.s_days != null){s_value_ls.push(r.s_days)}
            if (r.e_days != null){e_value_ls.push(r.e_days)}
        }
    }
    self.s_days = Math.min(s_value_ls);
    self.e_days = Math.max(e_value_ls);
};

var addListToResult=function(result, list, cid, name){
    if (list.length>0){
        var s_ls =[];
        for (var i=0; i<list.length;i++){
            var s = list[i];
            cid+=1;
            s_ls.push(
                s.toTreeJson(cid)
            )
        }
        cid+=1;
        result.branch.push({
            id:cid,
            label:name+" ["+list.length+"]",
            inode:true,
            des:'des',
            branch:s_ls
        })
    }
    return result;
};


module.exports.Patient = Patient;
module.exports.patient_abb_dic = patient_abb_dic;