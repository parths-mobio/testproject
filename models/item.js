var db = require('../dbconnection');

var item={
 
    
    getAllitem:function(callback)
    {
     return db.query("SELECT * FROM item",callback);
    },
    addItem:function(callback)
    {
     return db.query('INSERT INTO item (id, name, description, quantity, amount) VALUES ?',callback);
    }
};
module.exports=item;