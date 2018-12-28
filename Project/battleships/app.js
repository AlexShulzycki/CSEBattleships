var express = require("express");
var http = require("http");
var indexRouter = require("./routes/index");
var port = process.argv[2];
var app = express();
var websocket = require("ws");
var Game = require("./game");
var gameManager = require("./gameManager");


app.use(express.static(__dirname + "/public"));
var server = http.createServer(app);

//routers
app.get("/*", indexRouter);


//websockets, eg game logic
const wss = new websocket.Server({
	server
});

var connectID = 0;

wss.on("connection", function(ws) {
	console.log("connection established");
	ws.id = connectID++;

	//messaging
	ws.on("message", function(msg) {
		gameManager.manage(ws, msg);
});

	ws.on("close", function(cls){
		console.log(cls+" ID "+ws.id+" disconnected..");
		gameManager.end(ws);
	});
});

//turn on the server!!
server.listen(port);

//testing
