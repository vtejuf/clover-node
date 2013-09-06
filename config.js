module.exports = {
	host : 'localhost',
	port : '3000',
	root : '/web/clover-node',
	theme : '/theme/newcar',
	dbhost : 'localhost',
	dbport : '27017',
	dbname : 'cars',
	crypto_key:'vtejuf33clover',
	session : {
		name:'car_sessions',
		expires : 1800,//秒
		httponly : 'HttpOnly'//或留空
	},

	//页面
	webname:'黄师傅-汽车用品速查网',
	web_key_words:'最便宜的汽车用品比价,快速购买,汽车用品详情查询比较'
}

