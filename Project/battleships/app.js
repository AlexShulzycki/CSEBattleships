var express = require("express");
var http = require("http");
var indexRouter = require("./routes/index");
var port = process.argv[2];
var app = express();
var websocket = require("ws");
var Game = require("./game.js");


app.use(express.static(__dirname + "/public"));
var server = http.createServer(app);

//routers
app.get("/*", indexRouter);


//websockets, eg game logic
const wss = new websocket.Server({server});

wss.on("connection",function(){
  console.log("connection established");
});


server.listen(port);

var game1 = new Game([0,1]);
console.log(game1.boards[0][0][0]);
