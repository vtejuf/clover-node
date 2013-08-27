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
		db.collection('cats').find({},{fields:{_id:1,from_site:1,level:1,name:1,parent_auto_motive_id:1,click:1}}).sort([['_id', 1]]).toArray(function(err,doc){
			doc.forEach(function(s){
				s.parent_auto_motive_id=s.parent_auto_motive_id?s.parent_auto_motive_id:'';
			});
			db.close();
			doc = cats_format(doc);
			callback(err,doc);
		});
	});
}

function cats_format(doc){
	var i=1,out=[],floor=0,l=doc.length-1;
	doc.forEach(function(level){
		if(level.level == i){
			out.push(level);
		};
		floor = level.level>floor?level.level:floor;
	});
	function _self(){
		if(i++>floor){
			return out;
		}
		for(j=l;j>0;j--){
			if(doc[j].level==i){
				var pid = doc[j].parent_auto_motive_id;
				for(var o in out){
					if(out[o]._id+'' == pid+''){
						var pos = +o+1;
						out.splice(pos,0,doc[j]);
						break;
					};
				}
			}
		}
		return _self();
	}
	return _self();
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
	if(!/^[a-z0-9]{24}$/i.test(data._id)){
		callback('oid type wrong');
		db.close();
		return false;
	}
	var where = {'_id':OID(data._id)};
	if(type==='cats'){
		if(data.parent_auto_motive_id){
			if(!/^[a-z0-9]{24}$/i.test(data.parent_auto_motive_id)){
				callback('oid type wrong');
				return false;
			}
			data.parent_auto_motive_id = OID(data.parent_auto_motive_id);
		}else{
			delete data.parent_auto_motive_id;
		}
	}
	if(type==='parts'){
		if(data.auto_motive_id){
			if(!/^[a-z0-9]{24}$/i.test(data.auto_motive_id)){
				callback('oid type wrong');
				return false;
			}
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
			if(!/^[a-z0-9]{24}$/i.test(data.parent_auto_motive_id)){
				callback('oid type wrong');
				return false;
			}
			data.parent_auto_motive_id = OID(data.parent_auto_motive_id);
		}else{
			delete data.parent_auto_motive_id;
		}
		data.level = +data.level;
	}
	if(type==='parts'){
		if(data.auto_motive_id){
			if(!/^[a-z0-9]{24}$/i.test(data.auto_motive_id)){
				callback('oid type wrong',doc);
				return false;
			}
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

function cats_merge(callback,type,ids){
	if(typeof ids ==='string'){
		var ids = ids.split(',');
		for(var j=0;j<ids.length;j++){
			ids[j]=OID(ids[j]);
		}
	}
	var allids=ids;
	_self(ids);
	function _self(ids){
	db(cfg.dbname).open(function(err,db){
		db.collection('cats').find({parent_auto_motive_id:{$in:ids}},{fields:{_id:1}}).toArray(function(err,reback){
			if(reback.length!==0){
				for(var i=0,l=reback.length;i<l;i++){
					reback[i]=reback[i]['_id'];
				}
				allids = allids.concat(reback);
				db.close();
				_self(reback);
			}else{
				var newcat_id = allids.shift();
				db.collection('parts').update({auto_motive_id:{$in:allids}},{$set:{auto_motive_id:newcat_id}},{fsync:true,safe:true,multi:true},function(err,stat){
					db.collection('cats').remove({_id:{$in:allids}},{fsync:true,safe:true},function(err,ok){
						if(ok){
							callback();
							db.close();
						}
					});
				});
			}
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
	search_parts : search_parts,
	cats_merge : cats_merge
}
