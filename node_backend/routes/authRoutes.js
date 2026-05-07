const express = require('express')
const router = express.Router()
const { registerUser, loginUser, logoutUser } = require('../controllers/authController')

// POST /auth/register - Register a new user
router.post('/register', registerUser)

// POST /auth/login - Login user
router.post('/login', loginUser)

// POST /auth/logout - Logout user
router.post('/logout', logoutUser)

module.exports = router
