// MainApp.jsx - Main viewer interface for users to select categories and view quotes
import { useState, useEffect } from 'react'
import '../styles/MainApp.css'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

function MainApp({ user, onLogout, onGoToEditor }) {
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

  const fetchQuotes = async (categoryId) => {
    setLoading(true)
    setError('')
    try {
      const response = await fetch(`${BACKEND_URL}/quotes/categories/${categoryId}/quotes`, {
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
      await fetch(`${BACKEND_URL}/auth/logout`, {
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
        <span className="user-greeting">Deeeiiii <span className="username-highlight">{user.username}</span></span>
        <h1>❤️ Pick One Today</h1>
        <div className="user-info">
          {user.role === 'editor' && (
            <button onClick={onGoToEditor} className="editor-btn">
              ✏️ Editor Mode
            </button>
          )}
          <button onClick={handleLogout} className="logout-btn">Bye di</button>
        </div>
      </header>

      <div className="container">
        <div className="categories-section">
          <h2>How are you feeling right now nga???</h2>
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
            <h2>Athi's Reply :</h2>
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
          </div>
        )}
      </div>
    </div>
  )
}

export default MainApp
