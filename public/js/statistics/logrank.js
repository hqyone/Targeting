/**
 * Created by hqyone on 8/18/16.
 */
    //Need underscore.js
var test_data = {
    //t: Last Time
    //c: Censor
    data1:[
        {t:8, c:false},
        {t:12, c:false},
        {t:15, c:true},
        {t:25, c:true},
        {t:37, c:false},
        {t:55, c:false},
        {t:72, c:true},
    ],
    data2:[
        {t:1, c:false},
        {t:1, c:false},
        {t:4, c:false},
        {t:5, c:false},
        {t:6, c:true},
        {t:9, c:true},
        {t:9, c:false},
        {t:22, c:false},
    ]
}

function longRank(data1,data2){
    var HR=-1;
    var P=1;

    _.each(data1, function(o){o.i=1});
    _.each(data2, function(o){o.i=2});

    var comb_data = data1.concat(data2);
    comb_data = _.sortBy(comb_data, function(o){return o.t});

    //Get events time (day)
    var event_ls = _.filter(comb_data, function(o){return o.c==false});
    var unique_event_ls = _.sortBy(_.uniq(event_ls,function(o){return o.t},function(o){return o.t}));
    var x2 = -1;
    if (unique_event_ls!=undefined && unique_event_ls.length>0){
        //r: means remain (live) cases' number
        //o: the accumulated observed event cases number
        //e: the accumulated expected event cases number
        //d: the number of event cases in one time point (day)
        //c: the number of censor cases in one time point (day)
        var start=0;
        var d= 0, d1= 0, d2= 0, c= 0, c1= 0, c2= 0, r= comb_data.length , r1= data1.length, r2=data2.length, o1= 0, o2= 0, e1= 0, e2=0;
        for (var i=0; i<unique_event_ls.length; i++){
            var event_t = unique_event_ls[i].t;
            for (var k=start; k<comb_data.length; k++){
                var cur_data = comb_data[k];
                if(cur_data.t>event_t){
                    e1+=(parseFloat(d)/(d+r+c))*(r1+d1+c1);   //Expected number of events in group 1
                    e2+=(parseFloat(d)/(d+r+c))*(r2+d2+c2);   //Expected number of events in group 2
                    start = k;
                    d=0; d1=0; d2=0; c= 0; c1= 0; c2= 0;
                    break;
                }else{
                    r-=1;
                    if (cur_data.i==1){
                        r1-=1;
                        if (!(cur_data.c)){d+=1; d1+=1; o1+=1}else{c+=1;c1+=1}
                    }else if(cur_data.i==2) {
                        r2-=1;
                        if (!(cur_data.c)){d+=1; d2+=1; o2+=1}else{c+=1;c2+=1}
                    }
                }
            }
        }
        x2=Math.pow((o1-e1),2)/e1+Math.pow((o2-e2),2)/e2
    }
    if(x2!=-1){
        P =calc_x_df(x2, 1);
        HR = (o1/e1)/(o2/e2).toPrecision(2);
    }
    return {P:P, HR:HR};
}

//Test
//longRank(test_data.data1, test_data.data2);