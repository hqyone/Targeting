/**
 * Created by quanyuanhe on 7/19/16.
 * The program is designed to read Clinic table file (clin.merged.txt)
 * downloaded from Firehose (http://gdac.broadinstitute.org/).
 */

var fs = require('fs');
var path = require('path');
var readline = require('readline');
var patient = require("../normalized_model/patient.js");
var malignancy = require("../normalized_model/malignancy.js");
var analyte = require("../normalized_model/analyte.js");
var followup = require("../normalized_model/followup.js");
var sample = require("../normalized_model/sample.js");
var slides = require("../normalized_model/slides.js");
var treatment = require("../normalized_model/treatment.js");
var tumor_events = require("../normalized_model/tumor_events.js");
var radiation = require("../normalized_model/radiation.js");


var get_obj_type= function(id){
    if (id.indexOf("drug")>=0){
        return "drug";
    }else if (id.indexOf("follow_up")>=0){
        return "follow_up";
    }else if (id.indexOf("radiation")>=0){
        return "radiation";
    }else if (id.indexOf("stage_event")>=0){
        return "stage_event";
    }
}


var add_feature = function(line, obj, index)
{
    if (obj==undefined){obj={};}
    var contents = line.split("\t");
    var json_path = contents.shift();
    var data = contents[index];

    var path = json_path.split(".");
    return build_obj(obj,path,data);
}

var build_obj=function(result,attr_ls, data){
    var cur, temp, prop;
    if (result == undefined){
        result = {};
    }
    cur = result;
    for (var i=0; i<attr_ls.length; i++){
        temp = attr_ls[i];

        if(i==attr_ls.length-1 && temp!="drugs" && temp!="radiations" && temp!='follow_ups'){
            cur[temp] = data;
        }else{
            if (typeof cur != 'object') {
                var value = cur;
                cur={};
                cur.value=value;
            }
            if(cur[temp]==undefined){
                cur[temp] = {};
            }
            cur=cur[temp];
        }
    }
    return result;
}

/**JSON.unflatten = function(data) {
    "use strict";
    if (Object(data) !== data || Array.isArray(data))
        return data;
    var result = {}, cur, prop, idx, last, temp;
    for(var p in data) {
        cur = result, prop = "", last = 0;
        do {
            idx = p.indexOf(".", last);
            temp = p.substring(last, idx !== -1 ? idx : undefined);
            cur = cur[prop] || (cur[prop] = (!isNaN(parseInt(temp)) ? [] : {}));
            prop = temp;
            last = idx + 1;
        } while(idx >= 0);
        cur[prop] = data[p];
    }
    return result[""];
}
JSON.flatten = function(data) {
    var result = {};
    function recurse (cur, prop) {
        if (Object(cur) !== cur) {
            result[prop] = cur;
        } else if (Array.isArray(cur)) {
            for(var i=0, l=cur.length; i<l; i++)
                recurse(cur[i], prop ? prop+"."+i : ""+i);
            if (l == 0)
                result[prop] = [];
        } else {
            var isEmpty = true;
            for (var p in cur) {
                isEmpty = false;
                recurse(cur[p], prop ? prop+"."+p : p);
            }
            if (isEmpty)
                result[prop] = {};
        }
    }
    recurse(data, "");
    return result;
}**/


var read_table_file = function(filepath){
    var rd = readline.createInterface({
        input: fs.createReadStream(filepath),
        output: process.stdout,
        terminal: false
    })
    //var patient = new TCGA_Patient.TCGA_Patient();
    //var drugs={};
    //var followups={};
    var patient_num = 0;
    var patient_ls =[];

    rd.on('line', function(line) {
        if (patient_num == 0){
            patient_num = line.split("\t").length-1;
            for (var i=0; i<patient_num; i++){
                patient_ls[i]={};
            }
        }
        console.log(line);
        if (line.indexOf("V1")!=0 ){
            for (var i=0;i<patient_num; i++){
                if (line.indexOf(".drug-2.therapy")>=0 && i==5){
                    console.log(".drug-2.therap");
                }
                patient_ls[i] = add_feature(line,patient_ls[i], i);
            }
        }
    }).on('close',function(){
        var n_patient_ls = [];
        for (var i=0;i<patient_ls.length; i++){
            clearObject(i,patient_ls,["NA"]);
            n_patient_ls.push(tcga_2_normal_patient(patient_ls[i].patient));
        }
        patient_ls_2_json(n_patient_ls,patient_json_file);
        return n_patient_ls;  //This can be store in memory
    })
}

