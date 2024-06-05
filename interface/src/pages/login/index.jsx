// src/Login.js

import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useUser } from "../../Usercontext";

const Login = () => {
  const [cpf, setCpf] = useState("");
  const [password, setPassword] = useState("");
  const { setUserId } = useUser();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://127.0.0.1:5000/login", {
        cpf,
        password,
      });
      if (response.status === 200) {
        const userId = response.data.user_id;
        setUserId(userId);
        navigate("/home");
      }
    } catch (error) {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="container">
      <h1>Clínica Santa Emília de Rodat</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>CPF: </label>
          <input
            type="text"
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
          />
        </div>
        <div>
          <label>Senha: </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Login</button>
      </form>
      <p>
        Não tem uma conta? <Link to="/register">Registre-se</Link>
      </p>
    </div>
  );
};

export default Login;
