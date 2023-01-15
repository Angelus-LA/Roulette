const lobby = routes => (req, res) => {
  res.render('public/game', {
    title : 'Welcome to Vegas!',
    coins : 0,
    room : '',
    rooms : rooms,
    message : 'Enter amount of coins and select room',
    routes : routes
  })
}

/*const enterCoins = routes => (req, res) => {
  const coins = req.body.coins
  res.render('public/game', {
    title : 'Welcome to Vegas!',
    coins : coins,
    room : '',
    rooms : rooms,
    message : coins > 0 ? 'Your coins: ' + coins : 'Enter amount of coins',
    routes : routes
  })
}*/

const gameRoomAndCoins = routes => (req, res) => {
  const coins = req.body.coins
  const room = req.body.room
  if (!room || coins < 1) {
    res.redirect(routes.public.lobby.url)
  }
  res.render('public/game', {
    title : 'Welcome to Vegas!',
    coins : coins,
    room : room,
    message : 'Your coins: ' + coins,
    routes : routes
  })
}

const rooms = [ 'room1', 'room2', 'room3' ]

module.exports = { lobby, /*enterCoins,*/ gameRoomAndCoins }

