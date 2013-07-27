$(document).ready(function(){

	$('.search-title').length > 0 && $('.search-title').keepTop({top:170});

	$('.removeDom').remove();

	$(".result-list").delegate('.makes','click',function(){
		var tableNow = $(this).siblings('table');
		if(tableNow.hasClass('current')){
			tableNow.removeClass('current');
			return false;
		}
		if(tableNow.children('tr').length === 1 || tableNow.children('tbody').children('tr').length === 1){
			//$(this).siblings('table').addClass('current').parent().siblings().find('table.current').removeClass('current');
			var _self = this;
			var name = $(this).text();
			$.get('/result',{table:name},function(data){
				var tmpldata = $.parseJSON(data);
				var brand = "<tr><td class='td-first'><strong>${name}</strong></td><td>${argument}</td><td>${price}</td><td>${incoming}</td></tr>";
				$.template( "brand", brand );
				$.tmpl( "brand", tmpldata ).appendTo( tableNow );
			});
		}
		tableNow.addClass('current');
	});

	$(window).scroll(function(){
		$('html,body').scrollTop() >= 170?
			function(){
			$(".go-top").show();
		}():
			function(){
			$(".go-top").hide();
		}();
	});

	$(".go-top").bind('click',function(){
		$('html,body').animate({scrollTop: '0px'}, 800);
	});


});
