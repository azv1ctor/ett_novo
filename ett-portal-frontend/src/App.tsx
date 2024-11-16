// src/App.tsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import VerificationPage from './pages/VerificationPage';
import Dashboard from './pages/Dashboard';
import PrivateRoute from './components/PrivateRoute';
import SuperUserMenu from './components/SuperUserMenu';
import PartnerAccessControl from './components/PartnerAccessControl';
import CreateBusinessGroup from './components/CreateBusinessGroup';
import CreateAdminUser from './components/CreateAdminUser';

function App() {
  return (
    <Router>
      <Routes>
        {/* Rotas públicas */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/verify" element={<VerificationPage />} />

        {/* Rotas protegidas */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <div className="flex min-h-screen">
                <SuperUserMenu />
                <div className="flex-1 p-6">
                  <Dashboard coligadaId={0} /> {/* Dashboard geral */}
                </div>
              </div>
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/ett"
          element={
            <PrivateRoute>
              <div className="flex min-h-screen">
                <SuperUserMenu />
                <div className="flex-1 p-6">
                  <Dashboard coligadaId={1} /> {/* Dashboard para Clientes ETT */}
                </div>
              </div>
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/first"
          element={
            <PrivateRoute>
              <div className="flex min-h-screen">
                <SuperUserMenu />
                <div className="flex-1 p-6">
                  <Dashboard coligadaId={6} /> {/* Dashboard para Clientes FIRST */}
                </div>
              </div>
            </PrivateRoute>
          }
        />
        <Route
          path="/config/partner-access"
          element={
            <PrivateRoute>
              <div className="flex min-h-screen">
                <SuperUserMenu />
                <div className="flex-1 p-6">
                  <PartnerAccessControl />
                </div>
              </div>
            </PrivateRoute>
          }
        />
        <Route
          path="/config/create-business-group"
          element={
            <PrivateRoute>
              <div className="flex min-h-screen">
                <SuperUserMenu />
                <div className="flex-1 p-6">
                  <CreateBusinessGroup />
                </div>
              </div>
            </PrivateRoute>
          }
        />
        <Route
          path="/config/create-admin-user"
          element={
            <PrivateRoute>
              <div className="flex min-h-screen">
                <SuperUserMenu />
                <div className="flex-1 p-6">
                  <CreateAdminUser grupoEmpresarialId={1} /> {/* Exemplo com ID fixo, pode ser dinâmico */}
                </div>
              </div>
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
