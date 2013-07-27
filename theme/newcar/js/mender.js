var mender = {
		
	parsequery : function(query){
		var arr= query.split('&');
		var i= 0,
			l= arr.length;
		var obj= {},
			cache= '';

		for (;i<l ;i++ )
		{
			var dish= arr[i].split('=');
			if(cache === dish[0]){
				if(typeof obj[dish[0]] === 'object' && obj[dish[0]].slice){
					var q = {};
					q[dish[0]] = dish[1];
					obj[dish[0]].push(q);
					continue;
				}else{
					var box= [];
					var o= {},
						n= {};
					o[cache] = obj[cache];
					n[cache] = dish[1];
					box.push(o,n);
					dish[1]=box;
				}
			}
			obj[dish[0]]=dish[1];
			cache = dish[0];
		}
		return obj;
	},

	makeTmplArr : function(obj){
		var exp = {};
		jQuery(exp).extend(exp,obj);
		for (var i in exp){
			var data = exp[i];
			if(typeof data === 'object' && data.slice){
			var arr = [];
			var l = exp[i].length;
			for (var j = 0;j<l ;j++ ){
				var o = {};
				o[i] = data[j];
				arr.push(o);
			}
			exp[i] = arr;
			}
		}
		return exp;
	}

};