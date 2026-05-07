import { useState, useEffect } from 'react'
import LoginPage from './pages/LoginPage'
import MainApp from './pages/MainApp'
import './App.css'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

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

  return (
    <>
      {user ? (
        <MainApp user={user} onLogout={handleLogout} />
      ) : (
        <LoginPage onLogin={handleLogin} />
      )}
    </>
  )
}

export default App
