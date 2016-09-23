/**
 * Created by hqyone on 9/10/16.
 */
var layout_dic ={
    TCGA:{
        style:"layout",  //layout, Accordion, tab
        childern_views:[
            {id:"north", title:"North", type:"ui-layout-north", childern:{
                style:"",
                childern_views:[

                ]
            }},
            {id:"center", title:"Center", type:"ui-layout-center", childern_format:"",childern_views:[]},
            {id:"south", title:"South", type:"ui-layout-south", childern_format:"",childern_views:[]},
            {id:"east", title:"East", type:"ui-layout-east", childern_format:"",childern_views:[]},
            {id:"west", title:"West", type:"ui-layout-west", childern_format:"",childern_views:[]}
        ]
    }
}

DS_Layout_Map= {
    "tcga":"TCGA",
}

LayoutManager = function(div_id){
    this.div_id = div_id;
}

LayoutManager.prototype.buildLayout = function(layout_type){
    var self = this;
    if (layout_type in layout_dic){
        var layout_view_ls = layout_dic[layout_type]; 
        if (layout_view_ls.length>0){
            var parent_element = undefined;
            if (self.div_id=='body'){
                parent_element=d3.select('body');
            }else{
                parent_element=d3.select("#"+self.div_id)
            }
            parent_element.html("");

            for (var i=0; i<layout_view_ls.length; i++){
                var cur_layout = layout_view_ls[i];
                parent_element.append("div").classed(cur_layout.type, true);
            }
            if (self.div_id=='body'){
                $('body').layout({ applyDefaultStyles: true })
            }else{
                $("#"+self.div_id).layout({ applyDefaultStyles: true })
            }
        }
    }
}

//Dynamic Layout settings
//The structure of App layout is : BODY:LAYOUT:VIEWS:DATA