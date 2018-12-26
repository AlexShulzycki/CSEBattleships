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

// init, including references to DOM
window.onload = function() {
	msg = document.getElementById("notifications");
	msg.innerHTML = info.connecting;
	webSockInit();
}
