var parts_model = require('../model/parts_model.js');

function index (app){
	parts_model.get_cats_new(function(err,doc){
		doc.forEach(function(d){
			d.subcats.sort(app.mender.objectOrder);
		});
		app.tmpl(app.cfg.theme+'/index.ejs',{'cats':doc});
	});
	// var query = app.querystring.parse(app.url.query);
	// var type = /^[a-z0-9]{24}$/i.test(query.type)?query.type:'';
	// parts_model.get_categorys(function(err,doc){
	// 	var l = doc.length;
	// 	l && app.tmpl(app.cfg.theme+'/index.ejs',{'cats':doc});
	// 	!l && app.location(app,'/result'+app.url.search);
	// },type);
}

function result (app,query){
	// var query = app.querystring.parse(app.url.query);
	var type = /^[a-z0-9]{24}$/i.test(query)?query:'';
	var objectOrder = app.mender.objectOrder;
	parts_model.get_parts_by_category(function(err,parts){
		var brands = [];
		var from_sites=[];
		var sort_index = {};
		parts.forEach(function(s){
			s.brand = app.mender.trim(s.brand);
			s.from_site = app.mender.trim(s.from_site);
			brands.push(s.brand);
			from_sites.push(s.from_site);
			s.comment_info = parseInt(s.comment_info) || 0;
		});
		parts.sort(app.mender.objectOrder('comment_info'));
		brands = app.mender.arrUnique(brands);
		from_sites = app.mender.arrUnique(from_sites);
		for(var i in brands){
			sort_index[brands[i]] = 'brand'+i;
		}
		for(var j in from_sites){
			sort_index[from_sites[j]] = 'from_site'+j;
		}
		parts_model.get_position(function(err,doc){
			var type_name = doc.join('&nbsp;>&nbsp;');
			app.tmpl(app.cfg.theme+'/result.ejs',{'category':type_name,'parts':parts,'brands':brands,'from_sites':from_sites,'sort_index':sort_index,'search':0});
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