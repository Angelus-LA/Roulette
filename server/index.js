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

function OK(a) { return Object.keys(a) }

wsServer.on('connection', (ws) => {

  console.log('New client connected! ');

  ws.on('message', function incoming(data) {
    let messageObject = JSON.parse(data.toString('utf8'));
    if (messageObject.type == 'chat') {
      wsServer.clients.forEach((client) => {
        client.send(JSON.stringify(messageObject));
      });
    } else if (messageObject.type == 'bid') {
      wsServer.clients.forEach((client) => {
        client.send(JSON.stringify(messageObject));
      });
    }
  });

  ws.on('close', () => console.log('Client has disconnected! '));

});

const server = app.listen(port)

server.on('upgrade', (request, socket, head) => {
  wsServer.handleUpgrade(request, socket, head, socket => {
    wsServer.emit('connection', socket, request)
  })
})

