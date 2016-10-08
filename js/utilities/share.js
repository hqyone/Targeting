/**
 * Created by hqyone on 10/3/16.
 */
var fs = require('fs');

var deleteFolderRecursive = function(path, del_root) {
    if( fs.existsSync(path) ) {
        fs.readdirSync(path).forEach(function(file,index){
            var curPath = path + "/" + file;
            if(fs.lstatSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        if (del_root){
            fs.rmdirSync(path);
        }
    }
};

module.exports.deleteFolderRecursive = deleteFolderRecursive;
