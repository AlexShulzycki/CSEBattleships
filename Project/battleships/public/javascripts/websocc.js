//websockets
var webSocket = new WebSocket("ws://localhost:3000");

webSocket.onmessage = function(event){
    let data = JSON.parse(event.data);
    console.log(data);
    switch (data.type) {

      case 0: //pairing
        if(!game){
          //still queued
        }else{
          //game found
          player = data.player;
        }
        break;
      case 1: // placing
        //confirm that it is placed
        break;
      case 2:
        if(data.player == player){
          //own board hit
        }else{
          //opponents board hit
        }
        break;

      case 5: //error
        alert("Error: "+data.data);
        break;

      case 6: //// win
        if(data.winner == player){
          //player won
        }else{
          //you lost buckaroo
        }
        break;
      default:


    }
}
