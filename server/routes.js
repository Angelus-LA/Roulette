const { showLogin, processLogin, logout } = require('./auth.js')
const { enterCoins, lobby, gameRoomAndCoins } = require('./game.js')

const routes = {
  public : {
    login : {
      url : "/",
      action : showLogin,
      method : 'get'
    },
    processlogin : {
      url : "/processlogin/",
      action : processLogin,
      method : 'post',
      skipAuth : true
    },
    logout : {
      url : "/logout/",
      action : logout,
      method : 'get'
    },
    lobby : {
      url : "/lobby/",
      action : lobby,
      method : 'get'
    },
    game : {
      url : "/game/",
      action : gameRoomAndCoins,
      method : 'post'
    }
/*    entercoins : {
      url : "/entercoins/",
      action : enterCoins,
      method : 'post'
    }*/
  }
}

module.exports = { routes }
