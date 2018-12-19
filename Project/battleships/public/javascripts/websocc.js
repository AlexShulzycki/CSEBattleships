//websockets
var webSocket = new WebSocket("ws://localhost:3000");

webSocket.onmessage = function(event){
    let data = JSON.parse(event.data);
    console.log(data);
    switch (data.type) {

      case 0:
        break;
      default:

    }
}

function webSock(query, callback){
    webSocket.send("4");
}

function getPlayers(){

}
