var mysql=require('mysql');
 var connection=mysql.createPool({
 
host:'localhost',
 user:'root',
 password:'',
 database:'priya_store',
 port:'3307'

});
module.exports=connection;