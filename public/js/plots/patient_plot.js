/**
 * Created by hqyone on 7/23/16.
 */
var PatientPlot = function(parent_div_id, settings){
    var self = this;
    self.parent_div_id = parent_div_id;
    self.test_data = {
        "id": 3,
        "label": "tcga-a2-a04v[Age:39]",
        "inode": true,
        "icon": "patient",
        "timeline":"",
        "des": "des",
        "branch": [
        {
            "id": 16,
            "label": "Sample [2]",
            "inode": true,
            "des": "des",
            "branch": [
                {
                    "id": 14,
                    "label": "blood derived normal",
                    "inode": false,
                    "des": "e836362b-a517-4a2d-8f31-cce0af7a555b",
                    "s_day": "1812",
                    "e_day": "1812"
                },
                {
                    "id": 15,
                    "label": "primary tumor",
                    "inode": false,
                    "des": "5dfab1d0-fed6-47b2-a47d-402e088361ad",
                    "s_day": "1812",
                    "e_day": "1812"
                }
            ]
        },
        {
            "id": 25,
            "label": "Malignancies [1]",
            "inode": true,
            "des": "des",
            "branch": [
                {
                    "id": 24,
                    "label": "breast[synchronous malignancy]",
                    "inode": false,
                    "des": "e16fccbc-062f-4054-9f8d-eb0e1943ee6a",
                    "timeline": "m,breast,NaN;",
                    "tooltip": "Pathologic T,t2;"
                }
            ]
        },
        {
            "id": 40,
            "label": "Treatments [6]",
            "inode": true,
            "des": "des",
            "branch": [
                {
                    "id": 34,
                    "label": "tamoxifen",
                    "inode": false,
                    "des": "c1e949b8-77cf-4bbb-b6f2-a74ede20457a",
                    "timeline": "<div style='background-color:yellow;'>c1e949b8-77cf-4bbb-b6f2-a74ede20457a</div>",
                    "s_day": "107",
                    "e_day": "1258"
                },
                {
                    "id": 35,
                    "label": "adriamycin",
                    "inode": false,
                    "des": "8e869f6b-ed8a-4174-ad9e-fff54d6496cc",
                    "timeline": "<div style='background-color:yellow;'>8e869f6b-ed8a-4174-ad9e-fff54d6496cc</div>",
                    "s_day": "50",
                    "e_day": "92"
                },
                {
                    "id": 36,
                    "label": "letrozole",
                    "inode": false,
                    "des": "4de0e435-5d29-44a0-a877-986681b96a3b",
                    "timeline": "<div style='background-color:yellow;'>4de0e435-5d29-44a0-a877-986681b96a3b</div>",
                    "s_day": "1269",
                    "e_day": "1439"
                },
                {
                    "id": 37,
                    "label": "exemestane",
                    "inode": false,
                    "des": "41160c56-81c5-42b7-83b8-cc0018073cac",
                    "timeline": "<div style='background-color:yellow;'>41160c56-81c5-42b7-83b8-cc0018073cac</div>",
                    "s_day": "1452",
                    "e_day": null
                },
                {
                    "id": 38,
                    "label": "xeloda",
                    "inode": false,
                    "des": "a2308b51-8301-425e-b065-0be458fe1672",
                    "timeline": "<div style='background-color:yellow;'>a2308b51-8301-425e-b065-0be458fe1672</div>",
                    "s_day": "1577",
                    "e_day": null
                },
                {
                    "id": 39,
                    "label": "cytoxan",
                    "inode": false,
                    "des": "e691b7e7-6b22-430c-9b18-b7f08912f85a",
                    "timeline": "<div style='background-color:yellow;'>e691b7e7-6b22-430c-9b18-b7f08912f85a</div>",
                    "s_day": "50",
                    "e_day": "92"
                }
            ]
        },
        {
            "id": 55,
            "label": "Followups [1]",
            "inode": true,
            "des": "des",
            "branch": [
                {
                    "id": 54,
                    "label": "Followup [with tumor]",
                    "inode": false,
                    "des": "8a12f731-0d21-451d-aed9-2677f2356de2",
                    "timeline": "fd,,1920;",
                    "tooltip": "Cancer status,with tumor;"
                }
            ]
        }
    ]
    };

    this.settings={
        x:0,
        y:0,
        width:1000,
        tree_width:200,
        timeline_width:200,
        row_height:20,

        margin_cal_type:"ratio", //absolute
        margin_top:20,
        margin_right:10,
        margin_bottom:20,
        margin_left:20,

        columnData:[
            {props:'timeline'}
        ]
    }
}

