var cfg = require('../config.js');
var db = require(cfg.root+'/system/server/db.js');
var OID = db.prototype.supply.ObjectID;

function get_cats_new(callback){
	db(cfg.dbname).open(function(err,db){
		db.collection('cats').find({},
			{
				fields:{_id:1,from_site:1,level:1,name:1,parent_auto_motive_id:1,click:1}
				,sort:{id:1}
			}).toArray(function(err,doc){
			db.close();
			var out=[];
			doc.forEach(function(o){
				if(o.level==1){
					o.click=o.click?o.click:0;
					o.subcats = [];
					var id = o._id;
					doc.forEach(function(s){
						if(s.parent_auto_motive_id+'' == id+''){
							o.subcats.push(s);
						}
					});
					out.push(o);
				}
			});
			callback(err,out);
		});
	});
}

function get_parts_by_category_limit(callback,pid,skip){
	category = pid?{'auto_motive_id':OID(pid)}:{};
	skip = +skip;
	db(cfg.dbname).open(function(err,db){
		db.collection('parts').find(
			category,
			{
				fields:{_id:0,brand:1,from_site:1,name:1,price:1,small_image_url:1,url:1,hot:1}
				,sort:{hot:-1}
				,skip:skip
				,limit:50
			}).toArray(function(err,doc){
			callback(err,doc);
			db.close();
		});
	});
}

function get_position(callback,pid,position){
	var query = (typeof pid==='string')?{'_id':OID(pid)}:pid;
	position = position || [];
	db(cfg.dbname).open(function(err,db){
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

function parts_search(callback,reg,skip){
// var time = new Date().getSeconds();
// console.log('start',0);
	db(cfg.dbname).open(function(err,db){
		db.collection('parts').find(
		{name:reg},
		{
			fields:{_id:0,category:1,brand:1,from_site:1,name:1,price:1,small_image_url:1,url:1,hot:1}
			,sort:{hot:-1}
			,skip:skip
			,limit:50
		}).toArray(function(err,result){
// console.log('res-all-or',new Date().getSeconds()-time);
			db.close();
			callback(err,result);
		});
	});


// 	db(cfg.dbname).open(function(err,db){
// 		db.collection('parts').find(
// 		{$or:[
// 			{brand:reg},
// 			{category:reg},
// 			{name:reg}
// 		]}
// 		,{
// 			fields:{_id:0,category:1,brand:1,from_site:1,name:1,price:1,small_image_url:1,url:1,hot:1}
// 			,sort:{hot:-1}
// 			,skip:skip
// 			,limit:50
// 		}).toArray(function(err,result){
// console.log('res-all-or',new Date().getSeconds()-time);
// 			db.close();
// 			callback(err,result);
// 		});
// 	});

}

module.exports = {
	get_position : get_position,
	parts_search : parts_search,
	get_cats_new : get_cats_new,
	get_parts_by_category_limit : get_parts_by_category_limit
}