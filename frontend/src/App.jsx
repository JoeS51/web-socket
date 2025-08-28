import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import io from 'socket.io-client'

const socket = io('http://localhost:3000')

socket.on

function App() {
  const [count, setCount] = useState(0)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to server')
    })

    socket.on('chat', (msg) => {
      console.log('Message from server:', msg)
      setMessages(prev => [...prev, msg])
    })
  }, [])

  useEffect(() => {
    console.log("new msg")
  }, [messages])

  const submitMessage = (e) => {
    e.preventDefault()
    socket.emit('chat', message)
    setMessage('')
  }

  const messageChange = (e) => {
    setMessage(e.target.value)
  }

  return (
    <>
      <div>
        {messages.map((msg, index) => (
          <p key={index}>{msg}</p>
        ))}
        <input id="input" onInput={messageChange} value={message} /><button onClick={submitMessage}>Send</button>
      </div>
    </>
  )
}

export default App
