const ws = new WebSocket((document.location.protocol == 'https:' ? 'wss' : 'ws') + '://' + document.location.host + '/ws')
var socket = io()

function addNumListeners() {
  for (let i = 1; i <= 36; i++) {
    let elem = document.getElementById('num'+i)
    elem.addEventListener('click', event => {
      let num = event.target.id
      num = num.replace('num', '')
      console.log(num)
      socket.emit('chat message', {
        type: 'bid',
        value: 'User bids on '+event.target.id
      })
    })
  }
}

addNumListeners()

