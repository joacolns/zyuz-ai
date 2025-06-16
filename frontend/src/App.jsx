import { useState, useRef, useEffect } from 'react'
import './App.css'
import { FiSend } from 'react-icons/fi'

function App() {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([])
  const chatEndRef = useRef(null)

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage = { role: 'user', content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput('')

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      })

      const data = await res.json()
      const botMessage = {
        role: 'assistant',
        content: data.response || 'Sin respuesta del servidor'
      }

      setMessages((prev) => [...prev, botMessage])
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Error de red o del servidor.' }
      ])
    }
  }

  // Scroll automático hacia abajo cuando cambia el chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className="chat-wrapper">
      <div className="chat-window">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.role === 'user' ? 'user' : 'bot'}`}
          >
            {msg.content}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <div className="input-area">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribí tu mensaje..."
          rows={1}
        />
        <button onClick={handleSend}>
          <FiSend size={20} />
        </button>
      </div>
    </div>
  )
}

export default App
