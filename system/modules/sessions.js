var cfg = require("config.js");
var crypto = require('./crypto.js');
var db = require("../server/db.js");
var parsecookie = require('./cookies.js');
var dbname = cfg.dbname;
var sessionCfg = cfg.session;
var collection_name = sessionCfg.name;
var OID = db.prototype.supply.ObjectID;

sessionCfg.expires = !!sessionCfg.expires?sessionCfg.expires:1800;
sessionCfg.expires= parseInt(sessionCfg.expires);
var today = new Date();
var time = today.getTime() + sessionCfg.expires * 1000; 
var new_date = new Date(time); 
var expiresDate = new_date.toGMTString();
sessionCfg.expires += 'expires=' +  expiresDate + ';'; 
var session_option = 'expires='+sessionCfg.expires+';'+sessionCfg.httponly;

var session = {
	sid : '',

	init : function(app,callback){
		var cookies = parsecookie(app.req);
		if(!cookies[collection_name]){
			callback();
			return;
		}
		var session_info = cookies[collection_name];
		try{
			session_info = crypto.de_code(decodeURIComponent(session_info));
			session_info = JSON.parse(session_info);
		}catch(e){
			callback();
			return;
		}
		var reg = /^[0-9a-z]{24}$/gi;
		var sid_check = reg.test(session_info._id);
		if(!sid_check){
			callback();
			return;
		}
		this.sid = session_info._id;
		var oid = this.sid;
		db(dbname).open(function(err,db){
			db.collection(collection_name).findOne({'_id':OID(oid)},{timeout :15},function(err,doc){
				doc = doc?JSON.stringify(doc):'';
				doc = encodeURIComponent(crypto.en_code(doc));
				app.res.setHeader('Set-Cookie',[collection_name+'='+doc+';'+session_option]);
				db.close();
				callback();
			});
		});
	},

	set : function(app,data,callback){
		if(!data && !!this.sid){
			var where = {'_id':OID(this.sid)};
			var option = {wtimeout:15, fsync:true, safe:true};
			db(dbname).open(function(err,db){
				db.collection(collection_name).findAndRemove(where, [['_id', 1]], option, function(err,doc){
				app.res.setHeader("Set-Cookie", [collection_name+'=']);
				db.close();
				callback();
				});
			});
		}else{
			if(!data || typeof data != 'object'){
				callback();
				return;
			}
			if(!this.sid){
				var where = data;
			}else{
				var where = {'_id':OID(this.sid)};
			}
			data.date = new Date().getTime();
			if(data.flash){
				var _flash = data.flash;
				delete data.flash;
			}
			var option = {upsert:true, new:true, wtimeout:15, fsync:true, safe:true};
			db(dbname).open(function(err,db){
				db.collection(collection_name).findAndModify(where,[['_id', 1]],data,option,function(err,doc){
					doc.flash = _flash;
					doc = JSON.stringify(doc);
					doc = encodeURIComponent(crypto.en_code(doc));
					app.res.setHeader("Set-Cookie", [collection_name+'='+doc]);
					db.close();
					callback();
				});
			});
		}
	},

	get : function(app){
		var cookies = parsecookie(app.req);
		if(!cookies[collection_name]){
			return '';
		}
		var session = crypto.de_code(decodeURIComponent(cookies[collection_name]));
		session = JSON.parse(session);
		return session;
	}
}

module.exports = session;