//Delete objects without any information
var clearObject =function(key, obj, null_values){
    var path = [];
    var value = obj[key];
    if (key == "drugs"){
        console.log(obj[key])
    }
    if (value!=undefined && value!=null && typeof(value) === "object"){
        var keys = Object.keys(value);
        for (var i=0; i<keys.length; i++){
            clearObject(keys[i], value,null_values);
        }
        if (Object.keys(value).length==0){
            delete obj[key];
        }
    }else if(typeof(value)==="array"){
        for (var i=0; i<value.length; i++){
            clearObject(i, value,null_values);
        }
    }else{
        if(null_values.indexOf(value)>=0)
        {
            delete obj[key];
        }
    }
}

var getAttribute = function(obj, attr){
    if (obj==undefined){
        return null;
    }
    var temp = obj[attr];
    if(temp==undefined){
        return null;
    }else if(typeof(temp)==="object"){
        var result = "";
        for (var key in temp){
            var value =  temp[key];
            if (typeof(value)==="string"){
                result += key+":"+value+";"
            }else {
                result += key+":"+typeof(value)+";"
            }
        }
        return result;
    }else if (typeof(temp)==="array"){
        var result = "";
        for (var i=0; i<temp.length; i++){
            result+= temp[i]+";"
        }
        return result;
    }else{
        return temp;
    }
}

var patient_ls_2_json = function(patient_ls, filename){
    var id =0;
    var root_obj = {id:0,
        label:"Patient ["+patient_ls.length+"]",
        inode:true,des:"des",open:true, branch:[]}
    for (var i =0; i<patient_ls.length; i++){
        root_obj.branch.push(patient_ls[i].toTreeJson(i));
    }
    var result =[root_obj];

    fs.writeFile(filename, JSON.stringify(result), function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    });

}

