// Require the `restricted` middleware from `auth-middleware.js`. You will need it here!
const router = require('express').Router()
const users = require('/users-model.js')
const middleware = require('../auth/auth-middleware.js')

/**
  [GET] /api/users

  This endpoint is RESTRICTED: only authenticated clients
  should have access.

  response:
  status 200
  [
    {
      "user_id": 1,
      "username": "bob"
    },
    // etc
  ]

  response on non-authenticated:
  status 401
  {
    "message": "You shall not pass!"
  }
 */
router.get('/api/users', middleware.restricted, async (req, res) => {
  const allUsers = await users.find()
  res.status(200).json(allUsers)
})

// Don't forget to add the router to the `exports` object so it can be required in other modules
module.exports = router;