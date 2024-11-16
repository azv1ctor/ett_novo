import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

interface DashboardProps {
  coligadaId?: number; // Recebe o ID da coligada (0 para geral, 1 para ETT, 6 para FIRST)
}

const Dashboard: React.FC<DashboardProps> = ({ coligadaId }) => {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [funcionarios, setFuncionarios] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem('token');
      console.log("Token utilizado para requisição:", token); // Log do token
      try {
        const response = await axios.get(`http://localhost:5000/api/dashboard${coligadaId ? `/${coligadaId}` : ''}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setDashboardData(response.data);
      } catch (error) {
        console.error('Erro ao obter dados do dashboard', error);
        if (axios.isAxiosError(error) && error.response?.status === 403) {
          alert('Acesso negado. Faça login novamente.');
          localStorage.removeItem('token');
          window.location.href = '/';
        }
      }
    };

 /*   const fetchFuncionarios = async () => {
      const token = localStorage.getItem('token');
      console.log("Token utilizado para funcionários:", token); // Para verificar o token
      try {
        const response = await axios.get(`http://localhost:5000/api/funcionarios/${coligadaId ?? ''}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setFuncionarios(response.data);
      } catch (error) {
        console.error('Erro ao obter funcionários', error);
        alert('Erro ao carregar dados dos funcionários.');
      }
    };*/

    fetchDashboardData();
   //fetchFuncionarios();
  }, [coligadaId]);

  if (!dashboardData || !Array.isArray(dashboardData)) {
    return <p>Carregando dados do dashboard...</p>;
  }

  const formatNumber = (value: number) => new Intl.NumberFormat('pt-BR').format(value);
  const formatCurrency = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  const coligadas = dashboardData.map((item: any) => {
    return item.CODCOLIGADA === 1 ? 'ETT' : item.CODCOLIGADA === 6 ? 'First' : `Coligada ${item.CODCOLIGADA}`;
  });
  const totalFuncionarios = dashboardData.map((item: any) => item.totalFuncionarios);
  const mediaSalario = dashboardData.map((item: any) => item.mediaSalario);
  const totalMasculino = dashboardData.map((item: any) => item.totalMasculino);
  const totalFeminino = dashboardData.map((item: any) => item.totalFeminino);

  const barData = {
    labels: coligadas,
    datasets: [
      {
        label: 'Total de Funcionários',
        data: totalFuncionarios,
        backgroundColor: '#4B9CD3',
      },
      {
        label: 'Média Salarial',
        data: mediaSalario,
        backgroundColor: '#E87653',
      },
    ],
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Dashboard Corporativo</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {dashboardData.map((item: any, index: number) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              {item.CODCOLIGADA === 1 ? 'ETT' : item.CODCOLIGADA === 6 ? 'First' : `Coligada ${item.CODCOLIGADA}`}
            </h2>
            <p className="text-gray-600">Total de Funcionários: <span className="font-medium">{formatNumber(item.totalFuncionarios)}</span></p>
            <p className="text-gray-600">Média Salarial: <span className="font-medium">{formatCurrency(item.mediaSalario)}</span></p>
            <p className="text-gray-600">Masculino: <span className="font-medium">{formatNumber(item.totalMasculino)}</span></p>
            <p className="text-gray-600">Feminino: <span className="font-medium">{formatNumber(item.totalFeminino)}</span></p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Total de Funcionários e Média Salarial</h2>
          <Bar data={barData} />
        </div>
        {dashboardData.map((item: any, index: number) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Distribuição de Gênero - {item.CODCOLIGADA === 1 ? 'ETT' : item.CODCOLIGADA === 6 ? 'First' : `Coligada ${item.CODCOLIGADA}`}
            </h2>
            <Pie
              data={{
                labels: ['Masculino', 'Feminino'],
                datasets: [
                  {
                    data: [item.totalMasculino, item.totalFeminino],
                    backgroundColor: ['#4B9CD3', '#E87653'],
                  },
                ],
              }}
            />
          </div>
        ))}
      </div>

      {/* Removendo a parte do input e tabela de funcionários para exibir somente os gráficos */}
    </div>
  );
};

export default Dashboard;
