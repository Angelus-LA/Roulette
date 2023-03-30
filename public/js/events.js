const ws = new WebSocket((document.location.protocol == 'https:' ? 'wss' : 'ws') + '://' + document.location.host + '/ws')
var socket = io()

function addNumListeners() {
  for (let i = 1; i <= 36; i++) {
    let elem = document.getElementById('num'+i)
    elem.addEventListener('click', function (e) {
      let num = e.target.id
      num = num.replace('num', '')
      console.log(num)
      ws.send(JSON.stringify({
        'type': 'bid',
        'data': 'User bids on '+e.target.id
      }));
    })
  }
}

ws.onmessage = (event) => {
  console.log(event);
  let messageObject = JSON.parse(event.data)
  let el = document.getElementById('wsmessages')
  if (messageObject.type == 'chat') {
    el.innerHTML += ('<br>' + /*event.session.username + ': ' +*/ messageObject.data)
  } else if (messageObject.type == 'bid') {
    el.innerHTML += ('<br>' + messageObject.data)
  }
}

function sendChatMessage() {
  let el = document.getElementById('chat')
  ws.send(JSON.stringify({
    'type': 'chat',
    'data': el.value
  }))
}

addNumListeners()

