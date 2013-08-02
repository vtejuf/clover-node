
var app = require("./system/modules/clover.js");
var handle = require('./app/control/handle.js');
var me = require('./app/control/me.js');

app.get('/img',me.img);
app.get('/me/(:any)/(:any)',me.more);
app.get('/go',me.go);
app.get('/',handle.index);
app.get('/result',handle.result);
app.get('/search',handle.search);
app.get('/(:any)',me.index);

app.listen(app.cfg.port, app.cfg.host);