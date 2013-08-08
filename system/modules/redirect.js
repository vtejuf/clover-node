var router = require('../server/router.js');

function redirect(app,to_link) {
	app.req.method = 'GET';
	var spt = to_link.indexOf('?');
	if(spt){
		var arr = to_link.split('?');
		app.url.search = '?'+arr[1];
		app.url.query = arr[1];
		app.url.pathname = arr[0];
		app.url.path = to_link;
		app.url.href = to_link;
	}else{
		app.url.pathname = to_link;
		app.url.path = to_link;
		app.url.href = to_link;
	}
	router(app);
}

module.exports = redirect;