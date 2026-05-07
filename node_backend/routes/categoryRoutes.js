const express = require('express')
const router = express.Router()
const { getAllCategories, addCategory, updateCategory, deleteCategory } = require('../controllers/categoryController')
const { checkEditor } = require('../middleware/auth')

// GET /categories - Get all categories (public)
router.get('/', getAllCategories)

// POST /categories - Add category (editor only)
router.post('/', checkEditor, addCategory)

// PUT /categories/:categoryId - Update category (editor only)
router.put('/:categoryId', checkEditor, updateCategory)

// DELETE /categories/:categoryId - Delete category (editor only)
router.delete('/:categoryId', checkEditor, deleteCategory)

module.exports = router
