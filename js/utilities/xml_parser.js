/**
 * Created by hqyone on 7/9/16.
 */
var path = require("path");
var parseString = require('xml2js').parseString;
var TCGA_Patient = require("./tcga/tcga_patient.js")
//var TCGA_Patient = require(path.join(CODE2.project_dir+"/js/manager/biomarker_manager.js"));

var xml = "<root>Hello xml2js!</root>";

parseString(xml, function (err, result) {
    console.dir(result);
});

//var Backbone = require('backbone');

var fs = require('fs'),
    xml2js = require('xml2js');

var _ = require("underscore");
var xml_file = __dirname + '/nationwidechildrens.org_clinical.TCGA-39-5029.xml';
var patient = new TCGA_Patient();
patient.loading(xml_file);
console.dir(patient);


/**var getPatientPath=function(xml_obj){
    var root_label = Object.keys(xml_obj)[0];
    var keys  = _.keys(xml_obj[root_label]);
    var patent_label = _.find(keys, function(key){return key.indexOf("patient")>=0});
    return [root_label,patent_label,0];
}

var parser = new xml2js.Parser();
fs.readFile(__dirname + '/nationwidechildrens.org_clinical.TCGA-39-5029.xml', function(err, data) {
    parser.parseString(data, function (err, result) {
        console.dir(getPatientPath(result));
        console.dir(result);
        console.log('Done');
    });
});**/