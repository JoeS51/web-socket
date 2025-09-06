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
    const fetchMessages = async () => {
      const response = await fetch('http://localhost:3000/messages')
      const data = await response.json()
      const formattedMessages = data.map(message => ({
        text: message.message,
        timestamp: new Date(message.created_at).toLocaleString(),
        sender: message.user == 1 ? "Joe" : "Other"
      }))
      setMessages(formattedMessages)
    }

    fetchMessages()

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

    socket.on('chat', (data) => {
      console.log('Message from server:', data)
      setMessages(prev => [...prev, {
        text: data.message,
        timestamp: data.timestamp,
        sender: data.sender
      }])
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
      // Send message with sender info to server - server will handle both DB save and broadcast
      socket.emit('chat', { message: message, sender: username })
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
                  <div key={index} className={`message-item ${msg.sender?.toLowerCase() === 'joe' ? 'joe-message' : msg.sender?.toLowerCase() === 'Other' ? 'Other-message' : 'default-message'}`}>
                    <span className="message-time">[{msg.timestamp}]</span>
                    <span className="message-sender">{msg.sender}:</span>
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
