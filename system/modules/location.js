
function location(app,to_link) {
	var str = "<script type='text/javascript'>window.location.href='"+to_link+"';</script>";
	app.res.end(str);
}

module.exports = location;