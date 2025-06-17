function LoginScreen({ setShowLoginScreen }) {
    return (
        <div className="login-screen" style={{ textAlign: "center" }}>
            <h2>Cuenta</h2>
            <input
                type="text"
                placeholder="Usuario"
                className="login-input"
                style={{ display: "block", margin: "1rem auto" }}
            />
            <input
                type="password"
                placeholder="Contraseña"
                className="login-input"
                style={{ display: "block", margin: "1rem auto" }}
            />
            <button
                style={{ marginTop: "1rem" }}
                onClick={() => setShowLoginScreen(false)}
            >
                Cerrar
            </button>
        </div>
    )
}

export default LoginScreen