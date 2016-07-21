/**
 * Created by qhe on 7/14/16.
 */
var _ = require("underscore");
var fs = require('fs');
var xml2js = require('xml2js');
var Backbone = require('backbone');
var path = require("path");
var parseString = require('xml2js').parseString;
var parser = new xml2js.Parser();
var Drug =  require("./tcga_drug.js");
var Radiation = require("./tcga_radiation.js")

var tcga_patient_xml_attr_dic={
    patient_id:"shared:patient_id",
    tissue_source_site:"shared:tissue_source_site",
    bcr_patient_barcode:"shared:bcr_patient_barcode",
    bcr_patient_uuid:"shared:bcr_patient_uuid",
    informed_consent_verified:"clin_shared:informed_consent_verified",
    icd_o_3_site:"clin_shared:icd_o_3_site",
    icd_o_3_histology:"clin_shared:icd_o_3_histology",
    icd_10:"clin_shared:icd_10",
    tissue_prospective_collection_indicator:"clin_shared:tissue_prospective_collection_indicator",
    tissue_retrospective_collection_indicator:"clin_shared:tissue_retrospective_collection_indicator",
    days_to_birth:"clin_shared:days_to_birth",
    days_to_last_known_alive:"clin_shared:days_to_last_known_alive",
    gender:"shared:gender",
    menopause_status:"clin_shared:menopause_status",
    birth_control_pill_history_usage_category:"clin_shared:birth_control_pill_history_usage_category",
    days_to_death:"clin_shared:days_to_death",
    days_to_last_followup:"clin_shared:days_to_last_followup",
    histological_type:"clin_shared:histological_type",
    residual_tumor:"clin_shared:residual_tumor",
    ethnicity:"clin_shared:ethnicity",
    days_to_initial_pathologic_diagnosis:"clin_shared:days_to_initial_pathologic_diagnosis",
    age_at_initial_pathologic_diagnosis:"clin_shared:age_at_initial_pathologic_diagnosis",
    year_of_initial_pathologic_diagnosis:"clin_shared:year_of_initial_pathologic_diagnosis",
    person_neoplasm_cancer_status:"clin_shared:person_neoplasm_cancer_status",
    day_of_form_completion:"clin_shared:day_of_form_completion",
    month_of_form_completion:"clin_shared:month_of_form_completion",
    year_of_form_completion:"clin_shared:year_of_form_completion",
    anatomic_neoplasm_subdivision:"clin_shared:anatomic_neoplasm_subdivision",
    laterality:"clin_shared:laterality",
    primary_lymph_node_presentation_assessment:"clin_shared:primary_lymph_node_presentation_assessment",
    lymph_node_examined_count:"clin_shared:lymph_node_examined_count",
    number_of_lymphnodes_positive_by_he:"clin_shared:number_of_lymphnodes_positive_by_he",
    number_of_lymphnodes_positive_by_ihc:"clin_shared:number_of_lymphnodes_positive_by_ihc",
    lymphovascular_invasion_present:"clin_shared:lymphovascular_invasion_present",
    perineural_invasion_present:"clin_shared:perineural_invasion_present",
    neoplasm_histologic_grade:"clin_shared:neoplasm_histologic_grade",
    year_of_tobacco_smoking_onset:"clin_shared:year_of_tobacco_smoking_onset",
    stopped_smoking_year:"clin_shared:stopped_smoking_year",
    number_pack_years_smoked:"clin_shared:number_pack_years_smoked",
    alcohol_history_documented:"clin_shared:alcohol_history_documented",
    frequency_of_alcohol_consumption:"clin_shared:frequency_of_alcohol_consumption",
    amount_of_alcohol_consumption_per_day:"clin_shared:amount_of_alcohol_consumption_per_day",
    radiation_therapy:"clin_shared:radiation_therapy",
    postoperative_rx_tx:"clin_shared:postoperative_rx_tx",
    primary_therapy_outcome_success:"clin_shared:primary_therapy_outcome_success",
    other_dx:"shared:other_dx",
    clinical_stage:"shared_stage:clinical_stage",
    clinical_T:"shared_stage:clinical_T",
    clinical_N:"shared_stage:clinical_N",
    clinical_M:"shared_stage:clinical_M",
    pathologic_T:"shared_stage:pathologic_T",
    pathologic_N:"shared_stage:pathologic_N",
    pathologic_M:"shared_stage:pathologic_M",
    psa_value:"shared_stage:psa_value",
    days_to_psa:"shared_stage:days_to_psa",
    gleason_score:"shared_stage:gleason_score",
    primary_pattern:"shared_stage:primary_pattern",
    secondary_pattern:"shared_stage:secondary_pattern",
    tertiary_pattern:"shared_stage:tertiary_pattern",
    drugs:"rx:drugs",
    radiations:"rad:radiations",
};

