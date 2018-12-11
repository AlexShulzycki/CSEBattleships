class Game{
  constructor(players){
  this.players = players;
  //State: 0: Init, 1: Player 1 turn, 2: Player 2 turn, 3: Game over
  this.state = 0

  this.health = [{},{}];
  var tempboard =[[],[]];
  for(var x = 0; x < 20; x++){
    var temprow = [];
    for(var y = 0; y<10; y++){
      temprow.push("Water");
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
  }
  //helper functions
  //switch pair of coordinate pairs
  switch(a,b,index){
      var temp = a[index];
      a[index] = b[index];
      b[index] = temp;
  }
  //identify type of ship, if any
  identify(x,y){
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
  isEmpty(a,b,board){
    //make sure order is correct to be fed into the loops
    if(b[0]<a[0]){
      this.switch(a,b,0);
    }
    if(b[1]<a[1]){
      this.switch(a,b,1);
    }


    var empty = true;
    for(var x = a[0]; x<=b[0];x++){
      for(var y = a[1]; y<=b[1]; y++){
        if(this.boards[board][x][y]!= "Water"){
          return false;
        }
      }
    }
    return empty;
  }
  //create ship on game board
  putShip(board, a, b){
    var boardObj = this.boards[board];
    //Types: Frigate (1*5), Sub(1*3), Carrier(2*5), Destroyer(1*4)
    //Switch to feed to loop
    if(b[0]<a[0]){
      this.switch(a,b,0);
    }
    if(b[1]<a[1]){
      this.switch(a,b,1);
    }

    var assign = function(board,name){
      for(var x = a[0]; x<=b[0];x++){
        for(var y = a[1]; y<=b[1]; y++){
          board[x][y] = name;
        }
      }
    }
    switch (this.identify(a,b)) {
      case "Frigate":
          if(this.health[board].frigate == 5){
            return false;
          }
          assign(boardObj,"Frigate");
          this.health[board].frigate = 5;
        break;
      case "Sub":
          if(this.health[board].sub == 3){
            return false;
          }
          assign(boardObj,"Sub");
          this.health[board].sub = 3;
        break;
      case "Carrier":
          if(this.health[board].carrier == 10){
            return false;
          }
          assign(boardObj,"Carrier");
          this.health[board].carrier = 10;
        break;
      case "Destroyer":
          if(this.health[board].destroyer == 4){
            return false;
          }
          assign(boardObj,"Destroyer");
          this.health[board].destroyer = 4;
        break;
      default:
        console.log("unknown ship type");
    }
  }

  fire(board,x,y){
    if(((x<0)||(x>10))||((y<0)||(y>10))){
      return "Invalid Shot";
    }

    switch(this.boards[board][x][y]){
      case "Frigate":
        this.health[board].frigate--;
        this.boards[board][x][y] = "Hit";
        if(this.health[board].frigate == 0){
          return "Frigate Sunk";
        }else{
          return "Frigate Hit";
        }
        break;
      case "Sub":
        this.health[board].sub--;
        this.boards[board][x][y] = "Hit";
        if(this.health[board].sub == 0){
          return "Sub Sunk";
        }else{
          return "Sub Hit";
        }
        break;
      case "Carrier":
        this.health[board].carrier--;
        this.boards[board][x][y] = "Hit";
        if(this.health[board].carrier == 0){
          return "Carrier Sunk";
        }else{
          return "Carrier Hit";
        }
        break;
      case "Destroyer":
        this.health[board].destroyer--;
        this.boards[board][x][y] = "Hit";
        if(this.health[board].destroyer == 0){
          return "Destroyer Sunk";
        }else{
          return "Destroyer Hit";
        }
        break;
      case "Water":
        this.boards[board][x][y] = "Miss";
        return "Miss";
        break;
      case "Hit":
        return "Invalid Shot";

    }
  }
}

var game = new Game([12,15]);
game.putShip(0,[0,0],[0,4]);



//exports
module.exports = Game;