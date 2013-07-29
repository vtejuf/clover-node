
var fs = require('fs');
var statics = require('./static.js');
var posts = require('./posts.js');

function router(app){
	var method = app.req.method;
	var pathname = decodeURI(app.url.pathname);

	if(method === 'GET'){
		if(typeof app._get[pathname] === 'function'){
			if(app.cfg.session.active){
				app.session.init(app,function(){
					app._get[pathname](app);
				});
			}else{
				app._get[pathname](app);
			}
		}else{
			statics(app);
		}
	}else if(method === 'POST'){
		if(app.cfg.session.active){
			app.session.init(app,function(){
				posts(app);
			});
		}else{
			posts(app);
		}
	}

};

module.exports = router;
