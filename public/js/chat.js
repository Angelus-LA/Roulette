var socket = io()

document.getElementById('chatform').addEventListener('submit', function (event) {
  event.preventDefault()
  let el = document.getElementById('fchat')
  socket.emit('chat message', {
    value: el.value
  })
  el.value = ''
  el.focus()
})

socket.on('chat message', (data) => {
  displayMessage(data.value)
})

const displayMessage = msg => {
  let el = document.getElementById('wsmessages')
  el.innerHTML += ('<br>' + msg)
}

