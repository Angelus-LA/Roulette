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

const joinUser = (userId, userName, roomName) => {
  //
  return 0
}

const removeUser = (userId) => {
  //
  return 0
}

const processLobby = routes => (req, res) => {
  (async _ => {
    req.session.room = req.body.room
    req.session.coins = req.body.coins
    await redisClient.del('rooms')
    const rooms = await redisClient.hgetall('rooms');
    if (!rooms) {
      await redisClient.hmset('rooms', {})
    }
    const roomExists = await redisClient.hexists('rooms', req.session.room)
    if (!roomExists) {
      await redisClient.hmset( 'rooms', req.session.room, JSON.stringify({ users : [], chat : [] }) )
    }
    const room = JSON.parse ( await redisClient.hget('rooms', req.session.room) )
    let uid = req.session.userId
    room.users = (room.users ?? []).concat([uid].filter( (uid) => room.users.indexOf(uid) < 0 ))
    await redisClient.hmset('rooms', req.session.room, JSON.stringify(room))
    let obj = await redisClient.hgetall('rooms')
    console.log ('Room: ' + req.session.room)
    console.log('  ' + obj[req.session.room])
    res.redirect(routes.public.game.url)
  })()
}

module.exports = { lobby, gameRoomAndCoins, processLobby, joinUser, removeUser }

