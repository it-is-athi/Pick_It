import { useState, useEffect } from 'react'
import '../styles/QuoteManagementPage.css'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

function QuoteManagementPage({ user, categoryId, onBack, onLogout }) {
  const [category, setCategory] = useState(null)
  const [quotes, setQuotes] = useState([])
  const [newQuoteText, setNewQuoteText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [editingQuoteId, setEditingQuoteId] = useState(null)
  const [editingQuoteText, setEditingQuoteText] = useState('')

  // Fetch category and quotes on page load
  useEffect(() => {
    fetchCategoryAndQuotes()
  }, [categoryId])

  const fetchCategoryAndQuotes = async () => {
    try {
      // Get category details
      const categoryResponse = await fetch(`${BACKEND_URL}/categories`, {
        credentials: 'include'
      })
      const categoriesData = await categoryResponse.json()
      if (categoriesData.success) {
        const foundCategory = categoriesData.categories.find(c => c.id === categoryId)
        setCategory(foundCategory)
      }

      // Get quotes for this category
      const quotesResponse = await fetch(
        `${BACKEND_URL}/quotes/categories/${categoryId}/quotes`,
        { credentials: 'include' }
      )
      const quotesData = await quotesResponse.json()
      if (quotesData.success) {
        setQuotes(quotesData.quotes)
      }
    } catch (err) {
      setError('Failed to fetch data')
    }
  }

  // Handle adding a new quote
  const handleAddQuote = async (e) => {
    e.preventDefault()
    if (!newQuoteText.trim()) {
      setError('Quote cannot be empty')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch(`${BACKEND_URL}/quotes`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          categoryId: categoryId,
          text: newQuoteText
        })
      })

      const data = await response.json()

      if (data.success) {
        setNewQuoteText('')
        fetchCategoryAndQuotes() // Refresh quotes
      } else {
        setError(data.message)
      }
    } catch (err) {
      setError('Error adding quote')
    } finally {
      setLoading(false)
    }
  }

  // Handle editing a quote
  const handleEditQuote = async (e) => {
    e.preventDefault()
    if (!editingQuoteText.trim()) {
      setError('Quote cannot be empty')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch(`${BACKEND_URL}/quotes/${editingQuoteId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: editingQuoteText })
      })

      const data = await response.json()

      if (data.success) {
        setEditingQuoteId(null)
        setEditingQuoteText('')
        fetchCategoryAndQuotes()
      } else {
        setError(data.message)
      }
    } catch (err) {
      setError('Error editing quote')
    } finally {
      setLoading(false)
    }
  }

  // Handle deleting a quote
  const handleDeleteQuote = async (quoteId) => {
    if (!window.confirm('Are you sure you want to delete this quote?')) {
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch(`${BACKEND_URL}/quotes/${quoteId}`, {
        method: 'DELETE',
        credentials: 'include'
      })

      const data = await response.json()

      if (data.success) {
        fetchCategoryAndQuotes()
      } else {
        setError(data.message)
      }
    } catch (err) {
      setError('Error deleting quote')
    } finally {
      setLoading(false)
    }
  }

  if (!category) {
    return <div className="loading">Loading...</div>
  }

  return (
    <div className="quote-management-page">
      {/* Header */}
      <div className="qm-header">
        <button className="btn-back" onClick={onBack}>← Back to Editor</button>
        <h1>📝 Manage Quotes: {category.name}</h1>
        <button className="btn-logout" onClick={onLogout}>Logout</button>
      </div>

      {/* Error message */}
      {error && <div className="error-message">{error}</div>}

      {/* Add Quote Section */}
      <div className="section add-quote-section">
        <h2>➕ Add New Quote</h2>
        <form onSubmit={handleAddQuote}>
          <textarea
            placeholder="Enter your quote here..."
            value={newQuoteText}
            onChange={(e) => setNewQuoteText(e.target.value)}
            disabled={loading}
            rows="3"
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Adding...' : 'Add Quote'}
          </button>
        </form>
      </div>

      {/* Quotes List */}
      <div className="section quotes-section">
        <h2>💬 All Quotes ({quotes.length})</h2>
        {quotes.length === 0 ? (
          <p className="no-data">No quotes yet. Add one above!</p>
        ) : (
          <div className="quotes-list">
            {quotes.map((quote) => (
              <div key={quote.id} className="quote-item">
                {editingQuoteId === quote.id ? (
                  // Edit Mode
                  <form onSubmit={handleEditQuote}>
                    <textarea
                      value={editingQuoteText}
                      onChange={(e) => setEditingQuoteText(e.target.value)}
                      disabled={loading}
                    />
                    <div className="quote-actions">
                      <button type="submit" disabled={loading}>
                        {loading ? 'Saving...' : 'Save'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingQuoteId(null)
                          setEditingQuoteText('')
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  // View Mode
                  <>
                    <p className="quote-text">"{quote.text}"</p>
                    <div className="quote-actions">
                      <button
                        className="btn-edit"
                        onClick={() => {
                          setEditingQuoteId(quote.id)
                          setEditingQuoteText(quote.text)
                        }}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => handleDeleteQuote(quote.id)}
                        disabled={loading}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default QuoteManagementPage
