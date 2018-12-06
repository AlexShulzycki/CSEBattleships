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
  this.idBoard = new Map();
  this.idBoard.set(players[0],this.boards[0]);
  this.idBoard.set(players[1],this.boards[1]);
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
  this.boards = tempboard;
}
//helper functions
//switch pair of coordinate pairs
game.switch(a,b,index){
    var temp = a[index];
    a[index] = b[index];
    b[index] = temp;
}

//verify that space is empty;
game.isEmpty(a,b,board){
  //make sure order is correct to be fed into the loops
  if(b[0]<a[0]){
    game.switch(a,b,0);
  }
  if(b[1]<a[1]){
    game.switch(a,b,1);
  }


  var empty = true;
  for(var x = a[0]; x<b[0];x++){
    for(var y = a[0]; y<b[1]; y++){
      if(this.boards[board][x][y]!= "water"){
        empty = false;
      }
    }
  }
}


//create ship on game board
game.validShips(id, a, b, type){
  //Types: Frigate (1*5), Sub(1*3), Carrier(2*5), Destroyer(1*4)
  var board = this.idBoard(id);
  switch (type) {
    case "Frigate":

      break;
    case "Sub":

      break;
    case "Carrier":

      break;

    case "Destroyer":

      break;
    default:
      console.log("unknown ship type");
  }
}

//test
var game = new Game([12,15]);
console.log(game.board[0][9].length);
