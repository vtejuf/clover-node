
var _slice = [].slice;
var _unshift = [].unshift;

module.exports = function(app){
		var pathname = decodeURI(app.url.pathname);

		var _postdata ='';
		app.req.addListener('data',function(postdata){
			_postdata += postdata;
		});
		app.req.addListener('end',function(){
			_postdata = decodeURI(_postdata);
			app.postdata = app.querystring.parse(_postdata);
			// app._post[pathname](app);
			
			if(typeof app._post[pathname] === 'function'){
				app.session.init(app,function(){
					app._post[pathname](app);
				});
			}else{
				for(var key in app._post){
					reg_str = key.replace(/:any/gim,'[^.\/]+');
					var reg = new RegExp('^'+reg_str+'$');
					if(reg.test(pathname) && (typeof app._post[key] === 'function')){
						pathname.replace(reg,function(){
							var al = arguments.length;
							arguments = _slice.call(arguments,1,al-2);
							_unshift.call(arguments,app);
							var args = arguments;
							app.session.init(app,function(){
								app._post[key].apply({},args);
							});
						});
						break;
					}
				}
			}
			
		});

}