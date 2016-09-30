/**
 * Created by hqyone on 9/22/16.
 */
VolcanoPlot=function(data, parent_div_id, settings){
    //For IE9 compatibility problem
    Math.log2 = Math.log2 || function(x){return Math.log(x)*Math.LOG2E;};
    Math.log10 = Math.log10 || function(x){return Math.log(x)/Math.LN10;};

    this.test_input_data ={
         group1:[{name:"point1",p:0.01, r:2, value:100, tooltip:"", id:"id1"}, {name:"point2",p:0.04, r:0.5, value:200, tooltip:"", id:"id2"}],
         group2:[{name:"point3",p:0.1, r:4, value:100, tooltip:"", id:"id3"}, {name:"point4",p:0.02, r:0.5, value:200, tooltip:"", id:"id4"}]
    };

    this.__data = data;
    if (data===undefined){
        this.__data = this.test_input_data;
    }
    this.parent_div_id = parent_div_id;
    if (parent_div_id === undefined || parent_div_id=="") {
        this.parent_div_id = 'body';
    }

    this.settings = {
        case_max_width:30,
        case_space_unit:0.5, //0.85

        x:0,
        y:0,
        width:1000,
        height:600,

        margin_top:30,
        margin_bottom:60,
        margin_left:70,
        margin_right:20,

        p_limit:0.0001,
        r_min_limit:0.125,
        r_max_limit:8,

        x_title:"name",
        y_title:"value",
        title:"title",

        show_labels: true,
        use_size:true,
        radio:10,
        tooltip_loc:"south_east" //north, south, western, east


    };
    if (settings!=undefined){
        jQuery.extend(this.settings, settings);
    }
};


VolcanoPlot.prototype.initialization = function(settings){
    var self = this;
    if (settings!=undefined){
        jQuery.extend(self.settings, settings);
    }

    self.margin ={top: self.settings.margin_top, bottom: self.settings.margin_bottom,
        right: self.settings.margin_right, left: self.settings.margin_left};
    var min_p_value = Infinity;
    for (var group_name in self.__data){
        var series =  self.__data[group_name];
        for (var k=0; k<series.length; k++) {
            var spot = series[k];
            if (min_p_value>spot.p){
                min_p_value = spot.p;
            }
        }
    }

    //Initial layout
    self.chart_x = self.margin.left;
    self.chart_y = self.margin.top;
    self.chart_width = self.settings.width-self.margin.left-self.margin.right;
    self.chart_height = self.settings.height -self.margin.top-self.margin.bottom;


    //self.p_min_limit = min_p_value*0.5;
    self.p_min_limit = self.settings.p_limit;
    //Initialization the scales for data plot
    self.xscale = d3.scale.linear().domain([Math.log2(self.settings.r_min_limit), Math.log2(self.settings.r_max_limit)])
        .range([self.chart_x, self.chart_x+self.chart_width]);
    self.yscale = d3.scale.linear().domain([0, Math.log10(self.p_min_limit)*-1])
        .range([self.margin.top+self.chart_height, self.chart_y]);
    self.size_scale = d3.scale.log().domain([1,600])
        .range([3, 10]);
};

VolcanoPlot.prototype.render = function(input_data, settings){
    var self= this;
    if(input_data !=undefined){
        self.__data = input_data;
    }
    if(settings == undefined){
        var grandparent_div = $("#"+self.parent_div_id).parent();
        if(grandparent_div.width()>20 && grandparent_div.height()>20){
            self.settings.width = grandparent_div.width();
            self.settings.height = grandparent_div.height();
        }
    }
    var data = self.__data;
    self.initialization(settings);


    function redraw() {  //放大缩小 鼠标滑动   scale放大倍数，translate是转变，转换
        svg_g.select(".x_axis").call(self.xAxis_1);
        svg_g.select(".y_axis").call(self.yAxis_1);
        svg_g.select(".x.axis.grid").call(self.xAxis);
        svg_g.select(".y.axis.grid").call(self.yAxis);
        masked_svg_g.selectAll(".redrawable").attr("transform", "translate(" + d3.event.translate + ")" + "scale(" + d3.event.scale + ")");
        //clear_all_tooltips();
    }
    var zoom = d3.behavior.zoom()
        .x(self.xscale)
        .y(self.yscale)
        .scaleExtent([0.5, 20])
        .on("zoom", redraw);
    var container = d3.select("#" + self.parent_div_id);
    container.selectAll('svg').remove();
    var cur_svg = container.append('svg')
        .attr("id", self.parent_div_id + "_volcano_svg")
        .attr("class", 'volcano svg')
        .attr("width", self.settings.width)
        .attr("height", self.settings.height)
        .attr("overflow", "hidden")
        .call(zoom)

    var svg_g =cur_svg
        .append("g")  //Important for Zoom in out

    var masked_svg_g =cur_svg
        .append("g")  //Important for Zoom in out
        .attr("clip-path","url(#maskurl)")


    cur_svg.append("defs").append("svg:clipPath")
        .attr("id", "maskurl")
        .append("rect")
        .attr('width', self.chart_width)
        .attr('height', self.chart_height)
        .attr('x', self.margin.left)
        .attr('y', self.margin.top);

    svg_g.append("rect")
        .attr("class", "overlay")
        .attr("width", self.chart_width)
        .attr("height", self.chart_height)
        .attr("fill",'white').style("pointer-events","all");



    self.draw_axis(svg_g);
    self.draw_title(svg_g);

    self.draw_legends(masked_svg_g);
    self.draw_serie_ls(masked_svg_g);
    //draw_Print_Legend(self.parent_div_id + "_volcano_svg", undefined, {width:self.settings.width, height:self.settings.height});
}


