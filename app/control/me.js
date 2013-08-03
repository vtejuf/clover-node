var cfg = require('../config');
var crypto = require(cfg.root+'/system/modules/crypto.js');
var fs = require('fs');

function index (app,arg1){
	console.log(arg1)
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

function img(app){
	var buffer = fs.readFile('/web/clover-node/app/control/1.jpg',function(err,data){
		console.log(buffer);
	});
}

function more(app,arg1,arg2){
	app.tmpl(app.cfg.theme+'/go.ejs',{'name':'good one'});
}

function notfonund(app){
	app.tmpl('/theme/newcar/404.html');
}

module.exports = {
	index : index,
	go : go,
	img : img,
	more : more,
	notfonund : notfonund
}