// src/components/SuperUserMenu.tsx

import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const SuperUserMenu: React.FC = () => {
  const location = useLocation();

  return (
    <div className="bg-gray-800 text-white min-h-screen w-64 flex flex-col">
      <h2 className="text-3xl font-semibold p-6 text-center border-b border-gray-700">Painel Admin</h2>
      
      <div className="flex-1 p-4">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-300">Clientes</h3>
          <ul className="mt-2 space-y-2">
            <li>
              <Link
                to="/dashboard"
                className={`block px-4 py-2 rounded ${
                  location.pathname === '/dashboard'
                    ? 'bg-blue-500'
                    : 'hover:bg-blue-600'
                }`}
              >
                Todos Clientes
              </Link>
            </li>
            <li>
              <Link
                to="/dashboard/ett"
                className={`block px-4 py-2 rounded ${
                  location.pathname === '/dashboard/ett'
                    ? 'bg-blue-500'
                    : 'hover:bg-blue-600'
                }`}
              >
                Clientes ETT
              </Link>
            </li>
            <li>
              <Link
                to="/dashboard/first"
                className={`block px-4 py-2 rounded ${
                  location.pathname === '/dashboard/first'
                    ? 'bg-blue-500'
                    : 'hover:bg-blue-600'
                }`}
              >
                Clientes FIRST
              </Link>
            </li>
          </ul>
        </div>
        <div className="mt-auto">
          <h3 className="text-lg font-semibold text-gray-300">Configurações</h3>
          <ul className="mt-2 space-y-2">
            <li>
              <Link
                to="/config/partner-access"
                className="block px-4 py-2 rounded hover:bg-blue-600"
              >
                Controle de Acesso de Parceiros
              </Link>
            </li>
            <li>
              <Link
                to="/config/create-business-group"
                className="block px-4 py-2 rounded hover:bg-blue-600"
              >
                Cadastrar Grupo Empresarial
              </Link>
            </li>
            <li>
              <Link
                to="/config/create-admin-user"
                className="block px-4 py-2 rounded hover:bg-blue-600"
              >
                Cadastrar Usuário Administrativo
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SuperUserMenu;
