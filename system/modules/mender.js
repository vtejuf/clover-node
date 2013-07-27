
var querystring = require('querystring');

module.exports = {

	merge : function(){
		var l= arguments.length;
		var out= arguments[--l],
			inp= arguments[l-1];

		for(var i in out){
			inp[i]= out[i];
		}

		if(l-1==0){
			return inp;
		}

		var ar= [],
			_slice= ar.slice;
		var n= _slice.call(arguments,0,l);

		inp= merge.apply(null,n);
		return inp;
	},
	
	dbDataSplit : function(r,collection){
		var data = [],
			obj = {};
		r.documents.forEach(function(s){
			data.push(s[collection]);
		});
		obj[collection] = data;
		return obj;
	},

	arrUnique : function(arr) {
		var res = [], hash = {};
		for(var i=0, elem; (elem = arr[i]) != null; i++)  {
			if (!hash[elem])
			{
				res.push(elem);
				hash[elem] = true;
			}
		}
		return res;
	},

	trim : function(str){
		return str.replace(/(^\s*)|(\s*$)/g, "");
	},

	objectOrder : function(propertyName){
		return function(object1, object2){
			var value1 = object1[propertyName];
			var value2 = object2[propertyName];
			if (value1 > value2){
				return -1;
			} else if (value1 < value2){
				return 1;
			} else{
				return 0;
			}
		}
	}
}