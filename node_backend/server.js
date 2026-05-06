// Step 1: Import Express
const express = require('express')

// Step 2: Create an Express app
const app = express()

// Step 3: Define a route - when someone visits http://localhost:3000/
app.get('/', (req, res) => {
    res.send('Hello from backend!')
})

// Step 4: Start the server on port 3000
const port = 3000
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
})
