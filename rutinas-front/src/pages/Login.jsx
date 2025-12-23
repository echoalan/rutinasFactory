// src/pages/LoginPage.jsx
import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function LoginPage({ mostrarMensaje }) {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await login(email, password);
    if (res.ok) {
      mostrarMensaje("Login exitoso", "success");
    } else {
      mostrarMensaje(res.message || "Error al iniciar sesión", "error");
    }
  };

  return (
    <div className="container login-container">
      <h2 className="login-title">Iniciar Sesión</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Iniciar sesión</button>
      </form>
    </div>
  );
}
