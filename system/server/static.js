
var fs = require('fs');
var path = require('path');
var mime = require('./mime.js'); 

module.exports = function(app){

	var pathname = decodeURI(app.url.pathname);
	var filepath = app.cfg.root + pathname;

    fs.exists(filepath, function(exists){  
        exists?
			function(){
				var ext = path.extname(pathname).slice(1);
				var mimetype = mime[ext]?mime[ext]:'text/plain';
				app.res.writeHeader(200,{'Content-type': mimetype});
				fs.createReadStream(filepath).pipe(app.res);
		}(): 
			function(){
				app.res.writeHeader(404);
				app.res.end();
		}();  
    });  


}