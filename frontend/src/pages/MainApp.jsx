import { useState, useEffect } from 'react'
import '../styles/MainApp.css'

function MainApp({ user, onLogout }) {
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [quotes, setQuotes] = useState([])
  const [randomQuote, setRandomQuote] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Fetch categories on load
  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:3000/categories', {
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

  const fetchQuotes = async (categoryId) => {
    setLoading(true)
    setError('')
    try {
      const response = await fetch(`http://localhost:3000/quotes/categories/${categoryId}/quotes`, {
        credentials: 'include'
      })
      const data = await response.json()
      if (data.success) {
        setQuotes(data.quotes)
        setRandomQuote(data.randomQuote)
        setSelectedCategory(categoryId)
      } else {
        setError(data.message)
      }
    } catch (err) {
      setError('Failed to fetch quotes')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:3000/auth/logout', {
        method: 'POST',
        credentials: 'include'
      })
      onLogout()
    } catch (err) {
      console.error('Logout error:', err)
    }
  }

  return (
    <div className="main-app">
      <header className="header">
        <h1>🎯 Quote Picker</h1>
        <div className="user-info">
          <span>{user.username} ({user.role})</span>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </header>

      <div className="container">
        <div className="categories-section">
          <h2>Categories</h2>
          <div className="categories-grid">
            {categories.map(cat => (
              <button
                key={cat.id}
                className={`category-btn ${selectedCategory === cat.id ? 'active' : ''}`}
                onClick={() => fetchQuotes(cat.id)}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {error && <p className="error">{error}</p>}

        {selectedCategory && (
          <div className="quotes-section">
            <h2>Quotes in Category</h2>
            {loading ? (
              <p>Loading...</p>
            ) : randomQuote ? (
              <div className="quote-display">
                <div className="quote-card">
                  <p className="quote-text">"{randomQuote.text}"</p>
                </div>
              </div>
            ) : (
              <p>No quotes in this category yet</p>
            )}

            {user.role === 'editor' && (
              <div className="editor-section">
                <h3>Add New Quote</h3>
                <input type="text" placeholder="Enter quote..." className="quote-input" />
                <button className="add-btn">Add Quote</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default MainApp
