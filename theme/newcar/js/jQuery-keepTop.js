/*
*	±£³ÖÔªËØÔÚ¶¥²¿»òÕß×î×ó²à
*
*	option		²ÎÊýÊÇÒ»¸ö¶ÔÏó {[top:140,][left:100]} ÖµÖÁÉÙÎª1
*				°üº¬Ò»¸ö±ØÑ¡Ïî£¬Ò»¸ö¿ÉÑ¡Ïî top,left 
*				ÖÁÉÙÐ´Ò»¸ö£¬¶ÔÓ¦·½Ïò¹Ì¶¨£¬Á½¸ö¶¼Ð´£¬ÔòÁ½¸ö·½ÏòÂú×ãÒ»¸ö¾Í¹Ì¶¨
*
*	jQuery('#tables').keepTop({top:1}); //¶¥²¿¹Ì¶¨
*/


$.fn.keepTop = function(option){
	option= option || {top:0};

	this.each(function(){
		var _self = $(this);
		option.leftmove = option.left && option.left!=='' ?true:false;
		option.topmove = option.top && option.top!=='' ?true:false;

		$(window).scroll(function(){
			
			var scrtop = $('html').scrollTop();
			var scrleft = $('html').scrollLeft();
			option.pos = (option.topmove && !option.leftmove)?'top':(option.leftmove && !option.topmove)?'left':'both';

			if(option.pos === 'both'){
				(scrtop > option.top) && (scrleft > option.left)?
					function(){
					var state = _self.css('position');
					!!state?
						function(){
						_self.offset({top:scrtop,left:scrleft});
					}():
						function(){
						_self.css({'position':'absolute'});
					}();
				}():
					function(){
						_self.css({'position':'static',top:'',left:''});
				}();
			}else if(option.pos === 'top'){
				scrtop > option.top?
					function(){
					var state = _self.css('position');
					!!state?
						function(){
						_self.offset({top:scrtop});
					}():
						function(){
						_self.css({'position':'absolute'});
					}();
				}():
					function(){
						_self.css({'position':'static',top:''});
				}();
			}else if(option.pos === 'left'){
				scrleft > option.left?
					function(){
					var state = _self.css('position');
					!!state?
						function(){
						_self.offset({left:scrleft});
					}():
						function(){
						_self.css({'position':'absolute'});
					}();
				}():
					function(){
						_self.css({'position':'static',left:''});
				}();
			}
		});
	});
}