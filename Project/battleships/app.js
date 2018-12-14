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
const wss = new websocket.Server({ server });

wss.on("connection",function(ws){
  console.log("connection established");
  ws.on("message",function(msg){
    console.log(msg);
  });
  ws.send("something");
});

//turn on the server!!
server.listen(port);

//testing
gameManager.manage(1,"0");
gameManager.manage(0,"0");
//console.log(gameManager.gameList);
console.log(gameManager.manage(0,"1 0004"));

console.log(gameManager.manage(1,"2 00"));
//console.log(gameManager.gameList[0].boards[0]);
