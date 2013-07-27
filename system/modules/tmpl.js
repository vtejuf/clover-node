
var fs = require('fs');
var ejs = require("ejs");

module.exports = function (file,data){
	var _self = this;
	var cfg = _self.cfg;
	var str = fs.readFileSync(cfg.root+file, 'utf8');
	var ret = ejs.render(str,data);

	var reg = /{{(.+)}}/gim;
	ret = ret.replace(reg,function(all,letter){
		var post='';
		post = cfg[letter]?
		cfg[letter]:
		post;
		return post;
	});
	_self.res.write(ret);
	_self.res.end();
}