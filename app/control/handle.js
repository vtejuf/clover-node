var parts_model = require('../model/parts_model.js');

function index (app){
	var query = app.querystring.parse(app.url.query);
	var type = /^[a-z0-9]{24}$/i.test(query.type)?query.type:'';
	parts_model.get_categorys(function(err,doc){
		var l = doc.length;
		l && app.tmpl(app.cfg.theme+'/index.ejs',{'cats':doc});
		!l && app.location(app,'/result'+app.url.search);
	},type);
}

function result (app){
	var query = app.querystring.parse(app.url.query);
	var type = /^[a-z0-9]{24}$/i.test(query.type)?query.type:'';
	var objectOrder = app.mender.objectOrder;
	parts_model.get_parts_by_category(function(err,doc){
		var samein = {};
		var brands = [];
		doc.forEach(function(s){
			var brand = s.brand;
			s.comment_info = parseInt(s.comment_info) || 0;
			if(!samein[brand]){
				samein[brand]=[];
			}
			samein[brand].push(s);
		});
		for (var i in samein){
			samein[i].sort(objectOrder('comment_info'));
			brands.push({'brand':i,'parts':samein[i]});
		}
		parts_model.get_position(function(err,doc){
			var type_name = doc.join('&nbsp;>&nbsp;');
			parts_model.get_categorys(function(err,doc){
				app.tmpl(app.cfg.theme+'/result.ejs',{'category':type_name,'brands':brands,'cats':doc,'search':0});
			});
		},type);
	},type);
}

function search(app){
	var key_str = app.postdata.query;
	key_str = '^[^\\n\\r]*'+key_str.replace(/\\/g,'\\\\').replace(/\//g,'\\/').replace(/\s+/g,'[^\\n\\r]*')+'[^\\n\\r]*$';
	var reg = new RegExp(key_str,'i');
	parts_model.parts_search(function(err,parts){
		parts_model.get_categorys(function(err,doc){
			parts.forEach(function(s){
				s.comment_info = parseInt(s.comment_info) || 0;
			});
			parts.sort(app.mender.objectOrder('comment_info'));
			app.tmpl(app.cfg.theme+'/result.ejs',{'query':app.postdata.query,'parts':parts,'cats':doc,'search':1});
		});
	},reg);
}

module.exports = {
	index : index,
	result : result,
	search : search
}