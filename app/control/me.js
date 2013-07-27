
function index (app){
	app.session.set(app,{'name':'newone'},function(){
		var session_info = app.session.get(app);
		app.session.flash(app,{'ff':'just one'});
		console.log(app.session.get(app));
		app.tmpl(app.cfg.theme+'/index.ejs',{'name':'good one'});
	});
}

module.exports = {
	index : index
}