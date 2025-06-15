import { useState } from 'react'
import './App.css'

function App() {
  const [input, setInput] = useState('')
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSend = async () => {
    if(!input.trim()) return
    setLoading(true)

    try {
      const response = await fetch('/api/chat' , {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input }),
      })

      const data = await response.json()
      const reply = data.choices?.[0]?.message?.content || 'Sin respuesta'
      setResponse(reply)
    }catch(err){
      console.error('Error al enviar el mensaje:', err)
      setResponse('Error al conectar con el backend', err)
    }finally {
      setLoading(false)
      setInput('')
    }

  }

  return (
    <div className="container">
      <h1>ZYUZ</h1>
      <h2>ズズ</h2>
      <textarea
        rows={4}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder='Pregunta lo que quieras'
      />
      <button onClick={handleSend} disabled={loading}>
        {loading ? 'Enviando...' : 'Enviar'}
      </button>
      {response && (
        <div classname="response">
          <strong>Respuesta:</strong>
          <p>{response}</p>
        </div>  
      )}
    </div>
  )
}
export default App
