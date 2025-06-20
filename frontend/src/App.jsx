import { useState, useEffect } from "react";
import ChatBot from "./ChatBot";
import LoginScreen from "./LoginScreen";
import "./App.css";
import axios from "axios";

axios.defaults.baseURL = window.location.hostname === "localhost"
    ? "http://localhost:5169"
    : "http://host.docker.internal:5169";

function App() {
    const [showLoginScreen, setShowLoginScreen] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

            // Verificar si el token es válido
            axios.get("/api/auth/validate")
                .then(response => {
                    if (response.data.success) {
                        setUser(response.data.user);
                        setShowLoginScreen(false);
                    }
                })
                .catch(() => {
                    localStorage.removeItem("token");
                    delete axios.defaults.headers.common["Authorization"];
                });
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        delete axios.defaults.headers.common["Authorization"];
        setUser(null);
        setShowLoginScreen(true);
    };

    return (
        <div className="container">
            {!showLoginScreen ? (
                <ChatBot
                    setShowLoginScreen={setShowLoginScreen}
                    user={user}
                    onLogout={handleLogout}
                />
            ) : (
                <LoginScreen
                    setShowLoginScreen={setShowLoginScreen}
                    setUser={setUser}
                />
            )}
        </div>
    );
}

export default App;