/**
 * Created by hqyone on 8/14/16.
 */
/**var KMPlot = function(id, type,  parent_div_id, settings){
    MyPlot.call(this, id, type,  parent_div_id, settings);
}**/
var KMPlot = function(){}
KMPlot.prototype = new MyPlot;


KMPlot.prototype.newfunc =function(){
    console.log("newfunc");
}

KMPlot.prototype.render =function(){
    MyPlot.prototype.render();
    console.log("kmplot");
}