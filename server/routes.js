const { showLogin, processLogin, logout } = require('./auth.js')
const { enterCoins, lobby, gameRoomAndCoins, processLobby } = require('./game.js')

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
    processlobby : {
      url : "/processlobby/",
      action : processLobby,
      method : 'post'
    },
    game : {
      url : "/game/",
      action : gameRoomAndCoins,
      method : 'get'
    }
  }
}

module.exports = { routes }
