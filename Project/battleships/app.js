var express = require("express");
var http = require("http");
var indexRouter = require("./routes/index");
var port = process.argv[2];
var app = express();
var websocket = require("ws");


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

var gameMap;

function Game(players){
  this.players = players;
  this.state = "init";
  var tempboard =[[],[]];
  for(var x = 0; x < 20; x++){
    var temprow = [];
    for(var y = 0; y<10; y++){
      temprow.push("water");
    }

    if(x<10){
      tempboard[0].push(temprow);
    }else{
      tempboard[1].push(temprow);
    }

  }
  this.board = tempboard;
}

//test
var game = new Game("none");
console.log(game.board[0][9].length);
