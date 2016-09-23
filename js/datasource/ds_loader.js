/**
 * Created by hqyone on 7/6/16.
 */
var fs =  require('fs');
var csv = require("fast-csv");
var path = require("path");
//var ds =  require(path.join(Targeting.project_dir+"/js/registry/registry_ds.js"));

function get_ds_ls(){

}


//Initial/Reload the data source for Targeting
function load_targeting_ds() {
    try{
        console.log("Initial/Reload the data source for Targeting ...");
        //ds.load_to_global_ds(registry_ds.registry_ds_dic);
        //console.log("Done");
    }catch(err){
        console.log("Something wrong when loading data source to CODE2" + err.message);
        return undefined;
    }
}



module.exports.load_targeting_ds = load_targeting_ds;