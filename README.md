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
<h4>app.get</h4>
<h4>app.post</h4>
<h4>app.listen</h4>
<p>控制器 handle.js里的app对象</p>
<h4>app.cfg</h4>
<p>调用config.js</p>
<h4>app.tmpl</h4>
<pre>
  app.tmpl('index.ejs',{name:'clover-node'});
</pre>
<h4>app.session</h4>
<pre>
app.session.set(app,data,callback);

@param 
data：一个json对象，data.flash 只有下一次请求时有效
</pre>
<pre>
  app.session.set(app,{name:'clover-node'},function(){
    app.tmpl('index.ejs');
  });
</pre>
<pre>
app.session.get(app);

@return
json对象
</pre>
<pre>
  var session_info = app.session.get(app);
</pre>
<h4>app.redirect</h4>
<h4>app.parsecookie</h4>
<h4>app.querystring</h4>
<hr>
<h2>crypto</h2>
<hr>
<h2>db</h2>
<hr>
<h2>ejs</h2>
{{cfg.属性}}接收来自config文件的属性，如{{theme}}/css/styles.css;

对象

clover对象<br/>

app = {<br/>
  get : function,  //监听get事件<br/>
  post : function  //监听post事件<br/>
}


server对象<br/>

app = {<br/>
  cfg : {<br/>
    host : 'localhost',  //主机名，127.0.0.1<br/>
    port : '3000',    //端口<br/>
    root : '/clover-node',  //网站根目录<br/>
    theme : '/theme/mm'    //模板目录<br/>
    dbhost : 'mm'    //数据库<br/>
    notfound : '/404.html' //404页面<br/>
    sessionCfg : { //session配置对象<br/>
        collection : 'mm.session',  //表名<br/>
        secret : 'clover',  <br/>
        expires : 'Wed, 13-Jan-2021 22:23:01 GMT',<br/>
        httponly : 'HttpOnly'<br/>
        }<br/>
  },<br/>
  req : request,  //node request对象<br/>
  res : response,  //node response对象<br/>
  tmpl : function,  //模板函数<br/>
  session : {<br/>
    get : function,  //get session<br/>
    set : function,  //set session<br/>
    remove : function  //remove session<br/>
  },<br/>
  mender : {<br/>
    merge : function  //合并对象<br/>
    dbDataSplit : function  //返回查询的指定列的值,{name : [数组]}<br/>
    arrUnique : function  //返回一个去重数组<br/>
  },<br/>
  db : {},//mongous对象<br/>
  parsecookie : {},  //node parsecookie<br/>
  querystring : {}  //node querystring<br/>
}



<hr>



函数

路由<br/>

/js/server/router.js


控制器<br/>

/js/modules/handle.js<br/>
app.get('/',handle.index);


模板<br/>

/js/modules/tmpl.js<br/>
app.tmpl('/theme/me/index.html',{data : data});


session<br/>

/js/modules/sessions.js<br/>
app.session.get(app,function(session){});  //返回session 或 false<br/>
app.session.set(app,[{data : data}]);  //参数二[ 为空->新建session || 包含sid属性->更新session || 不包含sid属性->新建session并添加data属性到session]<br/>
app.session.remove(app,session_id)


mender<br/>

/js/modules/mender.js<br/>
app.mender.merge(obj,objCover,...);  <br/>
app.mender.dbDateSplit(r,collection);  参数r -> app.db().find(function(r){}) 回调函数的参数r; collection -> 查询的列
app.mender.arrUnique(arr);

<hr>


html页面<br/>
\<script src="/theme/me/include/js/mender.js" type="text/javascript" ></script><br/>

var tmpldata= mender.parsequery('{{tmpldata}}');  //接受后台tmpl()过来的data，并解析<br/>
