var admin_model = require('../model/admin_model.js');
var cfg = require('../../config.js');
var crypto = require(cfg.root+'/system/modules/crypto');
var header_path = cfg.root+cfg.theme+'/admin/header.ejs';

function index(app){
	var session_info = app.session.get(app);
	if(!session_info || +session_info.group !== 9){
		app.session.set(app,'',function(){
			app.location(app,'/admin/login');
		});
		return;
	}
	app.tmpl(app.cfg.theme+'/admin/admin.ejs',{filename:header_path});
}

function login(app){
	var session_info = app.session.get(app);
	if(session_info && session_info.loged){
		app.location(app,'/admin');
		return;
	}
	if(app.postdata){
		admin_model.login(function(err,item){
			if(item && app.postdata.pw === crypto.de_code(item.pw) && +item.group===9){
				item.loged = 1;
				app.session.set(app,item,function(){
					app.location(app,'/admin');
				});
			}else{
				app.location(app,'/admin');
			}
		},app.postdata);
	}else{
		app.tmpl(app.cfg.theme+'/admin/login.ejs',{filename:header_path});
	}
}

function cats(app,active){
	var session_info = app.session.get(app);
	if(!session_info || +session_info.group !== 9){
		app.session.set(app,'',function(){
			app.location(app,'/admin/login');
		});
		return;
	}
	if(active==='del'){
		del(app,'cats');
		return;
	}
	if(active==='add'){
		add(app,'cats');
		return;
	}
	if(active==='edit'){
		edit(app,'cats');
		return;
	}
	if(active==='edit_all'){
		edit_all(app,'cats');
		return;
	}
	if(active==='merge'){
		merge(app,'cats');
		return;
	}
	admin_model.get_categorys(function(err,doc){
		app.tmpl(app.cfg.theme+'/admin/cats.ejs',{filename:header_path,cats:doc});
	});
}

function parts(app,active){
	var session_info = app.session.get(app);
	if(!session_info || +session_info.group !== 9){
		app.session.set(app,'',function(){
			app.location(app,'/admin/login');
		});
		return;
	}
	if(active==='search'){
		app.postdata.query = app.mender.trim(app.postdata.query);
		admin_model.search_parts(function(err,data){
			data._id = data._id;
			data.auto_motive_id = data.auto_motive_id;
			data = JSON.stringify(data);
			app.send(data);
		},app.postdata.query);
		return;
	}
	if(active==='del'){
		del(app,'parts');
		return;
	}
	if(active==='add'){
		add(app,'parts');
		return;
	}
	if(active==='edit'){
		edit(app,'parts');
		return;
	}
	if(active==='edit_all'){
		edit_all(app,'parts');
		return;
	}
	app.tmpl(app.cfg.theme+'/admin/parts.ejs',{filename:header_path});
}

function user(app,active){
	var session_info = app.session.get(app);
	if(!session_info || +session_info.group !== 9){
		app.session.set(app,'',function(){
			app.location(app,'/admin/login');
		});
		return;
	}
	if(active==='add'){
		app.postdata.pw = crypto.en_code(app.postdata.pw);
		admin_model.add_user(function(err,doc){
			app.location(app,'/admin/user');
		},app.postdata);
		return;
	}
	admin_model.user_list(function(err,doc){
		app.tmpl(app.cfg.theme+'/admin/user.ejs',{filename:header_path,user_list:doc});
	});
}

function edit(app,type){
	var data = app.postdata;
	admin_model.edit_one(function(err,doc){
		if(doc){
			app.location(app,'/admin/'+type);
		}
	},type,data);
}

function add(app,type){
	var data = app.postdata;
	admin_model.add_one(function(err,doc){
		if(doc){
			app.location(app,'/admin/'+type);
		}
	},type,data);
}

function del(app,type){
	var data = app.postdata;
	var id = data.ids.split(',');
	id.forEach(function(s){
		var data = {'_id':s};
		admin_model.delete_one(function(err,doc){
			app.location(app,'/admin/'+type);
		},type,data);
	});
}

function edit_all(app,type){
	var data = app.postdata;
	var id = data.ids.split(',');
	delete data.ids;
	id.forEach(function(s){
		data._id = s;
		admin_model.edit_one(function(err,doc){},type,data);
	});
	app.location(app,'/admin/'+type);
}

function merge(app,type){
	var ids = app.postdata.ids;
	admin_model.cats_merge(function(){
		app.location(app,'/admin/'+type);
	},type,ids);
}

function logout(app){
	app.session.set(app,'',function(){
		app.location(app,'/admin/login');
	});
	return;
}

module.exports = {
	index : index,
	login : login,
	cats : cats,
	parts : parts,
	user : user,
	logout : logout
}