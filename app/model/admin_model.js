var cfg = require('../config.js');
var db = require(cfg.root+'/system/server/db.js');
var OID = db.prototype.supply.ObjectID;

function login(callback,user){
	db(cfg.dbname).open(function(err,db){
		db.collection('users').findOne({name:user.name},{fields:{pw:1,name:1,group:1,date:1}},function(err,item){
			db.close();
			callback(err,item);
		});
	});
}

function get_categorys(callback,pid){
	db(cfg.dbname).open(function(err,db){
		db.collection('cats').find({},{fields:{_id:1,from_site:1,level:1,name:1,parent_auto_motive_id:1}}).toArray(function(err,doc){
			doc.forEach(function(s){
				s.parent_auto_motive_id=s.parent_auto_motive_id?s.parent_auto_motive_id:'';
			});
			db.close();
			callback(err,doc);
		});
	});
}

function user_list(callback){
	db(cfg.dbname).open(function(err,db){
		db.collection('users').find({},{fields:{name:1,group:1,date:1}}).toArray(function(err,doc){
			db.close();
			callback(err,doc);
		});
	});
}

function add_user(callback,user){
	if(!user){
		return false;
	}
	user.date = new Date();
	db(cfg.dbname).open(function(err,db){
		db.collection('users').findOne({name:user.name},function(err,item){
			if(!item){
				db.collection('users').insert(user,function(err,result){
					db.close();
					callback(err,result);
				});
			}
		});
	});
}

function edit_one(callback,type,data){
	var where = {'_id':OID(data._id)};
	if(type==='cats'){
		if(data.parent_auto_motive_id){
			data.parent_auto_motive_id = OID(data.parent_auto_motive_id);
		}else{
			delete data.parent_auto_motive_id;
		}
		data.level = +data.level;
	}
	if(type==='parts'){
		if(data.auto_motive_id){
			data.auto_motive_id = OID(data.auto_motive_id);
		}else{
			delete data.auto_motive_id;
		}
	}
	delete data._id;
	db(cfg.dbname).open(function(err,db){
		db.collection(type).update(where,{$set:data},{fsync:true,safe:true},function(err,doc){
			callback(err,doc);
			db.close();
		});
	});
}

function add_one(callback,type,data){
	data.created_at = new Date();
	data.updated_at = data.created_at;
	var where = data;
	if(type==='cats'){
		if(data.parent_auto_motive_id){
			data.parent_auto_motive_id = OID(data.parent_auto_motive_id);
		}else{
			delete data.parent_auto_motive_id;
		}
		data.level = +data.level;
	}
	if(type==='parts'){
		if(data.auto_motive_id){
			data.auto_motive_id = OID(data.auto_motive_id);
		}else{
			delete data.auto_motive_id;
		}
	}
	db(cfg.dbname).open(function(err,db){
		db.collection(type).insert(where,{fsync:true,safe:true},function(err,doc){
			callback(err,doc);
			db.close();
		});
	});
}

function delete_one(callback,type,data){
	var where = {'_id':OID(data._id)};
	db(cfg.dbname).open(function(err,db){
		db.collection(type).remove(where,{fsync:true,safe:true},function(err,doc){
			callback(err,doc);
			db.close();
		});
	});
}

function search_parts(callback,query){
	query = /^[a-z0-9]{24}$/i.test(query)?OID(query):new RegExp('^[^\\n\\r]*'+query.replace(/\\/g,'\\\\').replace(/\//g,'\\/').replace(/\s+/g,'[^\\n\\r]*')+'[^\\n\\r]*$','i');
	if(query.test){
		db(cfg.dbname).open(function(err,db){
			db.collection('parts').find({
				$or:[
				{brand:query},
				{category:query},
				{name:query}
				]
			},{fields:{_id:1,auto_motive_id:1,category:1,brand:1,from_site:1,name:1,price:1,small_image_url:1,url:1,comment_info:1}}).toArray(function(err,result){
				db.close();
				callback(err,result);
			});
		});
	}else{
		db(cfg.dbname).open(function(err,db){
			db.collection('parts').find({
				$or:[
				{_id:query},
				{auto_motive_id:query}
				]
			},{fields:{_id:1,auto_motive_id:1,category:1,brand:1,from_site:1,name:1,price:1,small_image_url:1,url:1,comment_info:1}}).toArray(function(err,result){
				db.close();
				callback(err,result);
			});
		});
	}
}

module.exports = {
	login : login,
	get_categorys : get_categorys,
	add_user : add_user,
	user_list : user_list,
	edit_one : edit_one,
	add_one : add_one,
	delete_one : delete_one,
	search_parts : search_parts
}