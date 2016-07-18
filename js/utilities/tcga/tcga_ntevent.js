/**
 * Created by hqyone on 7/18/16.
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

var tcga_nte_xml_attr_dic= {
    new_tumor_event_after_initial_treatment:"ntenew_tumor_event_after_initial_treatment",
    days_to_new_tumor_event_after_initial_treatment:"ntedays_to_new_tumor_event_after_initial_treatment",
    new_neoplasm_event_occurrence_anatomic_site:"ntenew_neoplasm_event_occurrence_anatomic_site",
    new_neoplasm_occurrence_anatomic_site_text:"ntenew_neoplasm_occurrence_anatomic_site_text",
    new_neoplasm_event_type:"ntenew_neoplasm_event_type",
    progression_determined_by:"nteprogression_determined_by",
    new_tumor_event_additional_surgery_procedure:"ntenew_tumor_event_additional_surgery_procedure",
    days_to_new_tumor_event_additional_surgery_procedure:"ntedays_to_new_tumor_event_additional_surgery_procedure",
    additional_radiation_therapy:"nteadditional_radiation_therapy",
    additional_pharmaceutical_therapy:"nteadditional_pharmaceutical_therapy",
    followup_barcode:"ntefollowup_barcode",
}

var tcga_nte_feature_ls=[
    "new_tumor_event_after_initial_treatment",
    "days_to_new_tumor_event_after_initial_treatment",
    "new_neoplasm_event_occurrence_anatomic_site",
    "new_neoplasm_occurrence_anatomic_site_text",
    "new_neoplasm_event_type",
    "progression_determined_by",
    "new_tumor_event_additional_surgery_procedure",
    "days_to_new_tumor_event_additional_surgery_procedure",
    "additional_radiation_therapy",
    "additional_pharmaceutical_therapy",
    "followup_barcode",
];

function TCGA_NewTumorEvent(){
    this.features = {
        new_tumor_event_after_initial_treatment:"",
        days_to_new_tumor_event_after_initial_treatment:-1,
        new_neoplasm_event_occurrence_anatomic_site:"",
        new_neoplasm_occurrence_anatomic_site_text:"",
        new_neoplasm_event_type:"",
        progression_determined_by:"",
        new_tumor_event_additional_surgery_procedure:"",
        days_to_new_tumor_event_additional_surgery_procedure:-1,
        additional_radiation_therapy:"",
        additional_pharmaceutical_therapy:"",
        followup_barcode:"",
    }
}

TCGA_NewTumorEvent.prototype.loading = function(xml_obj, attr_ls){
    var self =  this;
    for (var i=0; i<tcga_nte_feature_ls.length; i++){
        var cur_feature = tcga_nte_feature_ls[i];
        var cur_attr_ls = _.clone(attr_ls);
        cur_attr_ls.push(tcga_nte_xml_attr_dic[cur_feature]);
        cur_attr_ls.push("0");
        self.features[cur_feature]= getXMLValue(xml_obj, cur_attr_ls);
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


module.exports.TCGA_NewTumorEvent = TCGA_NewTumorEvent;