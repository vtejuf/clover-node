
var app = require("./system/modules/clover.js");
var handle = require('./app/control/handle.js');
var admin = require('./app/control/admin.js');
var me = require('./app/control/me.js');

app.get('/img',me.img);
app.get('/me/(:any)/(:any)',me.more);
app.get('/go',me.go);

app.post('/admin/del/(:any)',admin.del);
app.post('/admin/add/(:any)',admin.add);
app.post('/admin/edit_all/(:any)',admin.edit_all);
app.post('/admin/edit/(:any)',admin.edit);
app.post('/admin/add_user',admin.add_user);
app.get('/admin/user',admin.user);
app.get('/admin/cats',admin.cats);
app.get('/admin/goods',admin.goods);
app.get('/admin/login',admin.login);
app.post('/admin/login',admin.login);
app.get('/admin',admin.index);
app.get('/result',handle.result);
app.get('/search',handle.search);
app.get('/',handle.index);
app.get('(:default)',me.notfonund);

app.listen(app.cfg.port, app.cfg.host);