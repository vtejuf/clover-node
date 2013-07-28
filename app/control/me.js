var cfg = require('../config');
var crypto = require(cfg.root+'/system/modules/crypto.js');

function index (app){
	app.session.set(app,{'name':'newone','flash':'flashone'},function(){
		var session_info = app.session.get(app);
		console.log(session_info);
		app.tmpl(app.cfg.theme+'/index.ejs',{'name':'good one'});
	});
}

function go(app){
		var session_info = app.session.get(app);
		console.log(session_info);
		app.tmpl(app.cfg.theme+'/go.ejs',{'name':'good one'});
}

module.exports = {
	index : index,
	go : go
}