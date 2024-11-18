import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';

interface BusinessGroup {
  id: number;
  nome_grupo: string;
  status_acesso: boolean;
}

interface Partner {
  id: number;
  nome_parceiro: string;
  coligada_id: number;
  status_acesso: boolean;
}

const PartnerAccessControl: React.FC = () => {
  const [businessGroups, setBusinessGroups] = useState<BusinessGroup[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [availablePartners, setAvailablePartners] = useState<Partner[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchBusinessGroups = async () => {
      const response = await axios.get('http://localhost:5000/api/grupo-empresarial');
      setBusinessGroups(response.data);
    };

    const fetchAvailablePartners = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/controle-acesso-parceiros');
        setAvailablePartners(response.data);
      } catch (error) {
        console.error('Erro ao buscar empresas parceiras:', error);
      }
    };

    fetchBusinessGroups();
    fetchAvailablePartners();
  }, []);

  useEffect(() => {
    if (selectedGroupId) {
      const fetchPartners = async () => {
        const response = await axios.get(`http://localhost:5000/api/grupo-empresarial/${selectedGroupId}/partners`);
        setPartners(response.data);
      };
      fetchPartners();
    } else {
      setPartners([]);
    }
  }, [selectedGroupId]);

  const associatePartnerToGroup = async (partnerId: number) => {
    try {
      await axios.post('http://localhost:5000/api/grupo-empresarial/associar-multiplos', {
        grupoEmpresarialId: selectedGroupId,
        parceirosIds: [partnerId],
      });
      setPartners([...partners, availablePartners.find((p) => p.id === partnerId)!]);
    } catch (error) {
      console.error('Erro ao associar parceiro ao grupo', error);
      alert('Erro ao associar parceiro ao grupo.');
    }
  };

  const disassociatePartnerFromGroup = async (id: number) => {
    try {
      const response = await axios.delete('http://localhost:5000/api/grupo-empresarial/desassociar', {
        params: {
          id, // Envie o ID específico do registro
        },
      });
  
      alert('Parceiro desassociado com sucesso!');
      // Remova o parceiro da lista no estado do frontend
      setPartners((prevPartners) => prevPartners.filter((partner) => partner.id !== id));
    } catch (error) {
      console.error('Erro ao desassociar parceiro do grupo:', error);
      alert('Erro ao desassociar parceiro. Verifique os dados e tente novamente.');
    }
  };
  

  // Filtro e Paginação para Empresas Disponíveis
  const filteredPartners = availablePartners.filter((partner) =>
    partner.nome_parceiro.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAvailablePartners = filteredPartners.slice(indexOfFirstItem, indexOfLastItem);

  // Número de páginas baseado em `filteredPartners`
  const pageNumbers = Array.from(
    { length: Math.ceil(filteredPartners.length / itemsPerPage) },
    (_, i) => i + 1
  );

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Controle de Acesso de Empresas Parceiras</h2>

      <label>Selecionar Grupo Empresarial:</label>
      <select
        value={selectedGroupId ?? ''}
        onChange={(e) => setSelectedGroupId(Number(e.target.value))}
        className="mb-4 p-2 border rounded"
      >
        <option value="">Selecione um grupo</option>
        {businessGroups.map((group) => (
          <option key={group.id} value={group.id}>
            {group.nome_grupo}
          </option>
        ))}
      </select>

      <h3 className="text-lg font-semibold">Empresas no Grupo</h3>
      <table className="w-full text-left mt-4">
        <thead>
          <tr>
            <th className="border-b p-2">Nome da Empresa</th>
            <th className="border-b p-2">Status de Acesso</th>
            <th className="border-b p-2">Ação</th>
          </tr>
        </thead>
        <tbody>
          {partners.map((partner) => (
            <tr key={partner.id}>
              <td className="border-b p-2">{partner.nome_parceiro}</td>
              <td className="border-b p-2">{partner.status_acesso ? 'Ativo' : 'Desativado'}</td>
              <td className="border-b p-2">
              <button
  onClick={() => disassociatePartnerFromGroup(partner.id)} // Passe o ID correto
  className="px-4 py-2 bg-red-500 text-white rounded"
>
  Dessassociar
</button>


</td>

            </tr>
          ))}
        </tbody>
      </table>

      <h3 className="text-lg font-semibold mt-6">Associar Nova Empresa ao Grupo</h3>

      {/* Campo de Pesquisa */}
      <input
        type="text"
        placeholder="Pesquisar empresa"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4 p-2 border rounded w-full"
      />

      <ul className="mt-2">
        {currentAvailablePartners
          .filter((partner) => !partners.some((p) => p.id === partner.id))
          .map((partner) => (
            <li key={partner.id} className="flex items-center justify-between mb-2">
              <span>{partner.nome_parceiro}</span>
              <button
                onClick={() => associatePartnerToGroup(partner.id)}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Associar
              </button>
            </li>
          ))}
      </ul>

      {/* Paginação */}
      <div className="mt-4 flex justify-center">
        {pageNumbers.map((number) => (
          <button
            key={number}
            onClick={() => setCurrentPage(number)}
            className={`px-3 py-1 mx-1 rounded ${
              currentPage === number ? 'bg-blue-600 text-white' : 'bg-gray-300'
            }`}
          >
            {number}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PartnerAccessControl;