var tcga_patient_feature_ls=[
    "patient_id",
    "tissue_source_site",
    "bcr_patient_barcode",
    "bcr_patient_uuid",
    "informed_consent_verified",
    "icd_o_3_site",
    "icd_o_3_histology",
    "icd_10",
    "tissue_prospective_collection_indicator",
    "tissue_retrospective_collection_indicator",
    "days_to_birth",
    "days_to_last_known_alive",
    "gender",
    "menopause_status",
    "birth_control_pill_history_usage_category",
    "days_to_death",
    "days_to_last_followup",
    "histological_type",
    "bcr_patient_barcode",
    "residual_tumor",
    "ethnicity",
    "days_to_initial_pathologic_diagnosis",
    "age_at_initial_pathologic_diagnosis",
    "year_of_initial_pathologic_diagnosis",
    "person_neoplasm_cancer_status",
    "day_of_form_completion",
    "month_of_form_completion",
    "year_of_form_completion",
    "anatomic_neoplasm_subdivision",
    "laterality",
    "primary_lymph_node_presentation_assessment",
    "lymph_node_examined_count",
    "number_of_lymphnodes_positive_by_he",
    "number_of_lymphnodes_positive_by_ihc",
    "lymphovascular_invasion_present",
    "perineural_invasion_present",
    "neoplasm_histologic_grade",
    "year_of_tobacco_smoking_onset",
    "stopped_smoking_year",
    "number_pack_years_smoked",
    "alcohol_history_documented",
    "frequency_of_alcohol_consumption",
    "amount_of_alcohol_consumption_per_day",
    "radiation_therapy",
    "postoperative_rx_tx",
    "primary_therapy_outcome_success",
    "other_dx",
    "clinical_stage",
    "clinical_T",
    "clinical_N",
    "clinical_M",
    "pathologic_T",
    "pathologic_N",
    "pathologic_M",
    "psa_value",
    "days_to_psa",
    "gleason_score",
    "primary_pattern",
    "secondary_pattern",
    "tertiary_pattern",
    "vital_status",
    "drugs",
    "radiations"
];

var getPatientPath=function(xml_obj, keyword){
    var root_label = Object.keys(xml_obj)[0];
    var keys  = _.keys(xml_obj[root_label]);
    var patent_label = _.find(keys, function(key){return key.indexOf(keyword)>=0});
    return [root_label,patent_label,0];
}

