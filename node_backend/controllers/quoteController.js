const db = require('../config/database')

// Get all quotes in a category
const getAllQuotesInCategory = (req, res) => {
    const { categoryId } = req.params

    const query = 'SELECT * FROM quotes WHERE categoryId = ?'
    db.all(query, [categoryId], (err, quotes) => {
        if (err) {
            return res.status(500).json({ 
                success: false, 
                message: 'Error fetching quotes' 
            })
        }

        // Get random quote from the list
        let randomQuote = null
        if (quotes.length > 0) {
            randomQuote = quotes[Math.floor(Math.random() * quotes.length)]
        }

        return res.status(200).json({ 
            success: true, 
            quotes: quotes,
            randomQuote: randomQuote
        })
    })
}

// Add a new quote
const addQuote = (req, res) => {
    const { categoryId, text } = req.body

    // Validate input
    if (!categoryId || !text) {
        return res.status(400).json({ 
            success: false, 
            message: 'categoryId and text are required' 
        })
    }

    const query = 'INSERT INTO quotes (categoryId, text) VALUES (?, ?)'
    db.run(query, [categoryId, text], function(err) {
        if (err) {
            return res.status(500).json({ 
                success: false, 
                message: 'Error adding quote' 
            })
        }

        return res.status(201).json({ 
            success: true, 
            message: 'Quote added successfully',
            quoteId: this.lastID
        })
    })
}

// Update a quote
const updateQuote = (req, res) => {
    const { quoteId } = req.params
    const { text } = req.body

    if (!text) {
        return res.status(400).json({ 
            success: false, 
            message: 'text is required' 
        })
    }

    const query = 'UPDATE quotes SET text = ? WHERE id = ?'
    db.run(query, [text, quoteId], function(err) {
        if (err) {
            return res.status(500).json({ 
                success: false, 
                message: 'Error updating quote' 
            })
        }

        if (this.changes === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'Quote not found' 
            })
        }

        return res.status(200).json({ 
            success: true, 
            message: 'Quote updated successfully' 
        })
    })
}

// Delete a quote
const deleteQuote = (req, res) => {
    const { quoteId } = req.params

    const query = 'DELETE FROM quotes WHERE id = ?'
    db.run(query, [quoteId], function(err) {
        if (err) {
            return res.status(500).json({ 
                success: false, 
                message: 'Error deleting quote' 
            })
        }

        if (this.changes === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'Quote not found' 
            })
        }

        return res.status(200).json({ 
            success: true, 
            message: 'Quote deleted successfully' 
        })
    })
}

module.exports = {
    getAllQuotesInCategory,
    addQuote,
    updateQuote,
    deleteQuote
}
