/**
 * Created by hqyone on 10/4/16.
 */
var mysql = require('./db_connection.js')

var MysqlQueryer = function(){
    this.query_stack_num = 0;
    this.data ={};
}

MysqlQueryer.prototype.QueryBySQL = function(sql, conn, format_cb, response_cb){
    var self = this;
    conn.query(sql, function(err, rows, fields){
        if (err) throw err;
        if(rows!=null && rows.length>0){
            format_cb(rows, fields, self.data);
            self.query_stack_num -=1;
            if(self.query_stack_num==0){
                conn.end(); //Release colection
                response_cb(self.data)
            }
        }else{
            response_cb("no_data")
        }
    })
};

MysqlQueryer.prototype.QueryBySQLDic = function(sql_dic, format_cb_dic, response_cb){
    var self = this;
    if (sql_dic!=undefined && Object.keys(sql_dic).length>0){
        self.query_stack_num = Object.keys(sql_dic).length;
        var conn =  new mysql.MysqlConnectionPool();
        for (var type in sql_dic){
            var format_cb = format_cb_dic[type];
            if (format_cb!=undefined){
                self.QueryBySQL(seq_dic[type], conn, format_cb, response_cb);
            }
        }
    }else{
        response_cb("no_data")
    }
}