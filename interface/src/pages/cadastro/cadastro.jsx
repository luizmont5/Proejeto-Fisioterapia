import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Cadastro = () => {
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [password, setPassword] = useState("");
  const [idade, setIdade] = useState("");
  const [endereco, setEndereco] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [estadoOrigem, setEstadoOrigem] = useState("");
  const [cidade, setCidade] = useState("");
  const [comorbidades, setComorbidades] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://127.0.0.1:5000/register", {
        nome,
        cpf,
        password,
        idade,
        endereco,
        dataNascimento,
        estadoOrigem,
        cidade,
        comorbidades,
      });
      if (response.status === 201) {
        // Redirect to home page after successful registration
        navigate("/home");
      }
    } catch (error) {
      console.error("Error during registration", error);
    }
  };

  return (
    <div className="container">
      <h1>Cadastro</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nome Completo: </label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
        </div>
        <div>
          <label>CPF: </label>
          <input
            type="text"
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Senha: </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Idade: </label>
          <input
            type="number"
            value={idade}
            onChange={(e) => setIdade(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Endereço: </label>
          <input
            type="text"
            value={endereco}
            onChange={(e) => setEndereco(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Data de Nascimento: </label>
          <input
            type="date"
            value={dataNascimento}
            onChange={(e) => setDataNascimento(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Estado de Origem: </label>
          <input
            type="text"
            value={estadoOrigem}
            onChange={(e) => setEstadoOrigem(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Cidade: </label>
          <input
            type="text"
            value={cidade}
            onChange={(e) => setCidade(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Comorbidades?: </label>
          <input
            type="text"
            value={comorbidades}
            onChange={(e) => setComorbidades(e.target.value)}
            required
          />
        </div>
        <button type="submit">Registrar</button>
      </form>
    </div>
  );
};

export default Cadastro;
