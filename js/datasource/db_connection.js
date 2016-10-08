/**
 * Created by hqyone on 10/4/16.
 */

var mysql = require('mysql');

var MysqlConnectionPool = function(){
    var pool = mysql.createPool(
        {
            connectionLimit:200,
            host:'192.168.0.100',
            port:'3306',
            user:'root',
            password:'1234@qwer',
            database:'targeting'
        }
    )
    return pool;
}

MysqlConnectionPool.prototype.query_db = function(sql, format_cb, response_cb){
    var self = this;
    self.query(sql, function(err, rows, fields){
        if (err) throw err;
        if(rows!=null && rows.length>0){
            format_cb(rows, self.data)
            self.query_stack_num
        }
    })
}

module.exports.MysqlConnectionPool = MysqlConnectionPool;