var socket = io()

const gete = id => document.getElementById(id)

var chatForm = gete('chatform')
var chatField = gete('chat')
var chatmessages = gete('iomessages')

chatForm.addEventListener('submit', function (event) {
  event.preventDefault()
  socket.emit('chat message', {
    type: 'chat',
    value: chatField.value
  })
  chatField.value = ''
  chatField.focus()
})

socket.on('chat message', data => {
  displayMessage(data.data.value)
})

chatField.oninput = event => {
  // alert(chatfield.value)
  if (!chatField.value) {
    // stop showing 'typing to others'
  } else {
    socket.emit('typing', { data: event.value })
  }
}

const displayMessage = msg => {
  chatmessages.innerHTML += ('<br>' + msg)
}

