import { useEffect, useState } from 'react'
import './App.css'
import { socket } from './socket.jsx'
import { useLocation } from 'react-router-dom'

function App() {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const [isConnected, setIsConnected] = useState(false)
  const { username } = useLocation().state || { username: 'Guest' }

  useEffect(() => {
    const onConnect = () => {
      console.log('connected')
      setIsConnected(true)
    }

    const onDisconnect = () => {
      console.log('disconnected')
      setIsConnected(false)
    }

    socket.on('connect', onConnect)
    socket.on('disconnect', onDisconnect)

    socket.on('chat', (msg) => {
      console.log('Message from server:', msg)
      setMessages(prev => [...prev, { text: msg, timestamp: new Date().toLocaleTimeString() }])
    })

    return () => {
      socket.off('connect', onConnect)
      socket.off('disconnect', onDisconnect)
      socket.off('chat')
    }
  }, [])

  const submitMessage = (e) => {
    e.preventDefault()
    if (message.trim()) {
      socket.emit('chat', message)
      setMessage('')
    }
  }

  const messageChange = (e) => {
    setMessage(e.target.value)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      submitMessage(e)
    }
  }

  if (username === 'Guest') {
    return <h1>go to login</h1>
  }

  return (
    <div className="win95-desktop">
      <div className="chat-window">
        <div className="title-bar">
          <div className="title-bar-text">Welcome, {username}!</div>
          <div className="title-bar-controls">
            <button className="title-bar-control" aria-label="Minimize"></button>
            <button className="title-bar-control" aria-label="Maximize"></button>
            <button className="title-bar-control close" aria-label="Close"></button>
          </div>
        </div>

        <div className="window-body">
          <div className="status-bar">
            <span className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
              {isConnected ? '● Connected' : '○ Disconnected'}
            </span>
          </div>

          <div className="messages-container">
            <div className="messages-list">
              {messages.length === 0 ? (
                <div className="no-messages">No messages yet. Start chatting!</div>
              ) : (
                messages.map((msg, index) => (
                  <div key={index} className="message-item">
                    <span className="message-time">[{msg.timestamp}]</span>
                    <span className="message-text">{msg.text}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="input-container">
            <div className="input-group">
              <input
                type="text"
                className="message-input"
                placeholder="Type your message..."
                value={message}
                onChange={messageChange}
                onKeyPress={handleKeyPress}
                disabled={!isConnected}
              />
              <button
                className="send-button"
                onClick={submitMessage}
                disabled={!isConnected || !message.trim()}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
