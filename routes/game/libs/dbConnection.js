/* 데이터 베이스 설정 */
//var mongojs = require("mongojs");
//mongojs('localhost:3000/game', ['account','progress']);
var DATABASE = null;

var isValidPassword = function(data,cb){
	return cb(true);
	 DATABASE.account.find({username:data.username,password:data.password},function(err,res){
		if(res.length > 0)
			cb(true);
		else
			cb(false);
	});
}
var isUsernameTaken = function(data,cb){
	return cb(false);
	 DATABASE.account.find({username:data.username},function(err,res){
		if(res.length > 0)
			cb(true);
		else
			cb(false);
	});
}
var addUser = function(data,cb){
	return cb();
	 DATABASE.account.insert({username:data.username,password:data.password},function(err){
		cb();
	});
}
