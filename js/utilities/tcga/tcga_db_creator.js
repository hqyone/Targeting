/**
 * Created by hqyone on 9/25/16.
 */
var fs = require('fs');
var zlib = require('zlib');
var path = require('path');
var readline = require('readline');
var __=require('underscore');
var patient = require("../normalized_model/patient.js");
var malignancy = require("../normalized_model/malignancy.js");
var analyte = require("../normalized_model/analyte.js");
var followup = require("../normalized_model/followup.js");
var sample = require("../normalized_model/sample.js");
var slides = require("../normalized_model/slides.js");
var treatment = require("../normalized_model/treatment.js");
var tumor_events = require("../normalized_model/tumor_events.js");
var radiation = require("../normalized_model/radiation.js");
var parser = require("firehose_clinic_parser.js");


//GZ file : gdac.broadinstitute.org_BRCA.Merge_Clinical.Level_1.2016012800.0.0.tar.gz
var clinic_tab_file_dic={
    BRCA:"/Users/hqyone/FireHose_Data/stddata__2016_01_28/BRCA/20160128/gdac.broadinstitute.org_BRCA.Merge_Clinical.Level_1.2016012800.0.0/BRCA.clin.merged.txt"
};
var outdir = "";

function CreateClinicalTables(wdir_dic, outdir){
    if (!(__.isEmpty(clinic_tab_file_dic))){
        __.reduce(clinic_tab_file_dic, function(memo, value, key){
            var clinic_tab_file = value;
            var lineage_id = key;
            var patient_ls =parser.read_table_file(clinic_tab_file, lineage_id);
            __.each(patient_ls, function(patient){
                patient.WriteToDBTables(outdir)
            })
        },{})
    }
}

function UnZipFile(gz_file){
    try{
        var txt_file =  gz_file.replace(/\.gz$/,"");
        var gzip = zlib.createGzip();
        var fs = require('fs');
        var inp = fs.createReadStream(txt_file);
        var out = fs.createWriteStream(gz_file);
        inp.pipe(gzip).pipe(out);
        return txt_file;
    }catch(err){
        //Tested dosen't work
        console.log("Fail to extract gz file "+ gz_file);
        return undefined;
    }
}