var http = require('http');
var url = require('url');
var cfg = require('config.js');
var tmpl = require('./tmpl.js');
var router = require('../server/router.js');
var mender = require("./mender.js");
var redirect = require("./redirect.js");
var session = require('./sessions.js');
var parsecookie = require('./cookies.js');
var querystring = require('querystring');

function clover(req,res){
	this.req = req;
	this.res = res;
	this.url = url.parse(req.url);
};
clover.prototype.cfg = cfg;
clover.prototype.tmpl = tmpl;
clover.prototype._get = clover.prototype._get || {};
clover.prototype._post = clover.prototype._post || {};
clover.prototype.session = session;
clover.prototype.mender = mender;
clover.prototype.redirect = redirect;
clover.prototype.parsecookie = parsecookie;
clover.prototype.querystring = querystring;

function _server(req,res){
	var app = new clover(req,res);
	router(app);
}
var server = http.createServer(_server);

server.tmpl = clover.prototype.tmpl;
server.cfg = cfg;

server.get = function(pathname,handle){
	clover.prototype._get[pathname] = handle;
};
server.post = function(pathname,handle){
	clover.prototype._post[pathname] = handle;
};


module.exports = server;