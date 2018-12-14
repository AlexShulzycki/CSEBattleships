var Game = require("./game");
var gameManager = function() {

  this.gameMap = new Map();
  this.gameList = [];
  this.waitQueue = []; //use pop and unshift to emulate queue

  this.manage = function(id, request) {
    switch (request) {
      case "connect":
        //connect to another player
        this.match(id);
        break;
      case "place":
        //placing ship
        break;
      case "fire":
        //fire at position
        break;
      case "end":
        //end game
        this.end(id);
    }
  }
this.match = function(id){
  this.waitQueue.unshift(id);
  if (this.waitQueue.length >= 2) {
    let players = [this.waitQueue.pop(), this.waitQueue.pop()];
    let game = new Game(players);
    let list = this.gameList;
    list.push(game);
    game.index = list.length - 1;
    this.gameMap.set(players[0], list[game.index]);
    this.gameMap.set(players[1], list[game.index]);
  }
}

this.end = function(id){
  let map = this.gameMap;
  let game = map.get(id);
  if(game instanceof Game){
    let players = game.players;
    map.delete(players[0]);
    map.delete(players[1]);
    this.gameList.splice(game.index,1);
  }
}

}

module.exports = new gameManager();
