// src/pages/LoginPage.tsx

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberLogin, setRememberLogin] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/auth/login', {
        email,
        senha: password,
      });

      // Armazena o token de autenticação
      localStorage.setItem('token', response.data.token);

      if (rememberLogin) {
        localStorage.setItem('email', email);
        localStorage.setItem('rememberLogin', 'true');
      } else {
        localStorage.removeItem('email');
        localStorage.removeItem('rememberLogin');
      }

      navigate('/dashboard'); // Redireciona para o dashboard após login bem-sucedido
    } catch (error) {
      console.error('Erro ao realizar login:', error);
      alert('Erro ao realizar login. Verifique suas credenciais.');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-80">
        <h2 className="text-lg font-bold mb-4 text-center">Login</h2>
        <input
          type="email"
          placeholder="Email"
          className="border p-2 mb-4 w-full"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Senha"
          className="border p-2 mb-4 w-full"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <label className="flex items-center mb-4">
          <input
            type="checkbox"
            checked={rememberLogin}
            onChange={(e) => setRememberLogin(e.target.checked)}
            className="mr-2"
          />
          Lembrar login
        </label>
        <button type="submit" className="bg-blue-500 text-white p-2 w-full rounded">
          Entrar
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
