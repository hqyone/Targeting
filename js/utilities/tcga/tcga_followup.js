/**
 * Created by hqyone on 7/17/16.
 */
/**
 * Created by hqyone on 7/17/16.
 */
var _ = require("underscore");
require("underscore.deep");
var fs = require('fs');
var xml2js = require('xml2js');
var Backbone = require('backbone');
var path = require("path");
var parseString = require('xml2js').parseString;
var parser = new xml2js.Parser();
var NewTumorEvent = require("./tcga_ntevent.js");

var tcga_followup_xml_attr_dic= {
    bcr_followup_barcode:"clin_shared:bcr_followup_barcode",
    bcr_followup_uuid:"clin_shared:bcr_followup_uuid",
    lost_follow_up:"clin_shared:lost_follow_up",
    vital_status:"clin_shared:vital_status",
    days_to_last_followup:"clin_shared:days_to_last_followup",
    days_to_death:"clin_shared:days_to_death",
    person_neoplasm_cancer_status:"clin_shared:person_neoplasm_cancer_status",
    radiation_therapy:"clin_shared:radiation_therapy",
    targeted_molecular_therapy:"clin_shared:targeted_molecular_therapy",
    day_of_form_completion:"clin_shared:day_of_form_completion",
    month_of_form_completion:"clin_shared:month_of_form_completion",
    year_of_form_completion:"clin_shared:year_of_form_completion",
    followup_case_report_form_submission_reason:"clin_shared:followup_case_report_form_submission_reason",
    followup_treatment_success:"clin_shared:followup_treatment_success",
    karnofsky_performance_score:"clin_shared:karnofsky_performance_score",
    primary_therapy_outcome_success:"clin_shared:primary_therapy_outcome_success",
    new_tumor_events:"new_tumor_events"
};

var tcga_followup_feature_ls=[
    "bcr_followup_barcode",
    "bcr_followup_uuid",
    "lost_follow_up",
    "vital_status",
    "days_to_last_followup",
    "days_to_death",
    "person_neoplasm_cancer_status",
    "radiation_therapy",
    "targeted_molecular_therapy",
    "day_of_form_completion",
    "month_of_form_completion",
    "year_of_form_completion",
    "followup_case_report_form_submission_reason",
    "followup_treatment_success",
    "karnofsky_performance_score",
    "primary_therapy_outcome_success",
    "new_tumor_events",
];

function TCGA_Followup(){
    this.features = {
        bcr_followup_barcode:"",
        bcr_followup_uuid:"",
        lost_follow_up:"",
        vital_status:"",
        days_to_last_followup:-1,
        days_to_death:-1,
        person_neoplasm_cancer_status:"",
        radiation_therapy:"",
        targeted_molecular_therapy:"",
        day_of_form_completion:-1,
        month_of_form_completion:-1,
        year_of_form_completion:-1,
        followup_case_report_form_submission_reason:"",
        followup_treatment_success:"",
        karnofsky_performance_score:"",
        primary_therapy_outcome_success:""
    };
    this.new_tumor_events = [] ;
}

TCGA_Followup.prototype.loading = function(xml_obj, attr_ls){
    var self =  this;
    for (var i=0; i<tcga_followup_feature_ls.length; i++){
        var cur_feature = tcga_followup_feature_ls[i];
        //var cur_attr_ls = _.clone(attr_ls);
        //cur_attr_ls.push(tcga_followup_xml_attr_dic[cur_feature]);
        //cur_attr_ls.push("0");
        //self.features[cur_feature]= getXMLValue(xml_obj, cur_attr_ls);
        if (cur_feature=="new_tumor_events"){
            if (getFirstAttrValue(xml_obj,"nte:")!=undefined){
                var tne =new NewTumorEvent.TCGA_NewTumorEvent();
                tne.loading(xml_obj);
            }
            if (getFirstAttrValue(xml_obj,"nte:new_tumor_events")!=undefined){
                var events_obj = xml_obj
            }
        }
        self.features[cur_feature]=getFirstAttrValue(xml_obj, cur_feature);
    }
}

var getXMLValue = function(xml_obj, attr_ls){
    var temp = xml_obj;
    for (var i=0; i<attr_ls.length; i++){
        var attr = attr_ls[i];
        if (temp[attr]!=undefined){
            temp = temp[attr];
            if (i==attr_ls.length-1){
                return temp._==undefined?"":temp._;
            }
        }
    }
    return "";
}

var getFirstAttrValue = function(xml_obj, target_attr){
    var flat_obj = _.deepToFlat(xml_obj);
    var items = _.filter(_.keys(flat_obj), function(key){
        return key.indexOf(target_attr)>=0;
    });
    if(items.length>0){
        return items[0]._==undefined?"":items[0]._;
    }else{
        return undefined;
    }
}


module.exports.TCGA_Radiation = TCGA_Radiation;