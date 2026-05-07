const db = require('../config/database')

// Get all categories
const getAllCategories = (req, res) => {
    const query = 'SELECT * FROM categories'
    db.all(query, [], (err, categories) => {
        if (err) {
            return res.status(500).json({ 
                success: false, 
                message: 'Error fetching categories' 
            })
        }

        return res.status(200).json({ 
            success: true, 
            categories: categories
        })
    })
}

// Add a new category
const addCategory = (req, res) => {
    const { name } = req.body

    if (!name) {
        return res.status(400).json({ 
            success: false, 
            message: 'name is required' 
        })
    }

    const query = 'INSERT INTO categories (name) VALUES (?)'
    db.run(query, [name], function(err) {
        if (err) {
            return res.status(500).json({ 
                success: false, 
                message: 'Error adding category' 
            })
        }

        return res.status(201).json({ 
            success: true, 
            message: 'Category added successfully',
            categoryId: this.lastID
        })
    })
}

// Update a category
const updateCategory = (req, res) => {
    const { categoryId } = req.params
    const { name } = req.body

    if (!name) {
        return res.status(400).json({ 
            success: false, 
            message: 'name is required' 
        })
    }

    const query = 'UPDATE categories SET name = ? WHERE id = ?'
    db.run(query, [name, categoryId], function(err) {
        if (err) {
            return res.status(500).json({ 
                success: false, 
                message: 'Error updating category' 
            })
        }

        if (this.changes === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'Category not found' 
            })
        }

        return res.status(200).json({ 
            success: true, 
            message: 'Category updated successfully' 
        })
    })
}

// Delete a category
const deleteCategory = (req, res) => {
    const { categoryId } = req.params

    const query = 'DELETE FROM categories WHERE id = ?'
    db.run(query, [categoryId], function(err) {
        if (err) {
            return res.status(500).json({ 
                success: false, 
                message: 'Error deleting category' 
            })
        }

        if (this.changes === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'Category not found' 
            })
        }

        return res.status(200).json({ 
            success: true, 
            message: 'Category deleted successfully' 
        })
    })
}

module.exports = {
    getAllCategories,
    addCategory,
    updateCategory,
    deleteCategory
}
