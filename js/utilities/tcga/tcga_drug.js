/**
 * Created by qhe on 7/16/16.
 */
var _ = require("underscore");
var fs = require('fs');
var xml2js = require('xml2js');
var Backbone = require('backbone');
var path = require("path");
var parseString = require('xml2js').parseString;
var parser = new xml2js.Parser();

var tcga_drug_xml_attr_dic={
    tx_on_clinical_trial:"rx:tx_on_clinical_trial",
    regimen_number:"rx:regimen_number",
    bcr_drug_barcode:"rx:bcr_drug_barcode",
    bcr_drug_uuid:"rx:bcr_drug_uuid",
    total_dose:"rx:total_dose",
    total_dose_units:"rx:total_dose_units",
    number_cycles:"rx:number_cycles",
    days_to_drug_therapy_start:"rx:days_to_drug_therapy_start",
    days_to_drug_therapy_end:"rx:days_to_drug_therapy_end",
    therapy_type:"rx:therapy_type",
    therapy_type_notes:"rx:therapy_type_notes",
    clinical_trail_drug_classification:"rx:clinical_trail_drug_classification",
    regimen_indication:"rx:regimen_indication",
    regimen_indication_notes:"rx:regimen_indication_notes",
    route_of_administrations:"rx:route_of_administrations",
    therapy_ongoing:"rx:therapy_ongoing",
    measure_of_response:"rx:measure_of_response",
    day_of_form_completion:"rx:day_of_form_completion",
    month_of_form_completion:"rx:month_of_form_completion",
    year_of_form_completion:"rx:year_of_form_completion",
    case_id:"rx:case_id"
}

var tcga_drug_feature_ls=[
    "tx_on_clinical_trial",
    "regimen_number",
    "bcr_drug_barcode",
    "bcr_drug_uuid",
    "total_dose",
    "total_dose_units",
    "number_cycles",
    "days_to_drug_therapy_start",
    "days_to_drug_therapy_end",
    "therapy_type",
    "therapy_type_notes",
    "clinical_trail_drug_classification",
    "regimen_indication",
    "regimen_indication_notes",
    "route_of_administrations",
    "therapy_ongoing",
    "measure_of_response",
    "day_of_form_completion",
    "month_of_form_completion",
    "year_of_form_completion",
    "case_id"
]

function TCGA_Drug(){
    this.features = {
        tx_on_clinical_trial:"",
        regimen_number:"",
        bcr_drug_barcode:"",
        bcr_drug_uuid:"",
        total_dose:"",
        total_dose_units:-1,
        number_cycles:"",
        days_to_drug_therapy_start:"",
        days_to_drug_therapy_end:"",
        therapy_type:"",
        therapy_type_notes:"",
        clinical_trail_drug_classification:"",
        regimen_indication:"",
        regimen_indication_notes:"",
        route_of_administrations:"",
        therapy_ongoing:"",
        measure_of_response:"",
        day_of_form_completion:null,
        month_of_form_completion:null,
        year_of_form_completion:null,
        case_id:""
    }
}

TCGA_Drug.prototype.loading = function(xml_obj, attr_ls){
    var self =  this;
    for (var i=0; i<tcga_drug_feature_ls.length; i++){
        var cur_feature = tcga_drug_feature_ls[i];
        var cur_attr_ls = _.clone(attr_ls);
        cur_attr_ls.push(tcga_drug_xml_attr_dic[cur_feature]);
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


module.exports.TCGA_Drug = TCGA_Drug;
