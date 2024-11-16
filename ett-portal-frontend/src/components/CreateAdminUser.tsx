// src/components/CreateAdminUser.tsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface CreateAdminUserProps {
  grupoEmpresarialId: number;
}

interface BusinessGroup {
  id: number;
  nome_grupo: string;
}

const CreateAdminUser: React.FC<CreateAdminUserProps> = ({ grupoEmpresarialId }) => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [empresaId, setEmpresaId] = useState(grupoEmpresarialId);
  const [businessGroups, setBusinessGroups] = useState<BusinessGroup[]>([]);
  const [successMessage, setSuccessMessage] = useState('');

  // Buscar grupos empresariais para popular o select
  useEffect(() => {
    const fetchBusinessGroups = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/grupo-empresarial');
        setBusinessGroups(response.data);
      } catch (error) {
        console.error('Erro ao buscar grupos empresariais:', error);
      }
    };
    fetchBusinessGroups();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.post('http://localhost:5000/api/usuarios', {
        nome,
        email,
        senha,
        empresaId,
      });

      setSuccessMessage('Usuário administrativo criado com sucesso!');
      setNome('');
      setEmail('');
      setSenha('');
      setEmpresaId(grupoEmpresarialId);
    } catch (error) {
      console.error('Erro ao criar usuário administrativo:', error);
      alert('Erro ao criar usuário administrativo. Verifique os dados e tente novamente.');
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Criar Usuário Administrativo</h2>
      {successMessage && (
        <div className="mb-4 p-2 bg-green-100 text-green-700 border border-green-400 rounded">
          {successMessage}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="mb-4 p-2 border rounded w-full"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-4 p-2 border rounded w-full"
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          className="mb-4 p-2 border rounded w-full"
          required
        />
        <select
          value={empresaId}
          onChange={(e) => setEmpresaId(Number(e.target.value))}
          className="mb-4 p-2 border rounded w-full"
          required
        >
          <option value="">Selecione o grupo empresarial</option>
          {businessGroups.map((group) => (
            <option key={group.id} value={group.id}>
              {group.nome_grupo}
            </option>
          ))}
        </select>
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded w-full">
          Criar Usuário
        </button>
      </form>
    </div>
  );
};

export default CreateAdminUser;
