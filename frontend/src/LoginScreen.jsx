import {useState} from "react";

function LoginScreen({ setShowLoginScreen }) {
    const [loged, setLoged] = useState(false)

    if (loged) {
        alert("Bienvenido");
        setShowLoginScreen(false);
    }

    return (
        <div className="login-screen" style={{ textAlign: "center" }}>
            <h2>Cuenta</h2>
            <input
                type="text"
                placeholder=" Usuario"
                className="user-input"
                style={{ display: "block", margin: "1rem auto" }}
            />
            <input
                type="password"
                placeholder=" Contraseña"
                className="user-input"
                style={{ display: "block", margin: "1rem auto" }}
            />

            <button
                className="auth-button"
                style={{ marginTop: "1rem", marginRight: "1rem" }}
                onClick={() => setLoged(true) }
            >
                Login
            </button>

            <button
                className="close-button"
                style={{ marginTop: "1rem" }}
                onClick={() => setShowLoginScreen(false)}
            >
                Cerrar
            </button>


        </div>
    )
}

export default LoginScreen