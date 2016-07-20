/**
 * Created by quanyuanhe on 7/19/16.
 * The program is designed to read Clinic table file (clin.merged.txt)
 * downloaded from Firehose (http://gdac.broadinstitute.org/).
 */

var fs = require('fs');
var readline = require('readline');
var TCGA_Patient = require("./tcga_patient.js");

/**
 *
 * @param id
 * @returns {*[]}
 * Example:
 * input: patient.follow_ups.follow_up.day_of_form_completion
 * output:follow_up (Obj_name), index (Index)
 */
var get_obj_attr = function(id){
    var id_items = id.split(".");
    var attr_name = id_items.pop();
    var obj_name = id_items.pop();
    var obj_index=0;
    if (obj_name.indexOf("-")<0){
        obj_index = 1;
    }else{
        var temp = obj_name.split("-");
        obj_index = parseInt(temp.pop());
        obj_name = temp.pop();
    }
    return [obj_name, obj_index, attr_name];
}

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
    var contents = line.split("\t").reverse();
    var json_path = contents.pop();
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

        if(i==attr_ls.length-1 && temp!="drugs"){
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
        if (line.indexOf("V1")!=0 ){
            for (var i=0;i<patient_num; i++){
                patient_ls[i] = add_feature(line,patient_ls[i], i);
            }
        }
    }).on('close',function(){
        console.log(JSON.stringify(patient_ls));
    })
}


var clinic_file = "/Users/quanyuanhe/Documents/Projects/MyProject/Targeting/Database/TCGA/BRCA/data/lusc/gdac.broadinstitute.org_LUSC.Merge_Clinical.Level_1.2016012800.0.0/LUSC.merged_only_clinical_clin_format.txt";
//var json = JSON.unflatten({"patient.stage_event.tnm_categories.pathologic_categories.pathologic_n":false});
read_table_file(clinic_file);
