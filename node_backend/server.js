// Step 1: Import dotenv
require('dotenv').config()

// Step 2: Import Express
const express = require('express')
const session = require('express-session')
const cors = require('cors')
const cron = require('node-cron')

// Step 3: Import Database
const db = require('./config/database')

// Step 4: Import Routes
const authRoutes = require('./routes/authRoutes')
const quoteRoutes = require('./routes/quoteRoutes')
const categoryRoutes = require('./routes/categoryRoutes')

// Step 5: Create an Express app
const app = express()

// Step 6: Middleware - Parse JSON requests
app.use(express.json())

// Step 6b: Middleware - Enable CORS
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}))

// Step 7: Middleware - Configure Sessions
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 2 // 2 hours in milliseconds
    }
}))

// Step 8: Use Routes
app.use('/auth', authRoutes)
app.use('/quotes', quoteRoutes)
app.use('/categories', categoryRoutes)

// Step 9: Test route
app.get('/', (req, res) => {
    res.send('Welcome to Quote Picker API!')
})

// Step 9b: Health check endpoint (for keep-alive pings)
app.get('/health', (req, res) => {
    res.json({ status: 'alive', timestamp: new Date(), message: 'Backend is running!' })
})

// Step 10: Start the server
const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
    console.log('Keep-alive job will start in 30 seconds...')
    
    // Step 10b: Self-ping every 5 minutes to prevent Render spin-down
    setTimeout(() => {
        cron.schedule('*/5 * * * *', () => {
            const baseUrl = process.env.RENDER_EXTERNAL_URL || `http://localhost:${port}`
            fetch(`${baseUrl}/health`)
                .then(res => res.json())
                .then(data => console.log(`✓ Keep-alive ping sent: ${data.timestamp}`))
                .catch(err => console.log(`✗ Ping error: ${err.message}`))
        })
        console.log('✓ Keep-alive cron job started (pings every 5 minutes)')
    }, 30000) // Start after 30 seconds
})
