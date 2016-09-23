/**
 * Created by hqyone on 8/14/16.
 */
/**var KMPlot = function(id, type,  parent_div_id, settings){
    MyPlot.call(this, id, type,  parent_div_id, settings);
}**/
var KMPlot = function(id, parent_div_id, settings){
    MyPlot.call(this, id, "km_plot", parent_div_id, settings);
    this._test_data= {
        category1: {
            des: "",
            style: {color: "red", symbol: "circle"},
            case_ls: [
                {"i": "masterdeid1", "c": "n", "t": 34}
            ]
        },
        category2: {
            des: "",
            style: {color: "red", symbol: "cross"},
            case_ls: [
                {"i": "masterdeid1", "c": "n", "t": 45}
            ]
        }
    }
}




KMPlot.inheritsFrom(MyPlot);

//KMPlot.prototype = new MyPlot();
//KMPlot.prototype.constructor = KMPlot;

KMPlot.initialization = function(data, settings){
    MyPlot.initialization.call(this, data, settings);
    //this.parent.initialization.call(this, data, settings);
}

KMPlot.prototype.newfunc =function(){
    this.initialization("hyqone");
    console.log(this._parent_div_id);
    console.log("newfunc");
    console.log(JSON.stringify(this._data));
}

KMPlot.prototype.render =function(){
    MyPlot.prototype.render();
    console.log("kmplot");
}