VolcanoPlot.prototype.draw_axis = function(svg_g){
    var self= this;

    self.xAxis = d3.svg.axis().scale(self.xscale)
        .orient("bottom").ticks(5);

    self.xAxis_1 = d3.svg.axis().scale(self.xscale)
        .orient("bottom").ticks(5);

    self.yAxis = d3.svg.axis().scale(self.yscale)
        .orient("left").ticks(5);

    self.yAxis_1 = d3.svg.axis().scale(self.yscale)
        .orient("left").ticks(5);
    //Create axises
    // Add the X Axis
    svg_g.append("g")
        .attr("class", "x_axis")
        //.attr("transform", "translate("+cur_margin.margin_left+","+(height+cur_margin.margin_top)+")")
        .attr("transform", "translate(" +0+","+(self.margin.top + self.chart_height)+ ")")
        .call(self.xAxis_1).selectAll("path").attr("fill", "none");
    //.selectAll("text")
    //.style("text-anchor", "end")
    //.attr("dx", "-.4em")
    //.attr("dy", ".16em")
    //.attr("transform", function(d) {
    //    return "translate(0,6) rotate(-50)"
    //}
    //)

    // Add the Y Axis
    svg_g.append("g")
        .attr("class", "y_axis")
        //.attr("transform", "translate(" + 0 + "," + 0 + ")")
        .attr("transform", "translate(" + self.margin.left + "," + 0 + ")")
        .call(self.yAxis_1).selectAll("path").attr("fill", "none");

    //Add grid
    svg_g.append("g")
        .attr("class", "x axis grid")
        .attr("transform", "translate(" +0+","+(self.margin.top + self.chart_height)+ ")")
        .attr({
            'fill':'none',
            'stroke':'grey',
            'opacity':0.6
        })
        .call(self.xAxis
            .tickSize(-self.chart_height, 0, 0)
            .tickFormat("")
        );

    svg_g.append("g")
        .attr("class", "y axis grid")
        .attr("transform", "translate(" + self.margin.left + "," + 0 + ")")
        .attr({
            'fill':'none',
            'stroke':'grey',
            'opacity':0.6
        })
        .call(self.yAxis
            .tickSize(-self.chart_width, 0, 0)
            .tickFormat("")
        );
    self.draw_axis_title(svg_g);
}

VolcanoPlot.prototype.draw_axis_title = function(svg_g){
    var self = this;
    //Add title of x axis
    svg_g.append("g").append("text")
        //.selectAll(".multi_line_type_Labelg")
        .attr("x", self.margin.left + self.chart_width/2)
        .attr("y", self.margin.top+ self.chart_height + self.margin.bottom*2/3)
        .style("fill","black")
        .style("text-anchor", "middle")
        .text(function (d) {
            return "log2(Hazard Ratio)";
        })

    //Add title of y axis
    svg_g.append("g")
        //.selectAll(".multi_line_type_Labelg")

        .append("text")
        .attr("y", self.margin.left/3)
        .attr("x", -1*(self.margin.top+ self.chart_height/2))
        .style("fill","black")
        .style("text-anchor", "middle")
        .text(function (d) {
            return "-log10(p-value)";
        })
        .attr("transform", function(d) {
            //return "translate ("+self.margin.left/3+","+(self.margin.top+self.chart_height/2)+"),rotate(270)";
            return "rotate(270)";
        });
};

