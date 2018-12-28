//websockets
var webSocket;
var webSockInit = function() {
	webSocket = new WebSocket("ws://localhost:3000");

	webSocket.onopen = function(event) {
    console.log("connected to server");
		msg.innerHTML = info.connected;
    webSocket.send("0");
	}

	webSocket.onmessage = function(event) {
		let data = JSON.parse(event.data);
		console.log(data);
		switch (data.type) {

			case 0: //pairing
				if (!data.game) {
					msg.innerHTML = info.waiting;
				} else {
					//game found
					player = data.player;
          msg.innerHTML = info.place;
				}
				break;
			case 1: // placing
				//confirm that it is placed


        let string = data.placed;
        string += " placed at (";
				string += data.location[0][0] + ", " + data.location[0][1];
				string += ") (" + data.location[1][0] + ", " + data.location[1][1];
				string += ")";
        //finish
        msg.innerHTML = string;
				boards.place(data.location[0], data.location[1]);
				break;
			case 2:
				if (data.player == player) {
					//own board hit
				} else {
					//opponents board hit
				}
				break;

			case 5: //error
				msg.innerHTML = "Error: "+ data.data;
				break;

			case 6: //// win
				if (data.winner == player || data.winner == "you") {
					//player won
          msg.innerHTML = info.ywin;
				} else {
					//you lost buckaroo
          msg.innerHTML = info.owin;
				}
				break;
      case 7: //enemy disconnected
        msg.innerHTML  = info.odisconnect;
        break;
			default:


		}
	}
}
