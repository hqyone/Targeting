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
        for (var i=0;i<patient_ls.length; i++){
            clearObject(i,patient_ls,["NA"]);
        }
        return patient_ls;  //This can be store in memory
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
    return obj[attr]==undefined?null:obj[attr];
}

var tcga_2_normal_patient =function(TCGA_patient){
    var p = new patient.Patient();
    p.bc = getAttribute(TCGA_patient,"bcr_patient_barcode");
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
            p.p_m = getAttribute(TCGA_patient["stage_event"]["tnm_categories"],"pathologic_m");
            p.p_n = getAttribute(TCGA_patient["stage_event"]["tnm_categories"],"pathologic_n");
            p.p_t = getAttribute(TCGA_patient["stage_event"]["tnm_categories"],"pathologic_t");
        }
    }
    p.tt_site = getAttribute(TCGA_patient,"tumor_tissue_site");
    p.vital = getAttribute(TCGA_patient,"vital_statue");
    p.c_status = getAttribute(TCGA_patient,"person_neoplasm_cancer_status");
    p.tumor = getAttribute(TCGA_patient,"residual_tumor");

    if (TCGA_patient.samples!=undefined){
        var sample_dic = TCGA_patient.sample_dic;
        if (sample_dic!=undefined && Object.keys(sample_dic).length>0){
            for (var key in samples){
                var ts =samples[key];
                var s = sample.Sample();
                s.p_bc = p.bc;
                s.bc = getAttribute(ts,"bcr_sample_barcode");
                s.uu = getAttribute(ts,"bcr_sample_uuid");
                s.ffpe = getAttribute(ts, "is_ffpe");
                s.type = getAttribute(ts, "sample_type");
                s.l_dim = getAttribute(ts,"longest_dimension");
                s.s_dim = getAttribute(ts, "shortest_dimension");
                if(ts.diagnostic_slides!=undefined){
                    for(var s_key in ts.diagnostic_slides){
                        var slide_uui = ts.diagnostic_slides[s_key];
                        s.dx_slides.push(slide_uui);
                    }
                }
                p.samples.push(s);
            }
        }
    }
    if(TCGA_patient.omfs!=undefined){
        var omf_dic = TCGA_patient.omfs;
        for (var key in omf_dic){
            var omf = omf_dic[key];
            var m = new malignancy.Malignancy();
            m.p_bc = p.bc;
            var match=key.match(/\d+/);
            m.i=match==null?0:match[0]-1;
            m.bc = getAttribute(omf,"bcr_omf_barcode");
            m.uu = getAttribute(omf,"bcr_omf_barcode");
            m.m_type = getAttribute(omf,"malignancy_type");
            m.stage = getAttribute(omf,"malignancy_type");
            if (m["stage_event"]!=undefined){
                p.stage = getAttribute(TCGA_patient["stage_event"],"pathologic_stage");
                if (TCGA_patient["stage_event"]["tnm_categories"]!=undefined){
                    p.p_m = getAttribute(TCGA_patient["stage_event"]["tnm_categories"],"pathologic_m");
                    p.p_n = getAttribute(TCGA_patient["stage_event"]["tnm_categories"],"pathologic_n");
                    p.p_t = getAttribute(TCGA_patient["stage_event"]["tnm_categories"],"pathologic_t");
                }
            }
        }
    }

    if (TCGA_patient.stage_event!=undefined){

    }
}

var project_path_ls = __dirname.split("/");
project_path_ls.pop()
project_path_ls.pop()
project_path_ls.pop()

var clinic_file =project_path_ls.join("/")+'/data/LUSC.merge_clin_test.txt';

//var clinic_file = "/Users/qhe/Documents/Databases/TCGA/firehose/key_data/lusc/gdac.broadinstitute.org_LUSC.Merge_Clinical.Level_1.2016012800.0.0/LUSC.clin.merged_test.txt";
//var json = JSON.unflatten({"patient.stage_event.tnm_categories.pathologic_categories.pathologic_n":false});
var patient_ls = read_table_file(clinic_file);
console.log("xx");
