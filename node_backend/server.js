// Step 1: Import dotenv
require('dotenv').config()

// Step 2: Import Express
const express = require('express')
const session = require('express-session')

// Step 3: Import Database
const db = require('./config/database')

// Step 4: Import Routes
const authRoutes = require('./routes/authRoutes')

// Step 5: Create an Express app
const app = express()

// Step 6: Middleware - Parse JSON requests
app.use(express.json())

// Step 7: Middleware - Configure Sessions
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        maxAge: 1000 * 60 * 60 * 2 // 2 hours in milliseconds
    }
}))

// Step 8: Use Auth Routes
app.use('/auth', authRoutes)

// Step 9: Test route - when someone visits http://localhost:3000/
app.get('/', (req, res) => {
    res.send('Hello from backend!')
})

// Step 10: Start the server
const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
})
