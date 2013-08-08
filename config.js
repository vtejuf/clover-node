module.exports = {
	host : 'localhost',
	port : '3000',
	root : '/web/clover-node',
	theme : '/theme/newcar',
	dbhost : '127.0.0.1',
	dbport : '27017',
	dbname : 'cars',
	crypto_key:'vtejuf33clover',
	session : {
		name:'car_sessions',
		expires : 1800,//秒
		httponly : 'HttpOnly'//或留空
	}
}

