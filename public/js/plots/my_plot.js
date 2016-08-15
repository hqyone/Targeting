/**
 * Created by hqyone on 8/14/16.
 */
var MyPlot = function(id, type,  parent_div_id, settings){
    //For IE9 compatibility problem
    Math.log2 = Math.log2 || function(x){return Math.log(x)*Math.LOG2E;};
    Math.log10 = Math.log10 || function(x){return Math.log(x)/Math.LN10;};

    this._test_data = {

    };
    this._id ="plot_id";
    this._type = "plot_type"
    this._data = undefined;
    this._parent_div_id = parent_div_id;
    this.settings = {
        x:0,
        y:0,
        width:1000,
        height:600,

        margin_top:30,
        margin_buttom:60,
        margin_left:70,
        margin_right:20,

        x_title:"name",
        y_title:"value",
        title:"title",

        tooltip:undefined,
    };

    if (settings!=undefined){
        jQuery.extend(this.settings, settings);
    }
}

MyPlot.prototype.initialization = function(data, settings){
    var self = this;
    if (settings != undefined){
        if (!(settings.hasOwnProperty("width") || settings.hasOwnProperty("height"))){
            var grandparent_div = $("#"+self.parent_div_id).parent();
            if(grandparent_div.width()>20 && grandparent_div.height()>20){
                self.settings.width = grandparent_div.width();
                self.settings.height = grandparent_div.height();
            }
        }
    }

    if(data!=undefined){
        self._data = data;
    }else{
        self.__data = self._test_data;
    }
}

MyPlot.prototype.render = function(){
    console.log("myplot render");
}