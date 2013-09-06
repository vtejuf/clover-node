<h2>clover-node</h2>
<p>
nodejs框架，帮助用户使用nodejs快速建站，简单、易用、快速开发<br/>
页面使用ejs模板引擎：<i>ejs api</i>:<i>https://github.com/visionmedia/ejs</i><br/>
数据库使用mongodb：<i>mongodb api</i>:<i>http://mongodb.github.io/node-mongodb-native/contents.html#node-js-mongodb-driver-manual-contents</i>
</p>
<hr>
<p>
使用clover-node，需要包含config.js和/system文件夹下的所有文件。<hr>
新建一个主入口文件，app.js<br/>
<pre>
//app.js
var app = require("./system/modules/clover.js");
app.listen(app.cfg.port, app.cfg.host);
</pre>
新建一个应用文件夹app，在app文件夹下新建一个控制器文件handle.js，
<pre>
//handle.js

//函数的第一个参数是当前请求对象
function index(app){
    console.log(app);
}
exports.index=index;
</pre>
在app.js中添加控制器和路由
<pre>
//app.js
var app = require("./system/modules/clover.js");
var handle = require('./app/handle.js');//控制器

app.get('/',handle.index);//路由，把根目录路由到handle控制器的index方法

app.listen(app.cfg.port, app.cfg.host);
</pre>
到此一个基本的nodejs服务器就建好了，$ node app开启服务器。
</p>

<hr>
<h2>配置项 config.js</h2>
<pre>
  host : 'localhost',
  port : '3000',
  root : '/web/clover-node',
  theme : '/theme/me',
  dbhost : '127.0.0.1',
  dbport : '27017',
  dbname : 'cars',
  crypto_key:'vtejuf33clover',
  // session : {
  //  name:'car_sessions',
  //  expires : 1800,//秒
  //  httponly : 'HttpOnly'//或留空
  // }
</pre>
配置项属性可以通过app.cfg调用
<hr>
<h2>app</h2>
<p>主入口文件 app.js里的app对象</p>
<h4>app.cfg</h4>
<p>调用config.js</p>
<h4>app.get</h4>
<pre>
app.get(path,handle);

@param
    path：路由路径
    handle：处理函数，函数参数(app,[arg1,arg2,...]);

app.get('/version/(:any)/(:any)',handle.version);//version(app,any1,any2);
app.get('/name',handle.clover);//clover(app);
app.get('(:default)',handle.page_not_found);//clover(app);
</pre>
app.get(/(:any),func);路径中所有的(:any)都作为操作函数的参数，从第二个参数开始
<h4>app.post</h4>
<pre>
app.post('/post',post);//post(app); post的值保存在app.postdata里
</pre>
<h4>app.listen</h4>
<pre>app.listen(app.cfg.port, app.cfg.host);</pre>
<p>控制器 handle.js里的app对象</p>
<h4>app.cfg</h4>
<p>调用config.js</p>
<h4>app.tmpl</h4>
<pre>
  app.tmpl('index.ejs',{name:'clover-node'});
</pre>
<h4>app.session</h4>
取消config.js中session的注释，开启session功能
<pre>
  session : {
    name:'car_sessions',//session名称，数据库必须有相同名称的collection
    expires : 1800,//单位秒
    httponly : 'HttpOnly'//或''
  }
</pre>
<pre>
app.session.set(app,data,callback);

@param
    app:clover-node的app请求对象
    data：新增或更新session，参数为一个对象，data.flash 只有下一次请求时有效；删除session，参数为空字符串;
    callback

app.session.set(app,{name:'clover-node'},function(){
  app.tmpl('index.ejs');
});
</pre>
<pre>
app.session.get(app);

@return  对象

var session_info = app.session.get(app);
</pre>
<h4>app.redirect</h4>
请求转移，页面不跳转
<pre>
app.redirect(app,url);

@param
    app:clover-node的app请求对象
    url:跳转的地址

app.redirect(app,'/redirect?q=somequery');
</pre>
<h4>app.location</h4>
页面跳转
<pre>
app.location(app,url);

@param
    app:clover-node的app请求对象
    url:跳转的地址

app.location(app,'/location?q=somequery');
</pre>
<h4>app.send</h4>
发送字符串到前端
<pre>
app.send(string,[string]);

@param
    string:发送的字符串
@param
    string:发送后是否结束本次请求,['end'|1]
 
app.send('{"success":1}','end');//带'end'，请求结束
app.send('{"success":1}');//不带'end'，请求继续
app.location('{"success":1}');
</pre>
<h4>app.parsecookie</h4>
解析当前所有cookie
<pre>
app.parsecookie(req);

@param
    req：请求的request，app.req
@return
    对象

var cookies = app.parsecookie(app.req);
</pre>
<h4>app.querystring</h4>
nodejs的querystring函数
<h4>app.mender</h4>
其他处理函数
<pre>
app.mender.merge(obj1,obj2,obj3,....);
//合并对象
@param
    多个对象

app.mender.arrUnique(arr);
//数组去重
@param
    数组

app.mender.trim(str);
//字符串去首尾空格
@param
    字符串

app.mender.objectOrder(propertyName);
//[].sort的参数函数
@param
    排序的属性名

</pre>
<hr>
<h2>crypto</h2>
config.js中的crypto_key为加密的key
<pre>
var cfg = require('./config');
var crypto = require(cfg.root+'/system/modules/crypto.js');

crypto.en_code(data);//返回base64
crypto.de_code(data);//返回base64

//以下函数参数，参考nodejs的crypto函数
hash(algorithm,data);//返回base64
hmac(algorithm,key,data);//返回base64
credentials(details);
sign(algorithm,private_key,data,output_format);
verify(algorithm,public_key,signature,data,signature_format);
</pre>
<hr>
<h2>db</h2>
<pre>
var cfg = require('./config');
var db = require(cfg.root+'/system/server/db.js');

db(cfg.dbname).open(function(err,db){
  db.collection('your_collection').find(...).toArray(function(err,doc){
    db.close();
  });
});
</pre>
数据库操作，参考<i>mongodb api</i>:<i>http://mongodb.github.io/node-mongodb-native/contents.html#node-js-mongodb-driver-manual-contents</i>
<hr>
<h2>模板文件ejs</h2>
可以用两个花括号包围config.js的属性名调用config属性值。{{root}}网站根目录。<br>
其他模板文件写法，参考<i>ejs api</i>:<i>https://github.com/visionmedia/ejs</i>
