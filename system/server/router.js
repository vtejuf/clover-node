
var fs = require('fs');
var statics = require('./static.js');
var posts = require('./posts.js');

var _slice = [].slice;
var _unshift = [].unshift;

function router(app){
	var method = app.req.method;
	var pathname = decodeURI(app.url.pathname);
	pathname = (pathname.length>1 && pathname.slice(-1)==='/')?pathname.slice(0,-1):pathname;

	if(method === 'GET'){
		if(typeof app._get[pathname] === 'function'){
			app.session.init(app,function(){
				app._get[pathname](app);
			});
		}else if(pathname.indexOf('.')>0){
			statics(app);
		}else{
			for(var key in app._get){
				reg_str = key.replace(/:any/gim,'[^.\/]*');
				var reg = new RegExp('^'+reg_str+'$');
				if(reg.test(pathname) && (typeof app._get[key] === 'function')){
					pathname.replace(reg,function(){
						var al = arguments.length;
						arguments = _slice.call(arguments,1,al-2);
						_unshift.call(arguments,app);
						var args = arguments;
						app.session.init(app,function(){
							app._get[key].apply({},args);
						});
					});
					break;
				}else{
					app._get['(:default)'](app);
				}
			}
		}
	}else if(method === 'POST'){
		posts(app);
		// app.session.init(app,function(){
			// posts(app);
		// });
	}
};

module.exports = router;
