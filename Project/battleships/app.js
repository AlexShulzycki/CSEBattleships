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
  this.boards = tempboard;

  // mapping id to board
  this.idBoard = new Map();
  this.idBoard.set(players[0],this.boards[0]);
  this.idBoard.set(players[1],this.boards[1]);
  //helper functions
  //switch pair of coordinate pairs
  this.switch = function(a,b,index){
      var temp = a[index];
      a[index] = b[index];
      b[index] = temp;
  }
  //identify type of ship, if any
  this.identify = function(x,y){
    var res = [0,0];
    res[0] = Math.abs(x[0]-y[0]) + 1;
    res[1] = Math.abs(x[1]-y[1]) + 1;

    var comparator = function(x,y){return ((res[0] == x)&&(res[1] == y))||((res[1] == x)&&(res[0] == y))};

    x = 1; y = 5;
    if(comparator(x,y)){
      return "Frigate";
    }

    x = 1; y = 3;
    if(comparator(x,y)){
      return "Sub";
    }

    x = 2; y = 5;
    if(comparator(x,y)){
      return "Carrier";
    }

    x = 1; y = 4;
    if(comparator(x,y)){
      return "Destroyer"
    }

    return "Invalid Ship Type";
  }

  //verify that space is empty;
  this.isEmpty = function(a,b,board){
    //make sure order is correct to be fed into the loops
    if(b[0]<a[0]){
      this.switch(a,b,0);
    }
    if(b[1]<a[1]){
      this.switch(a,b,1);
    }


    var empty = true;
    for(var x = a[0]; x<b[0];x++){
      for(var y = a[1]; y<b[1]; y++){
        if(this.boards[board][x][y]!= "water"){
          empty = false;
        }
      }
    }
    return empty;
  }
  //create ship on game board
  this.putShip = function(board, a, b){
    //Types: Frigate (1*5), Sub(1*3), Carrier(2*5), Destroyer(1*4)
    //Switch to feed to loop
    if(b[0]<a[0]){
      this.switch(a,b,0);
    }
    if(b[1]<a[1]){
      this.switch(a,b,1);
    }
    switch (this.identify(a,b)) {
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

}

//test
var game = new Game([12,15]);
console.log(game.boards[0][0][8]);
