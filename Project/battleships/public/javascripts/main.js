window.onload = initScript;

function initScript(){
  var playerBoard = document.getElementById('playerBoard');
  var opponentBoard = document.getElementById('opponentBoard');

  for(var i = 0; i<20; i++){

    var newRow = document.createElement("div");
    newRow.classList.add("row");

    for(var a = 0; a<10; a++){
      newBlock = document.createElement("div");
      newBlock.classList.add("block");
      newRow.appendChild(newBlock);
    }
    if(i<10){
      playerBoard.appendChild(newRow);
    }
    else {
      opponentBoard.appendChild(newRow);
    }

  }
}
