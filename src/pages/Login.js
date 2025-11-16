import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "../styles/Auth.css";
import logo from "../assets/images/logowizard.png"; // nova logo

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isTeacher, setIsTeacher] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setError("");
      setLoading(true);
      await login(email, password, isTeacher);
      navigate("/dashboard");
    } catch (err) {
      setError("Falha ao fazer login. Verifique seu email e senha.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <img
            src={logo}
            alt="English Kids Logo"
            className="login-logo"
            draggable="false"
          />
          <h1>English Kids</h1>
          <p>Aprenda inglês de forma divertida!</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Digite seu email"
              required
            />
          </div>

        <div className="form-group">
          <label>Senha</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Digite sua senha"
            required
          />
        </div>
        <div className="form-group">
          <label>Tipo de acesso</label>
          <div className="role-toggle">
            <button
              type="button"
              className={`role-option ${!isTeacher ? 'active' : ''}`}
              onClick={() => setIsTeacher(false)}
            >Sou Aluno</button>
            <button
              type="button"
              className={`role-option ${isTeacher ? 'active' : ''}`}
              onClick={() => setIsTeacher(true)}
            >Sou Professor</button>
          </div>
        </div>

          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Não tem uma conta? <Link to="/register">Registre-se</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
