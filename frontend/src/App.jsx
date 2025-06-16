import { useState } from 'react'
import './App.css'

function App() {
  const [input, setInput] = useState('')
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSend = async () => {
    if (!input.trim()) return
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      })

      const data = await res.json()
      const reply = data.choices?.[0]?.message?.content || 'Sin respuesta'
      setResponse(reply)
    } catch (err) {
      console.error(err)
      setResponse('Error al conectar con el backend.')
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="container">
      <h1>¿Como puedo ayudarte hoy?</h1>
      <textarea
        rows={4}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Pregunta lo que quieras"
      />
      <button onClick={handleSend} disabled={loading}>
        {loading ? 'Cargando...' : 'Enviar'}
      </button>
      {response && (
        <div className="response">
          <strong>Respuesta:</strong>
          <p>{response}</p>
        </div>
      )}
    </div>
  )
}

export default App
