const users = require('../users/users-model.js')



/*
  If the user does not have a session saved in the server

  status 401
  {
    "message": "You shall not pass!"
  }
*/

function restricted(req, res, next) {
  if (!req.session.user) {
    res.status(401).json({ message: 'You shall not pass!' })
  } else {
    next()
  }
}

/*
  If the username in req.body already exists in the database

  status 422
  {
    "message": "Username taken"
  }
*/
function checkUsernameFree(req, res, next) {
  if (req.body.username) {
    let foundUsers = users.findBy((u) => u.username == req.body.username)
    if (foundUsers.length > 0) {
      res.status(422).json({ message: "Username taken" })
    } else {
      next()
    }
  } else {
    res.status(400).json({ message: 'Username is required' })
  }
}

/*
  If the username in req.body does NOT exist in the database

  status 401
  {
    "message": "Invalid credentials"
  }
*/
function checkUsernameExists(req, res, next) {
  if (!req.body.username) {
    res.status(400).json({ message: 'Invalid username' })
  } else {
    let existingUser = users.findBy((u) => u.username == req.body.username)
    if (existingUser.length > 0) {
      next()
    } else {
      res.status(401).json({ message: 'Invalid credentials' })
    }
  }
}

/*
  If password is missing from req.body, or if it's 3 chars or shorter

  status 422
  {
    "message": "Password must be longer than 3 chars"
  }
*/
function checkPasswordLength() {
  if (req.body.password && req.body.password.length > 3) {
    next()
  } else {
    res.status(422).json({ message: 'Password must be longer than 3 chars' })
  }
}

// Don't forget to add these to the `exports` object so they can be required in other modules

module.exports = {
  restricted,
  checkUsernameFree,
  checkUsernameExists,
  checkPasswordLength
}