var tcga_2_normal_patient =function(TCGA_patient){
    var p = new patient.Patient();
    p.bc = getAttribute(TCGA_patient,"bcr_patient_barcode");
    p.id = getAttribute(TCGA_patient,"patient_id");
    p.uu = getAttribute(TCGA_patient,"bcr_patient_uuid");
    p.age = getAttribute(TCGA_patient,"age_at_initial_pathologic_diagnosis");
    p.o3s = getAttribute(TCGA_patient,"icd_o_3_site");
    p.i10 = getAttribute(TCGA_patient,"icd_10");
    p.o3h = getAttribute(TCGA_patient,"icd_o_3_histology");
    p.b_days = getAttribute(TCGA_patient,"days_to_birth");
    p.d_days = getAttribute(TCGA_patient,"days_to_death");
    p.l_days = getAttribute(TCGA_patient,"days_to_last_known_alive");
    p.dx = getAttribute(TCGA_patient,"diagnosis");
    p.dx_days = getAttribute(TCGA_patient,"days_to_initial_pathologic_diagnosis");
    p.dx_age = getAttribute(TCGA_patient,"age_at_initial_pathologic_diagnosis");
    p.dx_year = getAttribute(TCGA_patient,"year_of_initial_pathologic_diagnosis");
    p.g = getAttribute(TCGA_patient,"gender");
    p.r = getAttribute(TCGA_patient["race_list"],"race");
    if (TCGA_patient["stage_event"]!=undefined){
        p.stage = getAttribute(TCGA_patient["stage_event"],"pathologic_stage");
        if (TCGA_patient["stage_event"]["tnm_categories"]!=undefined){
            p.p_m = getAttribute(TCGA_patient["stage_event"]["tnm_categories"]["pathologic_categories"],"pathologic_m");
            p.p_n = getAttribute(TCGA_patient["stage_event"]["tnm_categories"]["pathologic_categories"],"pathologic_n");
            p.p_t = getAttribute(TCGA_patient["stage_event"]["tnm_categories"]["pathologic_categories"],"pathologic_t");
        }
    }
    p.tt_site = getAttribute(TCGA_patient,"tumor_tissue_site");
    p.ts_site = getAttribute(TCGA_patient,"tissue_source_site");
    p.vital = getAttribute(TCGA_patient,"vital_status");
    p.c_status = getAttribute(TCGA_patient,"person_neoplasm_cancer_status");
    p.tumor = getAttribute(TCGA_patient,"residual_tumor");

    if (TCGA_patient.samples!=undefined){
        var sample_dic = TCGA_patient.samples;
        if (sample_dic!=undefined && Object.keys(sample_dic).length>0){
            for (var key in sample_dic){
                var ts =sample_dic[key];
                var s = new sample.Sample();
                s.p_bc = p.bc;
                s.bc = getAttribute(ts,"bcr_sample_barcode");
                s.uu = getAttribute(ts,"bcr_sample_uuid");
                s.ffpe = getAttribute(ts, "is_ffpe");
                s.type = getAttribute(ts, "sample_type");
                s.l_dim = getAttribute(ts,"longest_dimension");
                s.s_dim = getAttribute(ts, "shortest_dimension");
                s.col_days = getAttribute(ts,"days_to_collection");
                s.weight = getAttribute(ts,"initial_weight");
                if(ts.diagnostic_slides!=undefined){
                    for(var s_key in ts.diagnostic_slides){
                        var slide_uui = ts.diagnostic_slides[s_key];
                        s.dx_slides.push(slide_uui);
                    }
                }
                if (s.col_days == null){s.col_days =0;}
                p.samples.push(s);
            }
        }
    }

    if (TCGA_patient.follow_ups!=undefined){
        for (var key in TCGA_patient.follow_ups){
            var cur_followup = TCGA_patient.follow_ups[key];
            var f = new followup.FollowUp();

            var match=key.match(/\d+/);
            f.i=match==null?0:match[0]-1;

            f.p_bc = p.bc;
            f.bc = getAttribute(cur_followup,"bcr_followup_barcode");
            f.uu = getAttribute(cur_followup,"bcr_followup_uuid");
            f.su = getAttribute(cur_followup,"followup_treatment_success");
            f.l_days = getAttribute(cur_followup,"days_to_last_followup");
            f.n_days = getAttribute(cur_followup,"days_to_new_tumor_event_after_initial_treatment");
            f.d_days = getAttribute(cur_followup,"days_to_death");
            if (p.d_days ==null && f.d_days!=null){p.d_days = f.d_days;}
            if (f.l_days==null && f.d_days!=null){f.l_days = f.d_days;}
            f.re = getAttribute(cur_followup, "followup_case_report_form_submission_reason");
            f.status = getAttribute(cur_followup,"person_neoplasm_cancer_status");
            f.l_surgery = getAttribute(cur_followup,"locoregional_procedure");
            f.m_surgery = getAttribute(cur_followup,"metastatic_procedure");
            f.rad = getAttribute(cur_followup,"radiation_therapy");
            f.drug_tx = getAttribute(cur_followup,"targeted_molecular_therapy");

            p.followups.push(f);
        }
    }

    if (TCGA_patient.drugs!=undefined) {
        for (var key in TCGA_patient.drugs) {
            var cur_drug = TCGA_patient.drugs[key];
            var t = new treatment.Treatment();

            var match=key.match(/\d+/);
            t.i=match==null?0:match[0]-1;
            t.p_bc = p.bc;
            t.dc = getAttribute(cur_drug,"bcr_drug_barcode");
            t.uu = getAttribute(cur_drug,"bcr_drug_uuid");
            t.e_days = getAttribute(cur_drug,"days_to_drug_therapy_end");
            t.s_days = getAttribute(cur_drug,"days_to_drug_therapy_start");
            t.name = getAttribute(cur_drug,"drug_name");
            t.ongoing = getAttribute(cur_drug,"therapy_ongoing");
            t.type = getAttribute(cur_drug,"therapy_types");
            t.dose = getAttribute(cur_drug,"total_dose");
            t.unit = getAttribute(cur_drug,"total_dose_units");
            t.tx_trial = getAttribute(cur_drug,"tx_on_clinical_trial");
            t.response = getAttribute(cur_drug,"measure_of_response");

            p.treatments.push(t);
        }
    }

    if (TCGA_patient.radiations !=undefined){
        for (var key in TCGA_patient.radiations){
            var cur_rad = TCGA_patient.radiations[key];
            var r = new radiation.Radiation();

            var match=key.match(/\d+/);
            r.i=match==null?0:match[0]-1;

            r.p_bc = p.bc;
            r.site = getAttribute(cur_rad,"anatomic_treatment_site");
            r.bc = getAttribute(cur_rad,"bcr_radiation_barcode");
            r.uu = getAttribute(cur_rad,"bcr_radiation_uuid");
            r.cn = getAttribute(cur_rad,"course_number");
            r.s_days = getAttribute(cur_rad,"days_to_radiation_therapy_start");
            r.e_days = getAttribute(cur_rad,"days_to_radiation_therapy_end");
            r.frac = getAttribute(cur_rad,"numfractions");
            r.dosage = getAttribute(cur_rad, "radiation_dosage");
            r.units = getAttribute(cur_rad, "units" );
            r.ongoing = getAttribute(cur_rad, "radiation_treatment_ongoing" );
            r.type = getAttribute(cur_rad, "radiation_type" );
            r.reg = getAttribute(cur_rad, "regimen_indication" );

            p.radiations.push(r);
        }
    }

    if (TCGA_patient.omfs !=undefined){
        for (var key in TCGA_patient.omfs){
            var cur_m = TCGA_patient.omfs[key];
            var m = new malignancy.Malignancy();

            var match=key.match(/\d+/);
            m.i=match==null?0:match[0]-1;

            m.p_bc = p.bc;
            m.bc = getAttribute(cur_m,"bcr_omf_barcode");
            m.uu = getAttribute(cur_m,"bcr_omf_uuid");
            m.m_type = getAttribute(cur_m,"malignancy_type");
            if (cur_m["omf_staging"]!=undefined){
                m.c_stage = getAttribute(cur_m["omf_staging"],"clinical_stage");
                m.p_stage = getAttribute(cur_m["omf_staging"],"pathologic_stage");
                m.p_m = getAttribute(cur_m["omf_staging"]["pathologic_categories"],"pathologic_m");
                m.p_n = getAttribute(cur_m["omf_staging"]["pathologic_categories"],"pathologic_n");
                m.p_t = getAttribute(cur_m["omf_staging"]["pathologic_categories"],"pathologic_t");
            }
            m.site = getAttribute(cur_m,"other_malignancy_anatomic_site");
            m.site_tx = getAttribute(cur_m, "other_malignancy_anatomic_site_text");
            m.h_type =  getAttribute(cur_m, "other_malignancy_histological_type");
            m.h_type_tx = getAttribute(cur_m, "other_malignancy_histological_type_text");
            if(cur_m["radiation_tx"]!=undefined){
                m.rad = getAttribute(cur_m["radiation_tx"], "radiation_tx_indicator");
            }
            if (cur_m["drug_tx"]!=undefined){
                var drug_ls = [];
                for (var mkey in cur_m["drug_tx"]){
                    if (mkey.startsWith("administered_drug")){
                        var t = new treatment.Treatment();
                        var m_match = mkey.match(/\d+/);
                        t.i = m_match==null?0:m_match[0]-1;
                        t.name = cur_m.drug_tx[mkey]["drug_name"];
                        if (cur_m.drug_tx.days_to_drug_therapy_start!=undefined){
                            t.s_days = parseInt(cur_m.drug_tx.days_to_drug_therapy_start);
                            //t.e_days = parseInt(cur_m.drug_tx.days_to_drug_therapy_start);
                        }
                        if (cur_m.drug_tx.days_to_drug_therapy_end!=undefined){
                            t.e_days = parseInt(cur_m.drug_tx.days_to_drug_therapy_end);
                        }
                        drug_ls.push(t);
                    }
                }
                m.drugs = drug_ls;
            }
            if (cur_m["surgery"]!=undefined){
                m.surgery = getAttribute(cur_m["surgery"],"surgery_indicator")
            }
            m.dx_days = parseInt(getAttribute(cur_m, "days_to_other_malignancy_dx"));
            p.malignancys.push(m);
        }
    }
    return p;
}

var project_path_ls = __dirname.split("/");
project_path_ls.pop();
project_path_ls.pop();
project_path_ls.pop();

//var clinic_file =project_path_ls.join("/")+'/data/BRCA.clin.merged_test.txt';
var clinic_file =project_path_ls.join("/")+'/data/LUSC.merge_clin_test.txt';
var patient_json_file = project_path_ls.join("/")+'/public/data/patient.json';

//var clinic_file = "/Users/qhe/Documents/Databases/TCGA/firehose/key_data/lusc/gdac.broadinstitute.org_LUSC.Merge_Clinical.Level_1.2016012800.0.0/LUSC.clin.merged_test.txt";
//var json = JSON.unflatten({"patient.stage_event.tnm_categories.pathologic_categories.pathologic_n":false});
var patient_ls = read_table_file(clinic_file);
console.log("xx");
