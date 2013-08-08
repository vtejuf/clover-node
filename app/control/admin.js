var admin_model = require('../model/admin_model.js');
var cfg = require('../../config.js');
var header_path = cfg.root+cfg.theme+'/admin/header.ejs';

function index(app){
	var session_info = app.session.get(app);
	if(!session_info || +session_info.group !== 9){
		app.location(app,'/admin/login');
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
			if(item){
				item.loged = 1;
				app.session.set(app,item,function(){
					app.location(app,'/admin');
				});
			}
		},app.postdata);
	}else{
		app.tmpl(app.cfg.theme+'/admin/login.ejs',{filename:header_path});
	}
	//app.redirect(app,'/admin');
}

function cats(app){
	var session_info = app.session.get(app);
	if(!session_info || +session_info.group !== 9){
		app.location(app,'/admin/login');
		return;
	}
	admin_model.get_categorys(function(err,doc){
		app.tmpl(app.cfg.theme+'/admin/cats.ejs',{filename:header_path,cats:doc});
	});
}

function goods(app){
	var session_info = app.session.get(app);
	if(!session_info || +session_info.group !== 9){
		app.location(app,'/admin/login');
		return;
	}
	app.tmpl(app.cfg.theme+'/admin/goods.ejs',{filename:header_path});
}

function user(app){
	var session_info = app.session.get(app);
	if(!session_info || +session_info.group !== 9){
		app.location(app,'/admin/login');
		return;
	}
	admin_model.user_list(function(err,doc){
		app.tmpl(app.cfg.theme+'/admin/user.ejs',{filename:header_path,user_list:doc});
	});
}

function add_user(app){
	var session_info = app.session.get(app);
	if(!session_info || +session_info.group !== 9){
		app.location(app,'/admin/login');
		return;
	}
	admin_model.add_user(function(err,doc){
		app.location(app,'/admin/user');
	},app.postdata);
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
		admin_model.delete_one(function(err,doc){},type,data);
	});
	app.location(app,'/admin/'+type);
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

module.exports = {
	index : index,
	login : login,
	cats : cats,
	goods : goods,
	user : user,
	add_user : add_user,
	edit : edit,
	add : add,
	del : del,
	edit_all : edit_all
}