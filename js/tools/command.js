/**
 * Created by hqyone on 7/5/16.
 */


var child_process = require('child_process')

function cmd_exec(cmd, args, cb_stdout, cb_end) {
    try{
        var spawn = child_process.spawn,
            child = spawn(cmd, args),
            me = this;
        me.exit = 0;  // Send a cb to set 1 when cmd exits
        child.stdout.on('data', function (data) {
            cb_stdout(me, data)
        });
        child.stdout.on('end', function () {
            cb_end(me)
        });
        return me;
    }catch(err){
        //Tested dosen't work
        console.log("Fail to run extenal program: "+cmd);
    }
}

/**foo = new cmd_exec('netstat', ['-rn'],
 function (me, data) {me.stdout += data.toString();},
 function (me) {me.exit = 1;}
 );

 function log_console() {
    console.log(foo.stdout);
}

 setTimeout(
 // wait 0.25 seconds and print the output
 log_console, 250);
 **/

function sort_object(object_ls, feature){
    var byProperty = function(prop) {
        return function(a,b) {
            if (typeof a[prop] == "number") {
                return (a[prop] - b[prop]);
            } else {
                return ((a[prop] < b[prop]) ? -1 : ((a[prop] > b[prop]) ? 1 : 0));
            }
        };
    };
    return object_ls.sort(byProperty(feature));
}

module.exports.cmd_exec = cmd_exec;
module.exports.sort_object = sort_object;