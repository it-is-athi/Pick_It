import { useState, useEffect } from 'react'
import LoginPage from './pages/LoginPage'
import MainApp from './pages/MainApp'
import EditorPage from './pages/EditorPage'
import QuoteManagementPage from './pages/QuoteManagementPage'
import './App.css'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState('main') // 'main', 'editor', 'quotes'
  const [selectedCategory, setSelectedCategory] = useState(null) // For quote management

  useEffect(() => {
    // Check if user is already logged in (session exists)
    // For now, check localStorage as a simple session tracker
    const loggedInUser = localStorage.getItem('currentUser')
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser))
    }
    setLoading(false)
  }, [])

  const handleLogin = (userData) => {
    setUser(userData)
    localStorage.setItem('currentUser', JSON.stringify(userData))
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('currentUser')
  }

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  // If not logged in, show LoginPage
  if (!user) {
    return <LoginPage onLogin={handleLogin} />
  }

  // If logged in, show appropriate page based on role and currentPage
  if (user.role === 'editor') {
    // Editor can access editor page
    if (currentPage === 'editor') {
      return (
        <EditorPage 
          user={user} 
          onLogout={handleLogout}
          onSelectCategory={(categoryId) => {
            setSelectedCategory(categoryId)
            setCurrentPage('quotes')
          }}
          onBackToEditor={() => setCurrentPage('editor')}
        />
      )
    } else if (currentPage === 'quotes') {
      return (
        <QuoteManagementPage
          user={user}
          categoryId={selectedCategory}
          onBack={() => setCurrentPage('editor')}
          onLogout={handleLogout}
        />
      )
    } else {
      // Default to MainApp, with button to go to EditorPage
      return (
        <MainApp 
          user={user} 
          onLogout={handleLogout}
          onGoToEditor={() => setCurrentPage('editor')}
        />
      )
    }
  } else {
    // Viewer can only see MainApp (card deck)
    return (
      <MainApp 
        user={user} 
        onLogout={handleLogout}
      />
    )
  }
}

export default App
