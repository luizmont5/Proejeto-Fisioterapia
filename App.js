// src/App.js

import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Cadastro from "./pages/cadastro/cadastro";
import Home from "./pages/home";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Cadastro />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </div>
  );
};

export default App;
