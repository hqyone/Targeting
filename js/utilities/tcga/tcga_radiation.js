/**
 * Created by hqyone on 7/17/16.
 */
var _ = require("underscore");
var fs = require('fs');
var xml2js = require('xml2js');
var Backbone = require('backbone');
var path = require("path");
var parseString = require('xml2js').parseString;
var parser = new xml2js.Parser();

var tcga_radiation_xml_attr_dic= {
    bcr_radiation_barcode:"rad:bcr_radiation_barcode",
    bcr_radiation_uuid:"rad:bcr_radiation_uuid",
    days_to_radiation_therapy_start:"rad:days_to_radiation_therapy_start",
    days_to_radiation_therapy_end:"rad:days_to_radiation_therapy_end",
    radiation_type:"rad:radiation_type",
    radiation_type_notes:"rad:radiation_type_notes",
    radiation_dosage:"rad:radiation_dosage",
    units:"rad:units",
    numfractions:"rad:numfractions",
    radiation_treatment_ongoing:"rad:radiation_treatment_ongoing",
    course_number:"rad:course_number",
    measure_of_response:"clin_shared:measure_of_response",
    day_of_form_completion:"clin_shared:day_of_form_completion",
    month_of_form_completion:"clin_shared:month_of_form_completion",
    year_of_form_completion:"clin_shared:year_of_form_completion"
}

var tcga_radiation_feature_ls=[
    "bcr_radiation_barcode",
    "bcr_radiation_uuid",
    "days_to_radiation_therapy_start",
    "days_to_radiation_therapy_end",
    "radiation_type",
    "radiation_type_notes",
    "radiation_dosage",
    "units",
    "numfractions",
    "radiation_treatment_ongoing",
    "course_number",
    "measure_of_response",
    "day_of_form_completion",
    "month_of_form_completion",
    "year_of_form_completion",
];

function TCGA_Radiation(){
    this.features = {
        bcr_radiation_barcode:-1,
        bcr_radiation_uuid:"",
        days_to_radiation_therapy_start:"",
        days_to_radiation_therapy_end:"",
        radiation_type:"",
        radiation_type_notes:"",
        radiation_dosage:-1,
        units:"",
        numfractions:-1,
        radiation_treatment_ongoing:"",
        course_number:"",
        measure_of_response:"",
        day_of_form_completion:-1,
        month_of_form_completion:-1,
        year_of_form_completion:-1
    }
}

TCGA_Radiation.prototype.loading = function(xml_obj, attr_ls){
    var self =  this;
    for (var i=0; i<tcga_radiation_feature_ls.length; i++){
        var cur_feature = tcga_radiation_feature_ls[i];
        var cur_attr_ls = _.clone(attr_ls);
        cur_attr_ls.push(tcga_radiation_xml_attr_dic[cur_feature]);
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


module.exports.TCGA_Radiation = TCGA_Radiation;