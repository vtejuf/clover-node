
var app = require("./system/modules/clover.js");
var handle = require('./app/control/handle.js');
var admin = require('./app/control/admin.js');
var me = require('./app/control/me.js');

app.get('/img',me.img);
app.get('/me/(:any)/(:any)',me.more);
app.get('/go',me.go);


app.post('/admin/user/(:any)',admin.user);
app.get('/admin/user',admin.user);
app.post('/admin/cats/(:any)',admin.cats);
app.get('/admin/cats',admin.cats);
app.post('/admin/parts/(:any)',admin.parts);
app.get('/admin/parts',admin.parts);

app.get('/admin/logout',admin.logout);
app.get('/admin/login',admin.login);
app.post('/admin/login',admin.login);
app.get('/admin',admin.index);

app.post('/fluorParts',handle.get_parts_flour);
app.get('/result/(:any)',handle.result);
app.post('/search',handle.search);
app.get('/',handle.index);
app.get('(:default)',me.notfonund);

app.listen(app.cfg.port, app.cfg.host);