PatientPlot.prototype.Initialization = function(settings){
    var self = this;
    if (settings!=undefined){
        jQuery.extend(self.settings, settings);
    }

    self.margin ={top: self.settings.margin_top, bottom: self.settings.margin_bottom,
        right: self.settings.margin_right, left: self.settings.margin_left};

    //Initial layout
    self.chart_x = self.margin.left;
    self.chart_y = self.margin.top;
    self.chart_width = self.settings.width-self.margin.left-self.margin.right;
    self.settings.timeline_width =  Math.max(self.chart_width-self.settings.tree_width,200);
    self.chart_height = self.settings.height -self.margin.top-self.margin.bottom;

    //Scales
    var contents = self.__data.timeline.split(",");
    var s_days =contents[0];  var e_days = contents[1] ;
    self.xscale = d3.scale.linear().domain([s_days, e_days])
        .range([0, self.settings.timeline_width]);

    self.xAxis = d3.svg.axis().scale(x)
        .orient("bottom").ticks(5, "s");

    /*self.yscale = d3.scale.linear().domain([s_days, e_days])
        .range([self.margin.top+self.chart_height-self.settings.protein_height, self.margin.top]);*/

}


PatientPlot.prototype.Render = function(data, settings){
    var self= this;

    if(settings == undefined){
        var grandparent_div = $("#"+self.parent_div_id).parent();
        //var grandparent_div = $("#"+self.parent_div_id);
        if(grandparent_div.width()>20 && grandparent_div.height()>20){
            self.settings.width = grandparent_div.width();
            self.settings.height = grandparent_div.height();
        }
    }

    self.Initialization(settings);

    if(data !=undefined){
        self.__data = data;
    }else{
        self.__data = self.test_data;
    };

}


PatientPlot.prototype.RenderTreeTable=function(div_id){
    var self = this;
    var tree = $('#'+div_id).aciTree({
        columnData:self.settings.columnData,
        ajax: {
            //url: '../data/patient.json'
        },
        //datasource:a,
        fullRow:true,
        width:"800px"
        //checkbox: true
    }).on('acitree',function(event,api,item,eventName, options){
        switch (eventName) {
            case 'init':
                $(this).aciTree('api').setWidth(0,300);
                //$(this).aciTree('api').setWidth(1,800);
                $(this).find('ul:first').css('with','30%');
                $(this).toggleClass('aciTreeColors',true);
                break;
        }
    });
    var api = tree.aciTree('api');
    $.getJSON('../data/patient.json', function(data){
        //Replace information to html
        self.ManipulateJson(data);
        api.loadFrom(null, {itemData:data})
    })
};

PatientPlot.prototype.ManipulateJson = function(json){
    var self = this;
    ModifyJsonObj(json,"timeline",self.GetTimelineHTML("time_line"));
};


function ModifyJsonObj(json_obj, key, f){
    for (var k in json_obj){
        if (k == key){
            json_obj[k] = f(json_obj[k]);
        }else if (typeof(json_obj[k])==="object"){
            ModifyJsonObj(json_obj[k], key, f);
        }
    }
}


PatientPlot.prototype.RenderTitleTable = function(){

};


//Add function to draw grid
function make_x_axis() {
    return d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .ticks(5)
}

PatientPlot.prototype.GetTimelineHTML = function(div_id){
    var self = this;
    // Add the X Axis
    var back_svg = d3.select("#"+div_id).append("svg");
    var x_axis=back_svg.append("g")
        .attr("class", "time_line_grid")
        //.attr("transform", "translate("+self.settings.margin_left+","+(height+self.settings.margin_top)+")")
        .attr("transform", "translate(0," + self.settings.row_height+ ")")
        .attr({
            'fill':'none',
            'stroke':'grey',
            'opacity':0.6
        })
        .call(make_x_axis()
            .tickSize(-self.settings.row_height, 0, 0)
            .tickFormat("")
        );
    return back_svg.html();
}