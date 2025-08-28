import { useState } from 'react'
import './login.css'
import { useNavigate } from 'react-router-dom'
const JOE_USERNAME = import.meta.env.VITE_JOE_HANDLE
const JOE_PASSWORD = import.meta.env.VITE_JOE_PW

function Login({ onLogin }) {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    rememberMe: false
  })
  const [status, setStatus] = useState({ message: '', type: '' })
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.username.trim() || !formData.password.trim()) {
      setStatus({ message: 'Please enter both username and password.', type: 'error' })
      return
    }

    setIsLoading(true)
    setStatus({ message: 'Logging in...', type: 'info' })

    try {
      // Simulate login process
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // For demo purposes, accept any non-empty credentials
      if (formData.username.trim() && formData.password.trim()) {
        setStatus({ message: 'Login successful!', type: 'success' })
        setTimeout(() => {
          if (onLogin) {
            onLogin(formData.username)
          }
        }, 500)
      } else {
        setStatus({ message: 'Invalid credentials. Please try again.', type: 'error' })
      }
    } catch (error) {
      setStatus({ message: 'Login failed. Please try again.', type: 'error' })
    } finally {
      setIsLoading(false)
    }
  }

  const onSubmit = () => {
    if (formData.username == JOE_USERNAME && formData.password == JOE_PASSWORD) {
      navigate('/')
    } else {
        console.log("WRONG")
      console.log(formData.username, JOE_USERNAME)
      setStatus({ message: 'Invalid credentials. Please try again.', type: 'error' })
    }
  }

  const handleCancel = () => {
    setFormData({
      username: '',
      password: '',
      rememberMe: false
    })
    setStatus({ message: '', type: '' })
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isLoading) {
      handleSubmit(e)
    }
  }

  return (
    <div className="login-desktop">
      <div className="login-window">
        <div className="login-title-bar">
          <div className="login-title-text">Windows Login</div>
          <div className="login-title-controls">
            <button className="login-title-control" aria-label="Minimize">_</button>
            <button className="login-title-control" aria-label="Maximize">□</button>
            <button className="login-title-control close" aria-label="Close">×</button>
          </div>
        </div>

        <div className="login-window-body">
          <div className="login-header">
            <div className="login-icon">🔐</div>
            <div className="login-title">Welcome Joe's Secret Chat</div>
            <div className="login-subtitle">Please enter your network password</div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="username">User name:</label>
              <input
                type="text"
                id="username"
                name="username"
                className="form-input"
                value={formData.username}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
                autoComplete="username"
                autoFocus
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                name="password"
                className="form-input"
                value={formData.password}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
                autoComplete="current-password"
              />
            </div>


            <div className="button-container">
              <button
                type="submit"
                className="login-button primary"
                disabled={isLoading || !formData.username.trim() || !formData.password.trim()}
                onClick={onSubmit}
              >
                {isLoading ? 'Wait...' : 'OK'}
              </button>
              <button
                type="button"
                className="login-button"
                onClick={handleCancel}
                disabled={isLoading}
              >
                Cancel
              </button>
            </div>
          </form>

          <div className="login-footer">
            <div className="login-version">Microsoft Windows 95 Build 950</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
