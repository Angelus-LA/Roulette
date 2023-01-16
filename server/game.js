const Redis = require("ioredis")
const redisClient = new Redis(6379, 'localhost')

const lobby = routes => (req, res) => {
  res.render('public/game', {
    title : 'Welcome to Vegas!',
    coins : 0,
    room : '',
    rooms : ['room1', 'room2', 'room3'],
    message : 'Enter amount of coins and select room',
    routes : routes
  })
}

const gameRoomAndCoins = routes => (req, res) => {
  const coins = req.session.coins
  const room = req.session.room
  res.render('public/game', {
    title : 'Welcome to Vegas!',
    coins : coins,
    room : room,
    message : 'Your coins: ' + coins,
    routes : routes
  })
}

const processLobby = routes => (req, res) => {
  (async _ => {
    req.session.room = req.body.room
    req.session.coins = req.body.coins
    await redisClient.del('rooms')
    const rooms = await redisClient.hgetall('rooms');
    if (!rooms) {
      await redisClient.hmset('rooms', [])
    }
    const roomExists = await redisClient.hexists('rooms', req.session.room)
    if (!roomExists) {
      await redisClient.hmset('rooms', req.session.room, { users : [], chat : [] })
    }
    const room = await redisClient.hget('rooms', req.session.room)
    room.users = (room.users ?? []).concat([req.session.userId])
    await redisClient.hmset('rooms', req.session.room, room)
    console.log(await redisClient.hgetall('rooms'))
    console.log(await redisClient.hget('rooms', req.session.room))
    res.redirect(routes.public.game.url)
  })()
}

module.exports = { lobby, gameRoomAndCoins, processLobby }