VolcanoPlot.prototype.draw_title = function(svg_g){
    var self= this;
    if (self.settings.title!=undefined && self.settings.title!=""){
        //Add title of figure
        svg_g.append("g").append("text")
            //.selectAll(".multi_line_type_Labelg")
            .attr("x", self.margin.left + self.chart_width/2)
            .attr("y", self.margin.top/2)
            .style("fill","black")
            .style("text-anchor", "middle")
            .style("font-family","sans-serif")
            .style("font-size", "14px")
            .text(function (d) {
                return self.settings.title;
            })
    }
};

VolcanoPlot.prototype.draw_legends=function(svg_g){
    var self= this;
    //Draw zero line
    svg_g.append("line")
        .attr("id", "volcano_hr_zero_line")
        .attr("class", "redrawable")
        .attr("y1",self.margin.top)
        .attr("x1",self.xscale(0))
        .attr("y2",self.margin.top+self.chart_height)
        .attr("x2",self.xscale(0))
        .attr("stroke", "blue")
        .attr("opacity", '0.8')
        .attr('stroke-width', 2)
    //Draw p 0.05 line
    svg_g.append("line")
        .attr("id", "volcano_hr_zero_line")
        .attr("class", "redrawable")
        .attr("y1",self.yscale(Math.log10(0.05)*-1))
        .attr("x1",self.margin.left)
        .attr("y2",self.yscale(Math.log10(0.05)*-1))
        .attr("x2",self.margin.left+self.chart_width)
        .attr("stroke", "red")
        .attr("opacity", '0.8')
        .attr('stroke-width', 2)

    svg_g.append("text")
        .attr("id", "volcano_hr_zero_line")
        .attr("class", "redrawable")
        .attr("y",self.yscale(Math.log10(0.05)*-1)-10)
        .attr("x",self.margin.left + self.chart_width -50)
        .text("p = 0.05")
        .attr("fill", "red")
        .attr("stroke-width",0 )
};

VolcanoPlot.prototype.draw_serie_ls=function(svg_g){
    var self= this;
    var seris_ls_g = svg_g.append("g").attr("class", "volcano serie_ls");
    for (var series_name in this.__data){
        var series_g = seris_ls_g.append("g")
            .attr("class", function(d) {return "volcano series "+ series_name;})
            .attr("id", function(d) {return "volcano_series_"+ series_name;})
        self.draw_series(series_g, this.__data[series_name]);
        if (self.settings.show_labels){
            self.draw_series_text(series_g,this.__data[series_name]);
        }
    }
};

VolcanoPlot.prototype.draw_series=function(parent_g, series){
    var self= this;
    //var parent_g = d3.select("#volcano_series_"+series.name);
    var x_scale = self.xscale;
    var y_scale = self.yscale;
    var size_scale = self.size_scale;

    parent_g.append("g").selectAll("circle")
        .data(series)
        .enter().append("circle")
        .attr("class",  function(d){return "volcano series "+series.name+" circle "+ d.id +" redrawable"})
        .attr("id",  function(d){return "volcano_series_"+series.name+"_circle_"+d.id})
        .attr("cx", function(d){
            var hr = d.r;
            if (hr<self.settings.r_min_limit){
                hr = self.settings.r_min_limit;
            }else if (hr>self.settings.r_max_limit){
                hr = self.settings.r_max_limit;
            }
            return x_scale(Math.log2(parseFloat(hr)))
        })
        .attr("cy", function(d){return y_scale(Math.log10(Math.max(parseFloat(d.p),self.settings.p_limit))*-1)+3})
        .attr("r", function(d){
            if(self.settings.use_size){
                return self.size_scale(d.value)
            }else{ return self.settings.radio;}
        })
        .attr("fill", function(d){
            if (d.p<0.05){
                if (d.r>1){return "red";} else {return "green";}
            }else{
                return "grey"
            }
        })
        .attr("opacity", 0.4)
        .on("mouseover", function(d){
            var cur_item = d3.select(this);
            var a = d3.select(this);
            a.attr("fill","orange");
            a.attr("opacity", 0.8)
            ;            //draw_biomarker_statistic_tooltip_2(d.biomarker,d.case_ls,d.data_filter_str);
            var html_str = '<strong>Case Number</strong> :' + d.value;
            self.draw_sunburst_tooltip(a,d.km_data,html_str,d.name);

        })
        .on("mouseout", function(d){
            // clear_all_tooltips();
            var a = d3.select(this);
            a.attr("fill", function(){
                if (d.p<0.05){
                    if (d.r>1){return "red";} else {return "green";}
                }else{
                    return "grey"
                }
            })
            d3.select("body").selectAll("#cur_sunburst_km_tooltip").style('display', "none");
        })
        .on("click", function(d){
            var request = {type: d.type, data:{bm_id: d.name}};
            /**if (x.anno_data.type == "biomarker"){
                    request.data={bm_id: x.name};}
             else if (x.anno_data.type == "drug"){
                    request.data={drug: x.name};}**/
            dispatch.CHANGE_CUR_BM(request);
        })
};

