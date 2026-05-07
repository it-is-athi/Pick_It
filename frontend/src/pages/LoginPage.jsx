import { useState } from 'react'
import '../styles/LoginPage.css'

function LoginPage({ onLogin }) {
  const [isRegistering, setIsRegistering] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('viewer')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const endpoint = isRegistering ? '/auth/register' : '/auth/login'
      const body = isRegistering 
        ? { username, password, role }
        : { username, password }

      const response = await fetch(`http://localhost:3000${endpoint}`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      const data = await response.json()

      if (data.success) {
        onLogin({
          username: data.user.username,
          role: data.user.role
        })
      } else {
        setError(data.message)
      }
    } catch (err) {
      setError('Error: Could not connect to server')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Quote Picker 💭</h1>
        <h2>{isRegistering ? 'Create Account' : 'Login'}</h2>
        
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            disabled={loading}
          />
          
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />

          {isRegistering && (
            <select 
              value={role} 
              onChange={(e) => setRole(e.target.value)}
              disabled={loading}
            >
              <option value="viewer">Viewer (Read Only)</option>
              <option value="editor">Editor (Can Add/Edit)</option>
            </select>
          )}

          {error && <p className="error">{error}</p>}

          <button type="submit" disabled={loading}>
            {loading ? 'Loading...' : (isRegistering ? 'Register' : 'Login')}
          </button>
        </form>

        <p className="toggle">
          {isRegistering ? 'Already have an account? ' : "Don't have an account? "}
          <button
            type="button"
            onClick={() => {
              setIsRegistering(!isRegistering)
              setError('')
            }}
            disabled={loading}
          >
            {isRegistering ? 'Login' : 'Register'}
          </button>
        </p>
      </div>
    </div>
  )
}

export default LoginPage
