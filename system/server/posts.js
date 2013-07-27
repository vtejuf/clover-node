
module.exports = function(app){
		var pathname = decodeURI(app.url.pathname);

		var _postdata ='';
		app.req.addListener('data',function(postdata){
			_postdata += postdata;
		});
		app.req.addListener('end',function(){
			_postdata = decodeURI(_postdata);
			app.postdata = app.querystring.parse(_postdata);
			app._post[pathname](app);
		});

}