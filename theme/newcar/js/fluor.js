/**
*瀑布流 fluor
*作者 尹昱 vtejuf@126.com
*
*@param str jquery选择器 监听的对象，到顶部的距离小于一屏触发
*@param json {times,url,type,dataType,data,callback}
*			times 运行的次数 times=3 运行3次后停止，0持续运行
*			callback 回调函数，成功或失败都执行此函数
*			其他参数参考jquery.ajax
*
*fluor.listen('#selector',{
	times:2,
	url:'target.php',
	type:'post',
	dataType:'json',
	data:{name:'fluor'},
	callback:callback
});
*/

var fluor={};

fluor.das=0;
fluor.sending=true;
fluor.output=null;
fluor.prefunc = null;

fluor.listen=function(selector,option,prefunc){
	var _self = fluor;
	this.prefunc = prefunc;
	this.output = option.callback;
	this.sent(option);
	_self.das++;
	$(window).scroll( function() {
		if(_self.sending){
			return false;
		}
		//option.data.lid = $('#guest-list li:visible').length;
		//其他需要传递的值，添加到data
		var scrtop = $('body').scrollTop();
		var top = $(selector).position().top;
		var wh = (window.innerHeight)?window.innerHeight:document.body.clientHeight;
		if(top-wh<scrtop){
			fluor.sending = true;
			if(_self.das%(option.times)===0){
				return false;
			}
			_self.sent(option);
			_self.das++;
		}
	});
}

fluor.sent=function(option){
	fluor.prefunc(option);
	var send = {
		url:option.url,
		type:option.type,
		data:option.data,
		dataType:option.dataType,
		success:this.callback,
		error:this.callback
	}
	if(option.type==='get'){
		delete send.data
	}
	$.ajax(send);
}

fluor.callback = function(a1,a2,a3){
	fluor.output(a1,a2,a3);
	fluor.sending = false;
}