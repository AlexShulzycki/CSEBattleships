class Game {
	constructor(players) {
		this.players = [undefined,undefined];
		this.players[0] = players[0].id;
		this.players[1] = players[1].id;
		this.wsList = players;
		//State: 0: Init, 1: Player 1 turn, 2: Player 2 turn, 3: Player 1 wins 4: Player 2 wins
		this.state = 0
		this.health = [{}, {}];
		for (let i = 0; i < 2; i++) {
			this.health[i].frigate = 0;
			this.health[i].sub = 0;
			this.health[i].carrier = 0;
			this.health[i].destroyer = 0;
		}

		this.checkWin = function(obj) {
			for (let i = 0; i < 2; i++) {
				let sum = 0;
				sum += obj.health[i].frigate;
				sum += obj.health[i].sub;
				sum += obj.health[i].carrier;
				sum += obj.health[i].destroyer;
				if (sum == 0) {
					obj.state = i+3;
					this.sendAll({"type": 6, "winner": i+1});
				}
			}
		}

		var tempboard = [
			[],
			[]
		];
		for (var x = 0; x < 20; x++) {
			var temprow = [];
			for (var y = 0; y < 10; y++) {
				temprow.push("Water");
			}

			if (x < 10) {
				tempboard[0].push(temprow);
			} else {
				tempboard[1].push(temprow);
			}

		}
		this.boards = tempboard;

		// ping id to board
		this.idBoard = new Map();
		this.idBoard.set(this.players[0], this.boards[0]);
		this.idBoard.set(this.players[1], this.boards[1]);

		this.idBNum = new Map();
		this.idBNum.set(this.players[0], 0);
		this.idBNum.set(this.players[1], 1);

		this.turnMap = new Map();
		this.turnMap.set(this.players[0], 1);
		this.turnMap.set(this.players[1], 2);
	}
	//helper functions
	sendAll(msg){
		this.wsList[0].send(msg);
		this.wsList[1].send(msg);
	}


	//switch pair of coordinate pairs
	switch (a, b, index) {
		var temp = a[index];
		a[index] = b[index];
		b[index] = temp;
	}
	//identify type of ship, if any
	identify(x, y) {
		var res = [0, 0];
		res[0] = Math.abs(x[0] - y[0]) + 1;
		res[1] = Math.abs(x[1] - y[1]) + 1;

		var comparator = function(x, y) {
			return ((res[0] == x) && (res[1] == y)) || ((res[1] == x) && (res[0] == y))
		};

		x = 1;
		y = 5;
		if (comparator(x, y)) {
			return "Frigate";
		}

		x = 1;
		y = 3;
		if (comparator(x, y)) {
			return "Sub";
		}

		x = 2;
		y = 5;
		if (comparator(x, y)) {
			return "Carrier";
		}

		x = 1;
		y = 4;
		if (comparator(x, y)) {
			return "Destroyer"
		}

		return "Invalid Ship Type";
	}

	//verify that space is empty;
	isEmpty(a, b, board) {
		//make sure order is correct to be fed into the loops
		if (b[0] < a[0]) {
			this.switch(a, b, 0);
		}
		if (b[1] < a[1]) {
			this.switch(a, b, 1);
		}


		var empty = true;
		for (var x = a[0]; x <= b[0]; x++) {
			for (var y = a[1]; y <= b[1]; y++) {
				if (board[x][y] != "Water") {
					return false;
				}
			}
		}
		return empty;
	}
	//create ship on game board
	putShip(id, a, b) {
		var board = this.idBNum.get(id);
		var boardObj = this.idBoard.get(id);
		//Types: Frigate (1*5), Sub(1*3), Carrier(2*5), Destroyer(1*4)
		//Switch to feed to loop
		if (b[0] < a[0]) {
			this.switch(a, b, 0);
		}
		if (b[1] < a[1]) {
			this.switch(a, b, 1);
		}

		var assign = function(board, name) {
			for (var x = a[0]; x <= b[0]; x++) {
				for (var y = a[1]; y <= b[1]; y++) {
					board[x][y] = name;
				}
			}
		}

		var checkReady = function(obj) {
			let sum = 0;
			for (let i = 0; i < 2; i++) {
				let h = obj.health[i];
				sum += h.frigate;
				sum += h.sub;
				sum += h.carrier;
				sum += h.destroyer;
			}
			if (sum == 44) {
				obj.state = 1;
				obj.sendAll({"type":1,"ready":true});
			}
		}
		let ship = this.identify(a, b);

		switch (ship) {
			case "Frigate":
				if (this.health[board].frigate == 5) {
					return false;
				}
				assign(boardObj, "Frigate");
				this.health[board].frigate = 5;
				checkReady(this);
				break;
			case "Sub":
				if (this.health[board].sub == 3) {
					return false;
				}
				assign(boardObj, "Sub");
				this.health[board].sub = 3;
				checkReady(this);
				break;
			case "Carrier":
				if (this.health[board].carrier == 10) {
					return false;
				}
				assign(boardObj, "Carrier");
				this.health[board].carrier = 10;
				checkReady(this);
				break;
			case "Destroyer":
				if (this.health[board].destroyer == 4) {
					return false;
				}
				assign(boardObj, "Destroyer");
				this.health[board].destroyer = 4;
				checkReady(this);
				break;
			default:
				return false

		}
		let websock = this.wsList[board];
		websock.send({"type":1, "placed":ship, "location":[a,b], "ready":false });
	}

	fire(id, x, y) {
		let board = this.idBNum.get(id);
		console.log(this.state);
		if (this.turnMap.get(id) != this.state) {
			return;
		}
		if (this.state == 1) {
			this.state = 2;
		} else {
			this.state == 1;
		}

		if (board == 0) {
			board = 1;
		} else {
			board = 0;
		}
		if (((x < 0) || (x > 10)) || ((y < 0) || (y > 10))) {
			return;
		}

		let hit = function(name, obj) {
			obj.health[board][name]--;
			obj.boards[board][x][y] = "Hit";

			obj.checkWin(obj);

			if (obj.health[board][name] == 0) {
				this.sendAll({"type":2, "player":board, "location":[x,y], "hit":true, "sunk":true});
			} else {
				this.sendAll({"type":2, "player":board, "location":[x,y], "hit":true, "sunk":false});
			}

		}

		switch (this.boards[board][x][y]) {
			case "Frigate":
				return hit("frigate", this);
				break;
			case "Sub":
				return hit("sub", this);
				break;
			case "Carrier":
				return hit("carrier", this);
				break;
			case "Destroyer":
				return hit("destroyer", this);
				break;
			case "Water":
				this.boards[board][x][y] = "Miss";
				this.sendAll({"type":2, "player":board, "location":[x,y], "hit":false, "sunk":false});
				break;
			case "Hit":
				return;

		}
	}
}
//exports
module.exports = Game;