VolcanoPlot.prototype.draw_series_text=function(parent_g, series){
    var self= this;
    //var parent_g = d3.select("#volcano_series_"+series.name);
    var x_scale = self.xscale;
    var y_scale = self.yscale;
    var size_scale = self.size_scale;
    //tooltip:
    /**var expLab = d3.select("body").selectAll(".stack_barchart_tooltip");
     if(expLab==undefined || expLab[0].length<1){
        expLab =d3.select("body").append('div')
            .attr("class", "stack_barchart_tooltip")
            .style('display', 'none')
            .style('z-index', 999999999);
    }**/

    parent_g.append("g").selectAll("text")
        .data(series)
        .enter().append("text")
        .attr("class",  function(d){return "volcano series "+series.name+" text "+ series.id + " redrawable"})
        .attr("id",  function(d){return "volcano_series_"+series.name+"_text_"+series.id})
        .attr("x", function(d){
            var hr = d.r;
            if (hr<self.settings.r_min_limit){
                hr = self.settings.r_min_limit;
            }else if (hr>self.settings.r_max_limit){
                hr = self.settings.r_max_limit;
            }
            return x_scale(Math.log2(parseFloat(hr)))
        })
        .attr("y", function(d){return y_scale(Math.log10(Math.max(parseFloat(d.p),self.settings.p_limit))*-1)-12})
        .text(function(d){
            if(d.p<0.1){
                if (d.name.length>10){
                    return d.name.substr(0,7)+"..."
                }
                return d.name
            }
            return "";
        })
        .attr("text-anchor",'middle')
        .attr("fill", function(d){
            if (d.p<0.05){
                if (d.r>1){return "red";} else {return "green";}
            }else{
                return "grey"
            }
        })
        .attr("opacity", 0.8)
        .on("mouseover", function(d){
            var cur_item = d3.select(this);
            var a = d3.select(this);
            a.attr("fill","orange");
            //draw_biomarker_statistic_tooltip_2(d.biomarker,d.case_ls,d.data_filter_str);
            /**var output = '<strong>Name</strong>: '+d.name+'<br><strong>p </strong>: ' + d.p +'<br><strong>HR </strong>: ' + d.r+
             '<br><strong>Case Number</strong> :' + d.value;
             expLab.style("left", (d3.event.pageX+10) + "px")
             .style("top", (d3.event.pageY+10) + "px")
             .style('display', 'block')
             .style('position', 'absolute')
             .html(output.substring(0, output.length)).moveNodeToFront();**/
        })
        .on("mouseout", function(d){
            // clear_all_tooltips();
            var a = d3.select(this);
            a.attr("fill", function(){
                if (d.p<0.05){
                    if (d.r>1){return "red";} else {return "green";}
                }else{
                    return "grey"
                }
            })
            //expLab.style('display', 'none')
        })
};

