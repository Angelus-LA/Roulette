const showLogin = routes => (req, res) => {
  (async _ => {
    let session = req.session
    let authorized = session.authorized

    if (authorized) {
      res.redirect(routes.public.lobby.url)
    }

    res.render('public/login', {
      routes : routes,
      unauthorized : true
    })
  })()
}

const processLogin = routes => (req, res) => {
  let users = [
    { id :  1, username :  'buba',  password :  'buba'  },
    { id :  2, username : 'leshij', password : 'leshij' },
    { id :  3, username :  'ozzy',  password :  'ozzy'  }
  ]

  let username = req.body.username
  let password = req.body.password

  let i = 0
  for (i = 0; i < users.length; i++) {
    if (users[i].username == username  &&  users[i].password == password) {
      break
    }
  }
  if (i < users.length) { // user is found in users array
    //console.log("Welcome, " + users[i].username)
    let session = req.session
    session.userId = users[i].id
    session.username = users[i].username
    session.authorized = true
    res.redirect(routes.public.lobby.url)
  } else {
    res.redirect(routes.public.login.url)
  }
}

const logout = routes => (req, res) => {
  (async _ => {
    let session = req.session
    if (session.authorized) {
      req.session.destroy( _ => {
        res.redirect(routes.public.login.url)
      })
    }
  })()
}

module.exports = { showLogin, processLogin, logout }

