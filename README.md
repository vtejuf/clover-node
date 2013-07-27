clover-node
===========

一个简单的node web框架，模板直接使用html，html需要载入jquery以及jquery.tmpl插件，html通过{{tmpldata}}接收来自node tmpl()函数的数据,{{cfg.属性}}接收来自config文件的属性，如{{theme}}/css/styles.css;

simple node frame


<hr>



对象

clover对象<br/>
<code>
app = {<br/>
  get : function,  //监听get事件<br/>
  post : function  //监听post事件<br/>
}
</code>

server对象<br/>
<code>
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
</code>


<hr>



函数

路由<br/>
<code>
/js/server/router.js
</code>

控制器<br/>
<code>
/js/modules/handle.js<br/>
app.get('/',handle.index);
</code>

模板<br/>
<code>
/js/modules/tmpl.js<br/>
app.tmpl('/theme/me/index.html',{data : data});
</code>

session<br/>
<code>
/js/modules/sessions.js<br/>
app.session.get(app,function(session){});  //返回session 或 false<br/>
app.session.set(app,[{data : data}]);  //参数二[ 为空->新建session || 包含sid属性->更新session || 不包含sid属性->新建session并添加data属性到session]<br/>
app.session.remove(app,session_id)
</code>

mender<br/>
<code>
/js/modules/mender.js<br/>
app.mender.merge(obj,objCover,...);  <br/>
app.mender.dbDateSplit(r,collection);  参数r -> app.db().find(function(r){}) 回调函数的参数r; collection -> 查询的列
app.mender.arrUnique(arr);
</code>
<hr>


html页面<br/>
\<script src="/theme/me/include/js/mender.js" type="text/javascript" ></script><br/>
<code>
var tmpldata= mender.parsequery('{{tmpldata}}');	//接受后台tmpl()过来的data，并解析<br/>
</code>