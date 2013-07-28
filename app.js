
var app = require("./system/modules/clover.js");
var handle = require('./app/control/handle.js');
var me = require('./app/control/me.js');

app.get('/me',me.index);
app.get('/go',me.go);
app.get('/',handle.index);
app.get('/result',handle.result);
app.get('/search',handle.search);

app.listen(app.cfg.port, app.cfg.host);