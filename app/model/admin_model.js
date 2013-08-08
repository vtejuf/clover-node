var cfg = require('../config.js');
var db = require(cfg.root+'/system/server/db.js');
var OID = db.prototype.supply.ObjectID;

function login(callback,user){
	db('cars').open(function(err,db){
		db.collection('user').findOne(user,{fields:{name:1,group:1,date:1}},function(err,item){
			db.close();
			callback(err,item);
		});
	});
}

function get_categorys(callback,pid){
	db('cars').open(function(err,db){
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
	db('cars').open(function(err,db){
		db.collection('user').find({},{fields:{name:1,group:1,date:1}}).toArray(function(err,doc){
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
	db('cars').open(function(err,db){
		db.collection('user').findOne({name:user.name},function(err,item){
			if(!item){
				db.collection('user').insert(user,function(err,result){
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

module.exports = {
	login : login,
	get_categorys : get_categorys,
	add_user : add_user,
	user_list : user_list,
	edit_one : edit_one,
	add_one : add_one,
	delete_one : delete_one
}