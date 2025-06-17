import { useState } from "react"
import ChatBot from "./ChatBot"
import LoginScreen from "./LoginScreen"
import "./App.css"

function App() {
  const [showLoginScreen, setShowLoginScreen] = useState(false)

  return (
      <div className="container">
        {!showLoginScreen && (
            <ChatBot setShowLoginScreen={setShowLoginScreen} />
        )}
        {showLoginScreen && (
            <LoginScreen setShowLoginScreen={setShowLoginScreen} />
        )}
      </div>
  )
}

export default App