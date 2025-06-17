import { useState } from "react";
import axios from "axios";

function LoginScreen({ setShowLoginScreen, setUser }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isRegistering, setIsRegistering] = useState(false);
    const [email, setEmail] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        console.log("Iniciando proceso de autenticación...");

        try {
            const endpoint = isRegistering ? "/api/auth/register" : "/api/auth/login";

            // Ajuste clave: Usar las propiedades con mayúscula
            const payload = isRegistering
                ? {
                    Username: username,
                    Email: email,
                    Password: password
                }
                : {
                    User: username,
                    Password: password
                };

            console.log("Endpoint:", endpoint);
            console.log("Payload enviado:", JSON.stringify(payload, null, 2));

            const response = await axios.post(endpoint, payload, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            console.log("Respuesta recibida:", response.data);

            if (response.data.success) {
                localStorage.setItem("token", response.data.token);
                axios.defaults.headers.common["Authorization"] = `Bearer ${response.data.token}`;

                // Actualiza el estado del usuario con los datos de la respuesta
                setUser({
                    id: response.data.user.id,
                    username: response.data.user.username,
                    email: response.data.user.email
                });

                setShowLoginScreen(false);
            } else {
                setError(response.data.message || "La autenticación falló");
            }
        } catch (err) {
            let errorMessage = "Error desconocido";

            if (err.response) {
                // Error 400-599
                console.error("Detalles del error:", err.response.data);

                // Intenta obtener más detalles del error
                const errorDetails = err.response.data?.errors
                    ? JSON.stringify(err.response.data.errors)
                    : err.response.data?.message
                        ? err.response.data.message
                        : "Sin detalles adicionales";

                errorMessage = `Error ${err.response.status}: ${errorDetails}`;
            } else if (err.request) {
                // No se recibió respuesta
                errorMessage = "No se pudo conectar con el servidor. Verifica:";
                errorMessage += "\n- Que el backend está corriendo";
                errorMessage += `\n- Que estás usando la URL correcta: ${axios.defaults.baseURL}`;
                errorMessage += "\n- Que no hay problemas de red o firewall";
            } else {
                // Error en la configuración
                errorMessage = `Error de configuración: ${err.message}`;
            }

            setError(errorMessage);
            console.error("Error completo:", err);
        }
    };

    return (
        <div className="login-screen" style={{ textAlign: "center" }}>
            <h2>{isRegistering ? "Registro" : "Inicio de Sesión"}</h2>

            {error && (
                <div className="error-message" style={{
                    background: "#ffebee",
                    color: "#b71c1c",
                    padding: "10px",
                    borderRadius: "4px",
                    margin: "10px 0",
                    textAlign: "left",
                    whiteSpace: "pre-line"
                }}>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Usuario"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="user-input"
                    style={{ display: "block", margin: "1rem auto" }}
                />

                {isRegistering && (
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="user-input"
                        style={{ display: "block", margin: "1rem auto" }}
                    />
                )}

                <input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="user-input"
                    style={{ display: "block", margin: "1rem auto" }}
                />

                <div style={{ marginTop: "1rem" }}>
                    <button
                        type="submit"
                        className="auth-button"
                        style={{ marginRight: "0.5rem" }}
                    >
                        {isRegistering ? "Registrarse" : "Iniciar Sesión"}
                    </button>

                    <button
                        type="button"
                        className="auth-button"
                        onClick={() => setIsRegistering(!isRegistering)}
                    >
                        {isRegistering ? "¿Ya tienes cuenta?" : "¿No tienes cuenta?"}
                    </button>
                </div>

                <button
                    type="button"
                    className="close-button"
                    style={{ marginTop: "1rem", display: "block", width: "100%" }}
                    onClick={() => setShowLoginScreen(false)}
                >
                    Cerrar
                </button>
            </form>

            <div style={{ marginTop: "2rem", fontSize: "0.9rem", color: "#666" }}>
                <h3>Información de depuración</h3>
                <p>Backend URL: <code>{axios.defaults.baseURL}</code></p>
                <p>Modo actual: <strong>{isRegistering ? "Registro" : "Login"}</strong></p>
                <p>Endpoint: <code>{isRegistering ? "/api/auth/register" : "/api/auth/login"}</code></p>
            </div>
        </div>
    );
}

export default LoginScreen;