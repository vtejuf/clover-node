var cfg = require('../config.js');
var db = require(cfg.root+'/system/server/db.js');
var OID = db.prototype.supply.ObjectID;

function get_category(callback,pid){
	var query = {'_id':OID(pid)};
	db('cars').open(function(err,db){
		db.collection('cats').find(query,{fields:{name:1,parent_auto_motive_id:1,link:1}}).toArray(function(err,doc){
			callback(err,doc);
			db.close();
		});
	});
}

function get_categorys(callback,pid){
	var query = !pid?{'level':1}:{'parent_auto_motive_id':OID(pid)};
	db('cars').open(function(err,db){
		db.collection('cats').find(query,{fields:{name:1,parent_auto_motive_id:1,link:1}}).toArray(function(err,doc){
			callback(err,doc);
			db.close();
		});
	});
}

function get_brands_by_pid(callback,pid){
	brand = pid?{'auto_motive_id':OID(pid)}:{};
	db('cars').open(function(err,db){
		db.collection('parts').distinct('brand',brand,function(err,doc){
			callback(err,doc);
			db.close();
		});
	});
}

function get_parts_by_category(callback,pid){
	category = pid?{'auto_motive_id':OID(pid)}:{};
	db('cars').open(function(err,db){
		db.collection('parts').find(category,{fields:{_id:0,brand:1,from_site:1,name:1,price:1,small_image_url:1,url:1,comment_info:1}}).toArray(function(err,doc){
			callback(err,doc);
			db.close();
		});
	});
}

function get_parts_by_brand(callback,brand){
	db('cars').open(function(err,db){
		db.collection('parts').find({'brand':brand},{fields:{_id:0,category:1,brand:1,from_site:1,name:1,price:1,small_image_url:1,url:1,comment_info:1}}).toArray(function(err,doc){
			callback(err,doc);
			db.close();
		});
	});
}

function get_position(callback,pid,position){
	var query = (typeof pid==='string')?{'_id':OID(pid)}:pid;
	position = position || [];
	db('cars').open(function(err,db){
		db.collection('cats').find(query,{fields:{name:1,parent_auto_motive_id:1,link:1}}).toArray(function(err,doc){
			if(!doc[0].parent_auto_motive_id){
				position.unshift(doc[0].name);
				callback(err,position);
			}else{
				position.unshift(doc[0].name);
				get_position(callback,doc[0].parent_auto_motive_id,position);
			}
			db.close();
		});
	});
}

function parts_search(callback,reg){
	db(cfg.dbname).open(function(err,db){
		db.collection('parts').find({
			$or:[
			{brand:reg},
			{category:reg},
			{name:reg}
			]
		},{fields:{_id:0,category:1,brand:1,from_site:1,name:1,price:1,small_image_url:1,url:1,comment_info:1}}).toArray(function(err,result){
			db.close();
			callback(err,result);
		});
	});
	// console.log();
}
//


module.exports = {
	get_category : get_category,
	get_categorys : get_categorys,
	get_brands_by_pid : get_brands_by_pid,
	get_parts_by_category : get_parts_by_category,
	get_parts_by_brand : get_parts_by_brand,
	get_position : get_position,
	parts_search : parts_search
}