const express = require('express')
const router = express.Router()
const { getAllQuotesInCategory, addQuote, updateQuote, deleteQuote } = require('../controllers/quoteController')
const { checkEditor } = require('../middleware/auth')

// GET /quotes/categories/:categoryId/quotes - Get all quotes in category (public)
router.get('/categories/:categoryId/quotes', getAllQuotesInCategory)

// POST /quotes - Add quote (editor only)
router.post('/', checkEditor, addQuote)

// PUT /quotes/:quoteId - Update quote (editor only)
router.put('/:quoteId', checkEditor, updateQuote)

// DELETE /quotes/:quoteId - Delete quote (editor only)
router.delete('/:quoteId', checkEditor, deleteQuote)

module.exports = router