VolcanoPlot.prototype.draw_legends=function(svg_g) {
    var self = this;
    //Draw zero line
    svg_g.append("line")
        .attr("id", "volcano_hr_zero_line")
        .attr("class", "redrawable")
        //.attr("y1", self.margin.top)
        .attr("y1", -1000)
        .attr("x1", self.xscale(0))
        //.attr("y2", self.margin.top + self.chart_height*)
        .attr("y2", self.margin.top + self.chart_height*3)
        .attr("x2", self.xscale(0))
        .attr("stroke", "blue")
        .attr("opacity", '0.8')
        .attr('stroke-width', 2)
    //Draw p 0.05 line
    svg_g.append("line")
        .attr("id", "volcano_hr_zero_line")
        .attr("class", "redrawable")
        .attr("y1", self.yscale(Math.log10(0.05) * -1))
        //.attr("x1", self.margin.left)
        .attr("x1", -1000)
        .attr("y2", self.yscale(Math.log10(0.05) * -1))
        //.attr("x2", self.margin.left + self.chart_width)
        .attr("x2", self.margin.left + self.chart_width*3)
        .attr("stroke", "red")
        .attr("opacity", '0.8')
        .attr('stroke-width', 2)

    svg_g.append("text")
        .attr("id", "volcano_hr_zero_line")
        .attr("class", "redrawable")
        .attr("y", self.yscale(Math.log10(0.05) * -1) - 10)
        .attr("x", self.margin.left + self.chart_width - 80)
        .text("p = 0.05")
        .attr("fill", "red")
        .attr("stroke-width", 0)
}

VolcanoPlot.prototype.draw_sunburst_tooltip = function(parent_div, data, html_str, title){
    var self = this;
    if (data!=undefined){
        //tooltip:
        var tooltip = d3.select("body").selectAll("#cur_sunburst_km_tooltip");
        if(tooltip==undefined || tooltip[0].length<1){
            tooltip =d3.select("body").append('div')
                .attr("id","cur_sunburst_km_tooltip")
                .attr("class", "sunburst_km_tooltip")
                .style('display', 'none')
                .style('z-index', 999999999);
        }else{
            tooltip.attr("class", "sunburst_km_tooltip")
        }
        tooltip.selectAll("div").remove();
        tooltip.selectAll("span").remove();
        tooltip.selectAll("hr").remove();
        tooltip.append("span").text(title).classed("tooltip_title", true);
        tooltip.append("hr").classed("tooltip_title", true);
        tooltip.append("div").html(html_str);
        if (data!=undefined){
            var kmplot_settings = {width:300, height:200,comp_classes:["pos","neg"],
                margin_cal_type:"absolute", margin_left:60, margin_bottom:50};
            tooltip.append("div").attr("id","sunburst_tooltip_km_plot");
            var km_plot = new KMPlot(undefined,"sunburst_tooltip_km_plot");
            km_plot.render(data,kmplot_settings);
            tooltip.style("left", (d3.event.pageX+7) + "px")
                .style("top", (d3.event.pageY-40) + "px")
                .classed('hidden', false)
                .style('position', 'absolute')
        }
        tooltip.classed("hidden", false);
        setTooltipLocation(parent_div, tooltip, self.settings.tooltip_loc,5);
    }
}

function setTooltipLocation(parent_div, tooltip, type, distance){
    //Change the location of tooltip
    tooltip.style('display', 'block');
    var parent_region = parent_div.node().getBoundingClientRect();
    var tooltip_region =  tooltip.node().getBoundingClientRect();
    if (distance == undefined){
        distance = 5;
    }
    var x = d3.event.pageX+distance;
    var y = d3.event.pageX+distance;
    if (type =="north"){
        x = parent_region.left - (tooltip_region.width - parent_region.width)/2;
        y = parent_region.top -tooltip_region.height-distance;
    }else if (type == "east") {
        x = parent_region.left + parent_region.width +distance;
        y = parent_region.top+parent_region.height/2-tooltip_region.height/2;
    }else if (type == "western") {
        x = parent_region.left - tooltip_region.width - distance;
        y = parent_region.top+parent_region.height/2-tooltip_region.height/2;
    }else if (type == "south") {
        x = parent_region.left - (tooltip_region.width - parent_region.width)/2;
        y = parent_region.top+parent_region.height +distance;
    }else if (type == "north_east") {
        x = parent_region.left + parent_region.width +distance;
        y = parent_region.top -tooltip_region.height-distance;
    }else if (type == "north_western") {
        x = parent_region.left - tooltip_region.width - distance;
        y = parent_region.top -tooltip_region.height-distance;
    }else if (type == "south_east") {
        x = parent_region.left + parent_region.width +distance;
        y = parent_region.top+parent_region.height +distance;
    }else if (type == "south_western") {
        x = parent_region.left - tooltip_region.width - distance;
        y = parent_region.top+parent_region.height +distance;
    }else{
        x = parent_region.left + parent_region.width +distance;
        y = parent_region.top+parent_region.height +distance;
    }
    tooltip.style("left",x+"px").style("top", y+"px")
        .style('position', 'absolute')
        .moveNodeToFront();
}

