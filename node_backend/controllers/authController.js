const db = require('../config/database')

// Register function
const registerUser = (req, res) => {
    const { username, password, role } = req.body

    // Validate input
    if (!username || !password || !role) {
        return res.status(400).json({ 
            success: false, 
            message: 'Username, password, and role are required' 
        })
    }

    // Validate role
    if (!['editor', 'viewer'].includes(role)) {
        return res.status(400).json({ 
            success: false, 
            message: 'Role must be "editor" or "viewer"' 
        })
    }

    // Insert user into database
    const query = 'INSERT INTO users (username, password, role) VALUES (?, ?, ?)'
    db.run(query, [username, password, role], function(err) {
        if (err) {
            // Check if it's a unique constraint error (duplicate username)
            if (err.message.includes('UNIQUE')) {
                return res.status(409).json({ 
                    success: false, 
                    message: 'Username already exists' 
                })
            }
            return res.status(500).json({ 
                success: false, 
                message: 'Error registering user' 
            })
        }
        return res.status(201).json({ 
            success: true, 
            message: 'User registered successfully',
            user: { username, role }
        })
    })
}

// Login function
const loginUser = (req, res) => {
    const { username, password } = req.body

    // Validate input
    if (!username || !password) {
        return res.status(400).json({ 
            success: false, 
            message: 'Username and password are required' 
        })
    }

    // Query database
    const query = 'SELECT * FROM users WHERE username = ?'
    db.get(query, [username], (err, user) => {
        if (err) {
            return res.status(500).json({ 
                success: false, 
                message: 'Database error' 
            })
        }

        // Check if user exists and password matches
        if (user && user.password === password) {
            // Create session
            req.session.userId = user.username
            req.session.role = user.role
            req.session.loggedIn = true

            return res.status(200).json({ 
                success: true, 
                message: 'Login successful',
                user: { username: user.username, role: user.role }
            })
        } else {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid username or password' 
            })
        }
    })
}

// Logout function
const logoutUser = (req, res) => {
    // Destroy session
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ 
                success: false, 
                message: 'Error logging out' 
            })
        }
        return res.status(200).json({ 
            success: true, 
            message: 'Logged out successfully' 
        })
    })
}

// Export functions
module.exports = {
    registerUser,
    loginUser,
    logoutUser
}
