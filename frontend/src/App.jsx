"use client"

import { useState, useEffect } from "react"
import { FaGithub } from "react-icons/fa"
import "./App.css"

function App() {
  const [input, setInput] = useState("")
  const [response, setResponse] = useState("")
  const [loading, setLoading] = useState(false)

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
    }, 3000) // Cambia cada 3 segundos

    return () => clearInterval(interval)
  }, [])

  const handleSend = async () => {
    if (!input.trim()) return
    setLoading(true)

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      })

      const data = await res.json()
      const reply = data.choices?.[0]?.message?.content || "Sin respuesta"
      setResponse(reply)
    } catch (err) {
      console.error(err)
      setResponse("Error al conectar con el backend.")
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

  return (
    <div className="container">
      <div className="header">
        <h1>¿En qué puedo ayudarte?</h1>
      </div>

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
            {loading ? <div className="loading-spinner"></div> : <div className="arrow"></div>}
          </button>
        </div>
      </div>

      {response && (
        <div className="response">
          <div className="response-header">
            <div className="ai-avatar">AI</div>
          </div>
          <p className="response-content">{response}</p>
        </div>
      )}

      {!response && (
        <div className="instructions">Escribe tu pregunta y presiona Enter o haz clic en el botón para enviar</div>
      )}

      {/* Botón de GitHub con react-icons */}
      <a
        href="https://github.com/joacolns/zyuz-ai"
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
