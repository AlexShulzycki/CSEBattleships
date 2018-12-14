var gameManager = {

  constructor() {
    this.gameMap = new Map();
    this.gameList = [];
    this.waitQueue = []; //use pop and unshift to emulate queue
  },

  manage(id, request) {
    switch (request) {
      case "connect":
        //connect to another player
        waitQueue.unshift(id);
        if (waitQueue.length >= 2) {
          let players = [waitQueue.pop(), waitQueue.pop()];
          let game = gameList.push(Game(players));
          gameMap.set(players[0], game);
          gameMap.set(players[1], game);

        }
        break;
      case "place":
        //placing ship
        break;
      case "fire":
        //fire at position
        break;
    }
  },


}


module.exports = gameManager;
