import { useState, useEffect } from 'react'
import '../styles/EditorPage.css'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

function EditorPage({ user, onLogout, onSelectCategory, onBackToEditor, onGoToViewer }) {
  const [categories, setCategories] = useState([])
  const [newCategoryName, setNewCategoryName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedCategoryForModal, setSelectedCategoryForModal] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingCategoryId, setEditingCategoryId] = useState(null)
  const [editingCategoryName, setEditingCategoryName] = useState('')

  // Fetch all categories on page load
  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/categories`, {
        credentials: 'include'
      })
      const data = await response.json()
      if (data.success) {
        setCategories(data.categories)
      }
    } catch (err) {
      setError('Failed to fetch categories')
    }
  }

  // Handle adding a new category
  const handleAddCategory = async (e) => {
    e.preventDefault()
    if (!newCategoryName.trim()) {
      setError('Category name cannot be empty')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch(`${BACKEND_URL}/categories`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCategoryName })
      })

      const data = await response.json()

      if (data.success) {
        setNewCategoryName('')
        fetchCategories() // Refresh list
      } else {
        setError(data.message)
      }
    } catch (err) {
      setError('Error adding category')
    } finally {
      setLoading(false)
    }
  }

  // Handle editing a category
  const handleEditCategory = async (e) => {
    e.preventDefault()
    if (!editingCategoryName.trim()) {
      setError('Category name cannot be empty')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch(`${BACKEND_URL}/categories/${editingCategoryId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editingCategoryName })
      })

      const data = await response.json()

      if (data.success) {
        setEditingCategoryId(null)
        setEditingCategoryName('')
        setModalOpen(false)
        fetchCategories()
      } else {
        setError(data.message)
      }
    } catch (err) {
      setError('Error editing category')
    } finally {
      setLoading(false)
    }
  }

  // Handle deleting a category
  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm('Are you sure you want to delete this category?')) {
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch(`${BACKEND_URL}/categories/${categoryId}`, {
        method: 'DELETE',
        credentials: 'include'
      })

      const data = await response.json()

      if (data.success) {
        setModalOpen(false)
        fetchCategories()
      } else {
        setError(data.message)
      }
    } catch (err) {
      setError('Error deleting category')
    } finally {
      setLoading(false)
    }
  }

  // Open modal to show options (Edit or Add Quote)
  const openCategoryModal = (category) => {
    setSelectedCategoryForModal(category)
    setEditingCategoryName(category.name)
    setModalOpen(true)
  }

  // Close modal
  const closeCategoryModal = () => {
    setModalOpen(false)
    setSelectedCategoryForModal(null)
    setEditingCategoryId(null)
    setEditingCategoryName('')
  }

  return (
    <div className="editor-page">
      {/* Header */}
      <div className="editor-header">
        <h1>✨ Quote Editor Dashboard</h1>
        <div className="header-actions">
          <span className="user-info">Welcome, <span className="username-highlight">{user.username}</span></span>
          <button className="btn-viewer" onClick={onGoToViewer}>👁️ Viewer Mode</button>
          <button className="btn-logout" onClick={onLogout}>Logout</button>
        </div>
      </div>

      {/* Error message */}
      {error && <div className="error-message">{error}</div>}

      {/* Add Category Section */}
      <div className="section add-category-section">
        <h2>➕ Add New Category</h2>
        <form onSubmit={handleAddCategory}>
          <input
            type="text"
            placeholder="Enter category name (e.g., 'Pick when you miss me')"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            disabled={loading}
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Adding...' : 'Add Category'}
          </button>
        </form>
      </div>

      {/* Categories List */}
      <div className="section categories-section">
        <h2>📚 All Categories</h2>
        {categories.length === 0 ? (
          <p className="no-data">No categories yet. Create one above!</p>
        ) : (
          <div className="categories-grid">
            {categories.map((category) => (
              <div
                key={category.id}
                className="category-card"
                onClick={() => openCategoryModal(category)}
              >
                <div className="category-name">{category.name}</div>
                <div className="category-action">Click to manage</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal - Category Options */}
      {modalOpen && selectedCategoryForModal && (
        <div className="modal-overlay" onClick={closeCategoryModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            {editingCategoryId ? (
              // Edit Category Form
              <>
                <h3>Edit Category</h3>
                <form onSubmit={handleEditCategory}>
                  <input
                    type="text"
                    value={editingCategoryName}
                    onChange={(e) => setEditingCategoryName(e.target.value)}
                    disabled={loading}
                  />
                  <div className="modal-buttons">
                    <button type="submit" disabled={loading}>
                      {loading ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingCategoryId(null)
                        setEditingCategoryName('')
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </>
            ) : (
              // Options Menu
              <>
                <h3>{selectedCategoryForModal.name}</h3>
                <div className="modal-options">
                  <button
                    className="option-btn edit-btn"
                    onClick={() => setEditingCategoryId(selectedCategoryForModal.id)}
                  >
                    ✏️ Edit Category
                  </button>
                  <button
                    className="option-btn add-quote-btn"
                    onClick={() => {
                      closeCategoryModal()
                      onSelectCategory(selectedCategoryForModal.id)
                    }}
                  >
                    ➕ Add/Manage Quotes
                  </button>
                  <button
                    className="option-btn delete-btn"
                    onClick={() =>
                      handleDeleteCategory(selectedCategoryForModal.id)
                    }
                    disabled={loading}
                  >
                    🗑️ Delete Category
                  </button>
                </div>
              </>
            )}
            <button
              className="modal-close"
              onClick={closeCategoryModal}
              disabled={editingCategoryId !== null}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default EditorPage
