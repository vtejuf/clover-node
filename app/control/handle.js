var parts_model = require('../model/parts_model.js');

function index (app){
	var query = app.querystring.parse(app.url.query);
	var type = query.type?query.type:'';
	parts_model.get_categorys(function(err,doc){
		var l = doc.length;
		l && app.tmpl(app.cfg.theme+'/index.ejs',{'cats':doc});
		!l && app.redirect(app,'/result'+app.url.search);
	},type);
}

function result (app){
	var query = app.querystring.parse(app.url.query);
	var type = query.type?query.type:'';
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

// function search(app){
// 	var query = app.querystring.parse(app.url.query);
// 	query = query.query?query.query:'';
// 	var ql = query.toLowerCase();
// 	var type='';
// 	parts_model.get_brand('',function(err,doc){
// 		doc.forEach(function(s){
// 			var sl = s.toLowerCase();
// 			var sata = sl.indexOf(ql);
// 			if(sata!==-1 && type===''){
// 				type=s;
// 			}
// 		});
// 		parts_model.get_parts_by_brand(type,function(err,re){
// 			var samein ={};
// 			re.forEach(function(one){
// 				one.comment_info = parseInt(one.comment_info) || 0;
// 				if(!samein[one.category]){
// 					samein[one.category] = [];
// 				}
// 				samein[one.category].push(one);
// 			});
// 			var types=[];
// 			for (var i in samein){
// 				samein[i].sort(app.mender.createComparsionFunction('comment_info'));
// 				types.push({'type':i,'parts':samein[i]});
// 			}
// 			parts_model.get_categorys(function(err,doc){
// 				var categorys = _get_categorys(app,doc);
// 				app.tmpl(app.cfg.theme+'/result.ejs',{'types':types,'brand':type,'categorys':categorys,'search':1});
// 			});
// 		});
// 	});
// }

module.exports = {
	index : index,
	result : result,
	// search : search
}