// Import sqlite3
const sqlite3 = require('sqlite3').verbose()
const path = require('path')

// Create/connect to the database file
// path.join creates a file path: e:\Pick_It\node_backend\quotes.db
const dbPath = path.join(__dirname, '../quotes.db')
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err)
    } else {
        console.log('Connected to SQLite database at:', dbPath)
    }
})

// Create USERS table
db.run(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'viewer'
    )
`)

// Create CATEGORIES table
db.run(`
    CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL
    )
`)

// Create QUOTES table
db.run(`
    CREATE TABLE IF NOT EXISTS quotes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        categoryId INTEGER NOT NULL,
        text TEXT NOT NULL,
        FOREIGN KEY (categoryId) REFERENCES categories(id)
    )
`)

// Export the database connection
module.exports = db
