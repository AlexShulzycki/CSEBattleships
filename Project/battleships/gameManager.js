var Game = require("./game");
var gameManager = function() {

	this.gameMap = new Map();
	this.gameList = [];
	this.waitQueue = []; //use pop and unshift to emulate queue
  this.checkInLine = function(id){
    if(this.gameMap.get(id) === undefined){
      return true;
    }else{
      return false;
    }
  }

	this.manage = function(id, request) {
    let payload = request.substring(2);
    let choice = parseInt(request.substring(0,1));
    if(choice == 0){
      return this.match(id);
    }
    if(this.notInLine){
      return "Get in the queue, bucko";
    }
		switch (choice) {
			case 0:
				//connect to another player
				return this.match(id);
				break;
			case 1:
				//placing ship
        return this.place(id, payload);
				break;
			case 2:
				//fire at position
        return this.fire(id, payload);
				break;
			case 3:
				//end game
				return this.end(id);
        break;
      default:
        console.log("incorrect command");
		}
	}
	this.match = function(id) {
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
    return "Finding match...";
	}

	this.end = function(id) {
		let map = this.gameMap;
		let game = map.get(id);
		if (game instanceof Game) {
			let players = game.players;
			map.delete(players[0]);
			map.delete(players[1]);
			this.gameList.splice(game.index, 1);
		}
    return "Game ended";
	}

  this.place = function(id, payload){
    let game = this.gameMap.get(id);
    if(game.state != 0){
      return "Game has already started";
    }
    // a coordinates
    let x = "";
    let y = "";
    let coords = [];
    for(let i = 0; i<2; i++){
      x = parseInt(payload.substring(2*i,2*i +1));
      y = parseInt(payload.substring(2*i+1,2*i+2));
      if(isNaN(x)||isNaN(y)){
        // TODO: RETURN ERROR message
        return "Error parsing coordinates, are you sure they're valid?";
      }
      coords[i] = [x,y];
    }
    game.putShip(id, coords[0], coords[1]);
    return true;
  }

  this.fire = function(id, payload){
    let game = this.gameMap.get(id);
    if(isNaN(parseInt(payload))){
      return "Invalid coordinates, try again?";
    }else{
        let x = payload.substring(0,1);
        let y = payload.substring(1,2);
        return game.fire(id, x, y);
    }
  }

}

module.exports = new gameManager();
