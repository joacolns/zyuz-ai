import { useState, useEffect, useRef } from "react"
import { HiTrash } from "react-icons/hi"

function ChatBot({ setShowLoginScreen }) {
    const [input, setInput] = useState("")
    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(false)
    const messagesEndRef = useRef(null)
    const [typingMessageId, setTypingMessageId] = useState(null)

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

    const formatTime = (date) => {
        return date.toLocaleTimeString("es-ES", {
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    const typeMessage = (messageId, fullText, speed = 30) => {
        return new Promise((resolve) => {
            let currentIndex = 0
            setTypingMessageId(messageId)

            const typeInterval = setInterval(() => {
                if (currentIndex <= fullText.length) {
                    setMessages((prev) =>
                        prev.map((msg) =>
                            msg.id === messageId
                                ? { ...msg, text: fullText.substring(0, currentIndex) }
                                : msg
                        )
                    )
                    currentIndex++
                } else {
                    clearInterval(typeInterval)
                    setTypingMessageId(null)
                    resolve()
                }
            }, speed)
        })
    }

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

        const contextMessages = messages.map((m) => ({
            role: m.sender === "user" ? "user" : "assistant",
            content: m.text,
        }))
        contextMessages.push({ role: "user", content: input })

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messages: contextMessages }),
            })

            const data = await res.json()
            const reply = data.choices?.[0]?.message?.content || "Sin respuesta"
            const aiMessageId = Date.now() + 1

            setMessages((prev) => [
                ...prev,
                {
                    id: aiMessageId,
                    text: "",
                    sender: "ai",
                    timestamp: new Date(),
                },
            ])
            setLoading(false)
            await typeMessage(aiMessageId, reply)
        } catch (err) {
            console.error(err)
            const errorMessageId = Date.now() + 1
            setMessages((prev) => [
                ...prev,
                {
                    id: errorMessageId,
                    text: "",
                    sender: "ai",
                    timestamp: new Date(),
                },
            ])
            setLoading(false)
            await typeMessage(errorMessageId, "Error al conectar con el backend.")
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

    return (
        <>
            <div className="header">
                <h1>¿En qué puedo ayudarte hoy?</h1>
                {messages.length > 0 && (
                    <button
                        onClick={clearHistory}
                        className="clear-button"
                        title="Limpiar historial"
                    >
                        <HiTrash size={16} />
                        Limpiar historial
                    </button>
                )}
            </div>

            <div className="login-container">
                <button
                    className="login-button"
                    onClick={() => setShowLoginScreen(true)}
                >
                    Iniciar Sesión
                </button>
            </div>

            {messages.length > 0 && (
                <div className="messages-container">
                    {messages.map((message) => (
                        <div key={message.id} className={`message ${message.sender}`}>
                            <div className="message-content">
                                {message.sender === "ai" && (
                                    <div className="ai-avatar">Z</div>
                                )}
                                <div className="message-bubble">
                                    <p className="message-text">
                                        {message.text}
                                        {typingMessageId === message.id && (
                                            <span className="typing-cursor">|</span>
                                        )}
                                    </p>
                                    <span className="message-time">
                    {formatTime(message.timestamp)}
                  </span>
                                </div>
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div className="message ai">
                            <div className="message-content">
                                <div className="ai-avatar">Z</div>
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

                    <button
                        className="send-button"
                        onClick={handleSend}
                        disabled={loading || !input.trim()}
                    >
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
                    Escribe tu pregunta y presiona Enter o haz clic en el botón para
                    enviar
                </div>
            )}

            <a
                href="https://github.com/joacolns/zyuz-ai"
                target="_blank"
                rel="noopener noreferrer"
                className="github-button"
                title="Ver en GitHub"
            >
            </a>
        </>
    )
}

export default ChatBot