var getXMLValue = function(xml_obj, attr_ls){
    var temp = xml_obj
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

var getXMLObj = function(xml_obj, attr_ls){
    var temp = xml_obj
    for (var i=0; i<attr_ls.length; i++){
        var attr = attr_ls[i];
        if (temp[attr]!=undefined){
            temp = temp[attr];
            if (i==attr_ls.length-1){
                return temp;
            }
        }
    }
    return "";
}

function TCGA_Patient(){
    this.features={
        patient_id:"",
        tissue_source_site:"",
        bcr_patient_barcode:"",
        bcr_patient_uuid:"",
        informed_consent_verified:"",
        icd_o_3_site:"",
        icd_o_3_histology:"",
        icd_10:"",
        tissue_prospective_collection_indicator:"",
        tissue_retrospective_collection_indicator:"",
        days_to_birth:-1,
        days_to_last_known_alive:-1,
        gender:"",
        menopause_status:"",
        birth_control_pill_history_usage_category:"",
        days_to_death:-1,
        days_to_last_followup:-1,
        histological_type:"",
        bcr_patient_barcode:"",
        residual_tumor:"",
        ethnicity:"",
        days_to_initial_pathologic_diagnosis:-1,
        age_at_initial_pathologic_diagnosis:-1,
        year_of_initial_pathologic_diagnosis:-1,
        person_neoplasm_cancer_status:"",
        day_of_form_completion:-1,
        month_of_form_completion:-1,
        year_of_form_completion:-1,
        anatomic_neoplasm_subdivision:"",
        laterality:"",
        primary_lymph_node_presentation_assessment:"",
        lymph_node_examined_count:"",
        number_of_lymphnodes_positive_by_he:"",
        number_of_lymphnodes_positive_by_ihc:"",
        lymphovascular_invasion_present:"",
        perineural_invasion_present:"",
        neoplasm_histologic_grade:"",
        year_of_tobacco_smoking_onset:"",
        stopped_smoking_year:"",
        number_pack_years_smoked:-1,
        alcohol_history_documented:"",
        frequency_of_alcohol_consumption:"",
        amount_of_alcohol_consumption_per_day:"",
        radiation_therapy:"",
        postoperative_rx_tx:"",
        primary_therapy_outcome_success:"",
        other_dx:"",
        clinical_stage:"",
        clinical_T:"",
        clinical_N:"",
        clinical_M:"",
        pathologic_T:"",
        pathologic_N:"",
        pathologic_M:"",
        psa_value:"",
        days_to_psa:-1,
        gleason_score:"",
        primary_pattern:"",
        secondary_pattern:"",
        tertiary_pattern:"",
    }
    //this.drugs=[];
    //this.radiations=[];
    //this.follow_ups=[];
}

TCGA_Patient.prototype.fromFireHoseClinicInfor=function(fh_clinic_obj){
    for (var i=0; i<tcga_patient_feature_ls.length;i++){

    }
}

/**TCGA_Patient.prototype.loading=function(filename){
    var self =this;
    fs.readFile(filename, function(err, data) {
        parser.parseString(data, function (err, result) {
            console.dir(getPatientPath(result));
            //console.dir(result);
            //Get tcga_patient object

            var label_ls = getPatientPath(result, "patient");
            var tcga_objs = getXMLObjects(result,label_ls[0]);
            var patient_objs = getXMLObjects(tcga_objs[0],":patient");
            for (var i=0; i<tcga_patient_feature_ls.length; i++){
                var feature = tcga_patient_feature_ls[i];
                var attr_name = tcga_patient_xml_attr_dic[feature];
                if (attr_name!=undefined){
                    console.log(attr_name);
                    if (attr_name.indexOf("shared_stage")>=0){
                        label_ls.push("shared_stage:stage_event");
                        label_ls.push("0");
                        if (attr_name.indexOf("clinical")>=0){
                            label_ls.push("shared_stage:tnm_categories");
                            label_ls.push("0");
                            label_ls.push("shared_stage:clinical_categories");
                            label_ls.push("0");
                        }else if(attr_name.indexOf("pathologic")>=0){
                            label_ls.push("shared_stage:tnm_categories");
                            label_ls.push("0");
                            label_ls.push("shared_stage:pathologic_categories");
                            label_ls.push("0");
                        }
                        label_ls.push(attr_name);
                        label_ls.push("0");
                        self.features[feature]=getXMLValue(result, label_ls);
                        label_ls = getPatientPath(result, "patient");

                    }else if (attr_name.indexOf("drugs")>=0){
                        label_ls.push("rx:drugs");
                        label_ls.push("0");
                        label_ls.push("rx:drug");
                        var drugs_obj = getXMLObj(result, label_ls);
                        for (var k=0; k<drugs_obj.length; k++){
                            var drug_attr_ls =[];
                            var drug = new Drug.TCGA_Drug();
                            drug.loading(drugs_obj[k], drug_attr_ls);
                            self.drugs.push(drug);
                        }
                        label_ls = getPatientPath(result, "patient");
                        //console.dir(self);
                    }else if (attr_name.indexOf("radiations")>=0){
                        label_ls.push("rad:radiations");
                        label_ls.push("0");
                        label_ls.push("rad:radiation");
                        var radiation_objs = getXMLObj(result, label_ls);
                        for (var k=0; k<radiation_objs.length; k++){
                            var radiation_attr_ls =[];
                            var radiation = new Radiation.TCGA_Radiation();
                            radiation.loading(radiation_objs[k], radiation_attr_ls);
                            self.radiations.push(radiation);
                        }
                        label_ls = getPatientPath(result, "patient");
                        //console.dir(self);
                    }
                    else{
                        //self.features[feature]=getXMLValue(result, label_ls);
                        //label_ls = getPatientPath(result, "patient");
                        var target_obj = getXMLObjects(patient_objs[0][0],attr_name);
                        if (target_obj!=undefined && target_obj[0]!=undefined &&  target_obj[0]!=undefined){
                            self.features[feature] = target_obj[0][0]._
                        }else{
                            console.log(feature);
                        }
                    }

                }
            }
            console.dir(patient);
            console.log('Done');
        });
    });
}

var getXMLObjects = function(xml_obj, tag){
    var key_ls = _.filter(_.keys(xml_obj), function(key){
        return key.indexOf(tag)>=0;
    });
    var xml_obj_ls = [];
    _.map(key_ls, function(key){
        xml_obj_ls.push(xml_obj[key]);
    })
    return xml_obj_ls;
}**/


var xml_file = __dirname + '/nationwidechildrens.org_clinical.TCGA-39-5029.xml';
var patient = new TCGA_Patient();
//patient.loading(xml_file);


module.exports.TCGA_Patient = TCGA_Patient;