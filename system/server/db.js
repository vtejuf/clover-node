var mongo=require('mongodb/lib/mongodb');
var cfg=require('config.js');

var Db = mongo.Db,
    Server = mongo.Server;
    // MongoClient = mongo.MongoClient,
    // ReplSetServers = mongo.ReplSetServers,
    // ObjectID = mongo.ObjectID,
    // Binary = mongo.Binary,
    // GridStore = mongo.GridStore,
    // Grid = mongo.Grid,
    // Code = mongo.Code,
    // BSON = mongo.pure().BSON,
    // assert = require('assert');

function db(str){
	var dbhost = (/^(http:\/\/)?localhost\/?$/i.test(cfg.dbhost))?'127.0.0.1':cfg.dbhost;
	var dbport = cfg.dbport;
	var dbname = str?str:cfg.dbname;

	var db = new Db(dbname, new Server(dbhost, dbport),{w:1});
	return db;
}
db.prototype.supply = {
    MongoClient : mongo.MongoClient,
    ReplSetServers : mongo.ReplSetServers,
    ObjectID : mongo.ObjectID,
    Binary : mongo.Binary,
    GridStore : mongo.GridStore,
    Grid : mongo.Grid,
    Code : mongo.Code,
    BSON : mongo.pure().BSON
}

module.exports = db;

// module.exports = {
// 	Db : mongo.Db,
//     MongoClient : mongo.MongoClient,
//     Server : mongo.Server,
//     ReplSetServers : mongo.ReplSetServers,
//     ObjectID : mongo.ObjectID,
//     Binary : mongo.Binary,
//     GridStore : mongo.GridStore,
//     Grid : mongo.Grid,
//     Code : mongo.Code,
//     BSON : mongo.pure().BSON,
//     assert : mongo
// }