// Require `checkUsernameFree`, `checkUsernameExists` and `checkPasswordLength`
// middleware functions from `auth-middleware.js`. You will need them here!
const router = require('express').Router()
const users = require('../users/users-model.js') 
const middleware = require('./auth-middleware.js')

/**
  1 [POST] /api/auth/register { "username": "sue", "password": "1234" }

  response:
  status 200
  {
    "user_id": 2,
    "username": "sue"
  }

  response on username taken:
  status 422
  {
    "message": "Username taken"
  }

  response on password three chars or less:
  status 422
  {
    "message": "Password must be longer than 3 chars"
  }
 */
router.post('/api/auth/register', middleware.checkUsernameFree, middleware.checkPasswordLength,  async (req, res) => {
  const {username, password} = req.body;
  try {
    const createdUser = await users.add({username, password})
    console.log(`created user: ${createdUser.username}`)
    res.status(201).json({ message: 'Account created!' })
  } catch (err) {
    res.status(500).json({ message: 'Unable to register' })
    console.log(err)
  }

})

/**
  2 [POST] /api/auth/login { "username": "sue", "password": "1234" }

  response:
  status 200
  {
    "message": "Welcome sue!"
  }

  response on invalid credentials:
  status 401
  {
    "message": "Invalid credentials"
  }
 */
router.post('/api/auth/login', middleware.checkUsernameExists, async (req, res) => {
  const {username, password} = req.body;
  try {
    const foundUsers = await users.findBy(user => user.username == username && user.password == password)
    req.session.user = foundUsers[0]
    res.status(200).json({ message: 'Login successful' })
  } catch (err) {
    res.status(500).json({ message: 'Login failed' })
    console.log(err)
  }
})

/**
  3 [GET] /api/auth/logout

  response for logged-in users:
  status 200
  {
    "message": "logged out"
  }

  response for not-logged-in users:
  status 200
  {
    "message": "no session"
  }
 */
router.post('/api/auth/logout', middleware.restricted, async (req, res) => {
  req.session.user = null
  res.status(200).json({ message: 'Logged out' })
})

 
// Don't forget to add the router to the `exports` object so it can be required in other modules
module.exports = router;