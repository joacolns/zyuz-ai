"use client"

import { useState, useEffect, useRef } from "react"
import { FaGithub } from "react-icons/fa"
import { HiTrash } from "react-icons/hi"
import "./App.css"

function App() {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const placeholders = [
    "Pregunta lo que quieras",
    "Ayúdame a crear una base de datos",
    "Ayúdame con este código",
    "Explícame cómo funciona React",
    "Crea una función en JavaScript",
    "Ayúdame a diseñar una API",
    "¿Cómo optimizo mi sitio web?",
    "Explícame los hooks de React",
    "Ayúdame con CSS Grid",
    "¿Cómo conectar a una base de datos?",
    "Crea un componente reutilizable",
    "Ayúdame a debuggear este error",
    "¿Cómo implemento autenticación?",
    "Explícame async/await",
    "Ayúdame con responsive design",
  ]

  const [currentPlaceholder, setCurrentPlaceholder] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPlaceholder((prev) => (prev + 1) % placeholders.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage = {
      id: Date.now(),
      text: input,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setLoading(true)

    const contextMessages = [
      ...messages.map((m) => ({
        role: m.sender === "user" ? "user" : "assistant",
        content: m.text,
      })),
      { role: "user", content: input },
    ]

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: contextMessages }),
      })

      const data = await res.json()
      const reply = data.choices?.[0]?.message?.content || "Sin respuesta"

      const aiMessage = {
        id: Date.now() + 1,
        text: reply,
        sender: "ai",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, aiMessage])
    } catch (err) {
      console.error(err)
      const errorMessage = {
        id: Date.now() + 1,
        text: "Error al conectar con el backend.",
        sender: "ai",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const clearHistory = () => {
    setMessages([])
  }

  const formatTime = (date) => {
    return date.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="container">
      <div className="header">
        <h1>¿En qué puedo ayudarte?</h1>
        {messages.length > 0 && (
          <button onClick={clearHistory} className="clear-button" title="Limpiar historial">
            <HiTrash size={16} />
            Limpiar historial
          </button>
        )}
      </div>

      {messages.length > 0 && (
        <div className="messages-container">
          {messages.map((message) => (
            <div key={message.id} className={`message ${message.sender}`}>
              <div className="message-content">
                {message.sender === "ai" && <div className="ai-avatar">AI</div>}
                <div className="message-bubble">
                  <p className="message-text">{message.text}</p>
                  <span className="message-time">{formatTime(message.timestamp)}</span>
                </div>
              </div>
            </div>
          ))}
          {loading && (
            <div className="message ai">
              <div className="message-content">
                <div className="ai-avatar">AI</div>
                <div className="message-bubble loading-message">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      )}

      <div className="input-container">
        <div className="input-wrapper">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholders[currentPlaceholder]}
            disabled={loading}
          />

          <div className="model-label">GPT-o4 mini</div>

          <button className="send-button" onClick={handleSend} disabled={loading || !input.trim()}>
            {loading ? (
              <div className="loading-spinner"></div>
            ) : (
              <div className="arrow" />
            )}
          </button>
        </div>
      </div>

      {messages.length === 0 && (
        <div className="instructions">
          Escribe tu pregunta y presiona Enter o haz clic en el botón para enviar
        </div>
      )}

      <a
        href="https://github.com"
        target="_blank"
        rel="noopener noreferrer"
        className="github-button"
        title="Ver en GitHub"
      >
        <FaGithub size={20} />
      </a>
    </div>
  )
}

export default App
