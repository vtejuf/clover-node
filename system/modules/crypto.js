var crypto = require('crypto');
var cfg = require('config.js');

var key = cfg.crypto_key;
var code = 'aes256';

function cryptor(){}
cryptor.prototype = {
	en_code : en_code,
	de_code : de_code,
	hash : hash,
	hmac : hmac,
	credentials : credentials,
	sign : sign,
	verify : verify
}

function en_code(data){
	if(!data)return;
	var cipher = crypto.createCipher(code, key);
	var endata = cipher.update(data,'utf8','base64');
	endata += cipher.final('base64');
	return endata;
}
function de_code(data){
	if(!data)return;
	var decipher = crypto.createDecipher(code, key);
	var dedata = decipher.update(data,'base64','utf8');
	dedata += decipher.final('utf8');
	return dedata;
}

function hash(algorithm,data){
	if(!algorithm && !data)return;
	var hash  = crypto.createHash(algorithm);
	hash.update(data);
	return hash.digest('base64');
}

function hmac(algorithm,key,data){
	if(!algorithm && !key && !data)return;
	var hmac  = crypto.createHmac(algorithm,key);
	hmac.update(data);
	return hmac.digest('base64');
}

function credentials(details){
	if(!details)return;
	return crypto.createCredentials(details);
}

function sign(algorithm,private_key,data,output_format){
	if(!algorithm && !private_key && !data)return;
	output_format = output_format || 'base64';
	var signer = crypto.createSign(algorithm);
	signer.update(data);
	return signer.sign(private_key, output_format);
}
function verify(algorithm,public_key,signature,data,signature_format){
	if(!algorithm && !public_key && !signature && !data)return;
	signature_format = signature_format || 'base64';
	var verifier = crypto.createVerify(algorithm);
	verifier.update(data);
	return verifier.verify(public_key, signature, signature_format);
}

module.exports = new cryptor();