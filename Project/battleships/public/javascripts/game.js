// GAME JS FOR CLIENT

var gameState = 0; // 0 for connecting, 1 for placing ships, 2 for player 1,
// 3 for player 2, 4 for game end
var player;

//variable init
var msg;
var info = {
	"connecting": "Connecting to server...",
	"waiting": "Waiting for a worthy opponent...",
	"place": "Opponent found! Place your ships, your board is on the left. You may place a Cruiser (1*5), Destroyer (*1*4), a Submarine (1*3), and a Carrier (2*5)",
	"yturn": "Your turn. Take a shot at your opponent!",
	"oturn": "You are being shelled by your opponent!",
	"ywin": "You have won the game!",
	"owin": "Your fleet has been obliterated. Better luck next time!",
	"odisconnect": "Your opponent has disconnected. Uncaught bug in the server, or enemy cowering in fear? Your guess is as good as mine!",
	"error": "Error ",
	"connected": "Connected to server..."
}

//Mappings
var alphaNum = new Map();
alphaNum.set("A", 0);
alphaNum.set("B", 1);
alphaNum.set("C", 2);
alphaNum.set("D", 3);
alphaNum.set("E", 4);
alphaNum.set("F", 5);
alphaNum.set("G", 6);
alphaNum.set("H", 7);
alphaNum.set("I", 8);
alphaNum.set("J", 9);

var numAlpha = new Map();
numAlpha.set(0, "A");
numAlpha.set(1, "B");
numAlpha.set(2, "C");
numAlpha.set(3, "D");
numAlpha.set(4, "E");
numAlpha.set(5, "F");
numAlpha.set(6, "G");
numAlpha.set(7, "H");
numAlpha.set(8, "I");
numAlpha.set(9, "J");

//Dynamically create divs for the boards with a board object

var Boards = function() {
	let yTable = document.getElementById("yTable");
	let oTable = document.getElementById("oTable");

	this.mine = [];
	this.opp = [];
  //helper funtion to initialize board to object from html
	let boardInit = function(array, tableElement) {
		for (let i = 0; i < 10; i++) {
			let tempRow = [];
			for (let x = 0; x < 10; x++) {
				tempRow.push(tableElement.querySelectorAll("tr")[i].querySelectorAll("td")[x]);
			}
			array.push(tempRow);
		}
	}

  boardInit(this.mine, yTable);
  boardInit(this.opp, oTable);

  //send coordinates for verification
  this.place = function(a,b){

  }
  //confirm placing of ship
  this.confirm = function(a,b)


}
// init, including references to DOM
window.onload = function() {
	msg = document.getElementById("notifications");
	msg.innerHTML = info.connecting;
	webSockInit();
	var boards = new Board();
}
