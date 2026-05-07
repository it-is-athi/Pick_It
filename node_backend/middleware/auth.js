// Middleware to check if user is logged in
const checkLogin = (req, res, next) => {
    if (!req.session.loggedIn) {
        return res.status(401).json({ 
            success: false, 
            message: 'You must be logged in' 
        })
    }
    next()  // User is logged in, proceed to next handler
}

// Middleware to check if user is editor (can edit)
const checkEditor = (req, res, next) => {
    if (!req.session.loggedIn) {
        return res.status(401).json({ 
            success: false, 
            message: 'You must be logged in' 
        })
    }
    
    if (req.session.role !== 'editor') {
        return res.status(403).json({ 
            success: false, 
            message: 'You do not have permission to perform this action' 
        })
    }
    next()  // User is editor, proceed
}

module.exports = {
    checkLogin,
    checkEditor
}
