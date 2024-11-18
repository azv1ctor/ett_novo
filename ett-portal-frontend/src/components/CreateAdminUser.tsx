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

interface Usuario {
  id: number;
  nome: string;
  email: string;
  super_usuario: boolean;
  grupo_empresarial_id: number | null;
  empresaId: number | null;
}

const CreateAdminUser: React.FC<CreateAdminUserProps> = ({ grupoEmpresarialId }) => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [empresaId, setEmpresaId] = useState(grupoEmpresarialId);
  const [superUsuario, setSuperUsuario] = useState(false);
  const [businessGroups, setBusinessGroups] = useState<BusinessGroup[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [editUserId, setEditUserId] = useState<number | null>(null);

  // Buscar grupos empresariais e usuários criados
  useEffect(() => {
    const fetchData = async () => {
      try {
        const groupsResponse = await axios.get('http://localhost:5000/api/grupo-empresarial');
        setBusinessGroups(groupsResponse.data);

        const usersResponse = await axios.get('http://localhost:5000/api/usuarios');
        setUsuarios(usersResponse.data);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editUserId) {
        // Atualizar usuário existente
        await axios.put(`http://localhost:5000/api/usuarios/${editUserId}`, {
          nome,
          email,
          senha,
          empresaId,
          super_usuario: superUsuario,
        });
        setSuccessMessage('Usuário atualizado com sucesso!');
      } else {
        // Criar novo usuário
        await axios.post('http://localhost:5000/api/usuarios', {
          nome,
          email,
          senha,
          empresaId,
          super_usuario: superUsuario,
        });
        setSuccessMessage('Usuário criado com sucesso!');
      }

      // Limpar campos e atualizar lista de usuários
      setNome('');
      setEmail('');
      setSenha('');
      setEmpresaId(grupoEmpresarialId);
      setSuperUsuario(false);
      setEditUserId(null);
      const usersResponse = await axios.get('http://localhost:5000/api/usuarios');
      setUsuarios(usersResponse.data);
    } catch (error) {
      console.error('Erro ao criar ou atualizar usuário:', error);
      alert('Erro ao criar ou atualizar usuário. Verifique os dados e tente novamente.');
    }
  };

  const handleEdit = (user: Usuario) => {
    setEditUserId(user.id);
    setNome(user.nome);
    setEmail(user.email);
    setEmpresaId(user.grupo_empresarial_id || grupoEmpresarialId);
    setSuperUsuario(user.super_usuario);
  };

  const handleDelete = async (userId: number) => {
    if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
      try {
        await axios.delete(`http://localhost:5000/api/usuarios/${userId}`);
        setUsuarios(usuarios.filter((user) => user.id !== userId));
        setSuccessMessage('Usuário deletado com sucesso!');
      } catch (error) {
        console.error('Erro ao deletar usuário:', error);
        alert('Erro ao deletar usuário.');
      }
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">
        {editUserId ? 'Editar Usuário Administrativo' : 'Criar Usuário Administrativo'}
      </h2>
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
          required={!superUsuario}
          disabled={superUsuario}
        >
          <option value="">Selecione o grupo empresarial</option>
          {businessGroups.map((group) => (
            <option key={group.id} value={group.id}>
              {group.nome_grupo}
            </option>
          ))}
        </select>
        <label className="flex items-center mb-4">
          <input
            type="checkbox"
            checked={superUsuario}
            onChange={(e) => setSuperUsuario(e.target.checked)}
            className="mr-2"
          />
          Super Admin
        </label>
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded w-full">
          {editUserId ? 'Salvar Alterações' : 'Criar Usuário'}
        </button>
      </form>

      <h3 className="text-lg font-semibold mt-6">Usuários Criados</h3>
      <ul className="mt-4">
        {usuarios.map((user) => (
          <li key={user.id} className="flex justify-between items-center border-b py-2">
            <div>
              <p>
                <strong>Nome:</strong> {user.nome}
              </p>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>Super Admin:</strong> {user.super_usuario ? 'Sim' : 'Não'}
              </p>
            </div>
            <div>
              <button
                onClick={() => handleEdit(user)}
                className="px-4 py-2 bg-yellow-500 text-white rounded mr-2"
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(user.id)}
                className="px-4 py-2 bg-red-500 text-white rounded"
              >
                Deletar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CreateAdminUser;
