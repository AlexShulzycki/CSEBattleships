var Game = require("./game");
var gameManager = function() {

	this.gameMap = new Map();
	this.gameList = [];
	this.waitQueue = []; //use pop and unshift to emulate queue
	this.checkInLine = function(id) {
		if (this.gameMap.get(id) === undefined) {
			return true;
		} else {
			return false;
		}
	}

	this.manage = function(ws, request) {
		let id = ws.id;
		let payload = request.substring(1);
		let choice = parseInt(request.substring(0, 1));
		if (choice == 0) {
			return this.match(ws);
		}
		if (this.notInLine) {
			return "Get in the queue, bucko";
		}

		//codes to control the game, to be simply sent to the server as a string via websocket.
		//Everything past that including ID's are done server side. Examples of valid codes are in ()
		switch (choice) {
			case 0:
				//connect to another player, just 0 (0)
				return this.match(id);
				break;
			case 1:
				//placing ship, 1 for the code, space, then x1y1x2y2 from corner to corner. (10105)
				return this.place(id, payload);
				break;
			case 2:
				//fire at position, 2 for the code, then xy (234)
				return this.fire(id, payload);
				break;
			case 3:
				//end game, simply send 3 (3). Game also ends on websocket disconnect automatically.
				return this.end(id);
				break;
			default:
				console.log("incorrect command");
		}
	}
	this.match = function(ws) {
		let id = ws.id;
		this.waitQueue.unshift(ws);
		if (this.waitQueue.length >= 2) {
			let players = [this.waitQueue.pop(), this.waitQueue.pop()];
			let game = new Game(players);
			let list = this.gameList;
			list.push(game);
			game.index = list.length - 1;
			this.gameMap.set(players[0].id, list[game.index]);
			this.gameMap.set(players[1].id, list[game.index]);
			game.wsList[0].send("Game Found!");
			return "Game Found!";
		}else{
		return "Finding match...";
		}
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
		game.sendAll("Game over!");
	}

	this.place = function(id, payload) {
		let game = this.gameMap.get(id);
		if (game.state != 0) {
			return "Too early/too late for that";
		}
		// a coordinates
		let x = "";
		let y = "";
		let coords = [];
		for (let i = 0; i < 2; i++) {
			x = parseInt(payload.substring(2 * i, 2 * i + 1));
			y = parseInt(payload.substring(2 * i + 1, 2 * i + 2));
			if (isNaN(x) || isNaN(y)) {
				// TODO: RETURN ERROR message
				return "Error parsing coordinates, are you sure they're valid?";
			}
			coords[i] = [x, y];
		}
		return game.putShip(id, coords[0], coords[1]);
	}

	this.fire = function(id, payload) {
		let game = this.gameMap.get(id);
		if (isNaN(parseInt(payload))) {
			return "Invalid coordinates, try again?";
		} else {
			let x = payload.substring(0, 1);
			let y = payload.substring(1, 2);
			return game.fire(id, x, y);
		}
	}

}

module.exports = new gameManager();
