const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require("cookie-parser")
const sessions = require('express-session')
const connectRedis = require('connect-redis')
const Redis = require("ioredis")
const crypto = require('crypto')
const ws = require('ws')
//const config = require('config')

const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const { joinUser, removeUser } = require('./game')
const port = 3000

const RedisStore = connectRedis(sessions)

const redisClient = new Redis(6379, 'localhost')

const session = sessions(
  {
    store: new RedisStore(
      {
        client: redisClient
      }
    ),
    name : 'roulette',
    secret : 'q568496r56753ydfjHerjGW56846y45yrrbyRTYBWV',
    credentials : true,
    saveUninitialized : false,
    cookie :
    {
      maxAge : 1000 * 60 * 60 * 24 * 7 * 365
    },
    resave : false
  }
)

app.use(session)

io.on('connection', function (socket) {
  console.log('connected')
  socket.on('join room', (data) => {
    console.log('in room')
  })
  socket.on('chat message', (data) => {
    console.log(data)
    socket.emit('chat message', { data: data })
  })
})
    /*let Newuser = joinUser(socket.id, data.username,data.roomName)
    //io.to(Newuser.roomname).emit('send data' , {username : Newuser.username,roomname : Newuser.roomname, id : socket.id})
   // io.to(socket.id).emit('send data' , {id : socket.id ,username:Newuser.username, roomname : Newuser.roomname })
   socket.emit('send data' , {id : socket.id ,username:Newuser.username, roomname : Newuser.roomname })
    thisRoom = Newuser.roomname
    console.log(Newuser)
    socket.join(Newuser.roomname)
  })
  socket.on("chat message", (data) => {
    io.to(thisRoom).emit("chat message", {data:data,id : socket.id})
  })
  socket.on("disconnect", () => {
    const user = removeUser(socket.id)
    console.log(user)
    if (user) {
      console.log(user.username + ' has left')
    }
    console.log("disconnected")
  })
}) */

const wsServer = new ws.Server(
  {
    noServer : true,
    path : '/ws'
  }
)

const router = express.Router()
const { routes } = require('./routes.js')

app.engine('pug', require('pug').__express)
app.set('view engine', 'pug')
app.set('views', __dirname + '/views')

app.use(express.static('public/'))
app.use(cookieParser())

app.use(bodyParser.json(
  {
    limit : '150mb'
  }
))

app.use(bodyParser.urlencoded(
  {
    limit : '150mb',
    extended : true
  }
))

for (let entry in {public : routes.public}) {
  for (let route in routes[entry]) {
    route = routes[entry][route]
    router[route.method](route.url, route.action(routes))
  }
}

app.use('/', router)

wsServer.on('connection', (ws) => {
  console.log('New client connected! ')
  ws.on('message', function incoming(data) {
    let messageObject = JSON.parse(data.toString('utf8'))
    if (messageObject.type == 'chat') {
      wsServer.clients.forEach((client) => {
        client.send(JSON.stringify(messageObject))
      })
    } else if (messageObject.type == 'bid') {
      wsServer.clients.forEach((client) => {
        client.send(JSON.stringify(messageObject))
      })
    }
  })
  ws.on('close', () => console.log('Client has disconnected! '))
})

const server = app.listen(port)
io.attach(server)

server.on('upgrade', (request, socket, head) => {
  wsServer.handleUpgrade(request, socket, head, socket => {
    wsServer.emit('connection', socket, request)
  })
})

