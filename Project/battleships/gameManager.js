var Game = require("./game");
var gameManager = function() {

	this.gameMap = new Map();
	this.gameList = [];
	this.waitQueue = []; //use pop and unshift to emulate queue
	this.checkInLine = function(id) {
		if (this.gameMap.get(id) === undefined) {
			return false;
		} else {
			return true;
		}
	}
	this.respond = function(type, data, toID) {
		let game = this.gameMap.get(toID);
		switch (type) {
			case 0:
				// game found, send player info, DEPENDENT ON PLAYER
				let res = {
					"type": 0,
					"game": data.queue,
					"player": game.idBNum.get(toID),
				};
				break;
			case 2: //hit or miss, i bet u never miss huh
				let res = {
					"type": 2,
					"player": data.board,
					"location": data.location,
					"hit": data.hit,
					"sunk": "truefalse"
				};
				break;
			case 1: //placing Ship, DEPENDEND ON PLAYER
				let res = {
					"type": 1,
					"placed": data.placed,
					"location": data.location,
					"ready": "true/false"
				};
				break;
			case 4:
				let res = {
					"type": 4,
					"players": this.gameList.length
				}
			case 5: //error
				let res = {
					"type": 5
				};

			case 6: //win template for now
				let res = {
					"type": 6,
					"winner": this.idBNum.get(toID)
				}
		}
	}


	this.manage = function(ws, request) {
		let id = ws.id;
		let payload = request.substring(1);
		let choice = parseInt(request.substring(0, 1));

		if ((!this.checkInLine(id)) && ((choice != 0) && (choice != 4))) {
			return ws.send(JSON.stringify({
				"type": 5
			}));
		}

		//codes to control the game, to be simply sent to the server as a string via websocket.
		//Everything past that including ID's are done server side. Examples of valid codes are in ()
		switch (choice) {
			case 0:
				//connect to another player, just 0 (0)
				return this.match(ws);
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

			case 4: //number of players online
				return ws.send(this.gameList.length * 2);
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
			game.wsList[0].send(JSON.stringify({
				"type": 0,
				"game": true,
				"player": 1
			}));
			game.wsList[1].send(JSON.stringify({
				"type": 0,
				"game": true,
				"player": 2
			}));
		} else {
			ws.send(JSON.stringify({
				"type": 0,
				"game": false
			}));
		}
	}

	this.end = function(ws) {
		let id = ws.id;
		let map = this.gameMap;
		let game = map.get(id);
		//check if in game or just in queue
		if(!(game instanceof Game)){
			console.log("Removed from queue");
			let index = this.waitQueue.indexOf(ws);
			this.waitQueue.splice(index, 1);
			console.log(this.waitQueue.length);
			return;
		}

		//ending the game
		let receiver = 0;
		if (ws.id == 0) {
			receiver = 1;
		}
		if ((game.state != 3) && (game.state != 4)) {
			try{
			game.wsList[receiver].send(JSON.stringify({
				"type": 7
			}));
		}catch(err){

		}
		} else {
			game.wsList[receiver].send(JSON.stringify({
				"type": 6,
				"winner": "you"
			}));
		}
			let players = game.players;
			map.delete(players[0]);
			map.delete(players[1]);
			this.gameList.splice(game.index, 1);
	}

	this.place = function(id, payload) {
		let game = this.gameMap.get(id);
		if (game.state != 0) {
			game.wsList[game.idBNum.get(id)].send(JSON.stringify({
				"type": 5,
				"data":"Not your turn"
			}));
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
				game.wsList[game.idBNum.get(id)].send(JSON.stringify({
					"type": 5,
					"data":"Invalid coordinates"

				}));
			}
			coords[i] = [x, y];
		}
		if((game.putShip(id, coords[0], coords[1])) === false){
			game.wsList[game.idBNum.get(id)].send(JSON.stringify({
				"type": 5,
				"data":"Already placed"
			}));
		}
	}

	this.fire = function(id, payload) {
		let game = this.gameMap.get(id);
		if (isNaN(parseInt(payload))) {
			return "Invalid coordinates, try again?";
		} else {
			let x = payload.substring(0, 1);
			let y = payload.substring(1, 2);
			game.fire(id, x, y);
		}
	}

}

module.exports = new gameManager();
