import React, { useState, useContext } from 'react';
import { AppContext } from '../../App';
import Header from '../Header';
import Card from '../Card';
import ContractModal from '../modals/ContractModal';
import ConfirmationModal from '../modals/ConfirmationModal';
import type { Contract } from '../../types';

const ContractsPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [contractToDelete, setContractToDelete] = useState<Contract | null>(null);
  
  const context = useContext(AppContext);
  if (!context) return null;

  const { contracts, clients, handleSaveContract, handleDeleteContract } = context;

  const openModal = (contract: Contract | null = null) => {
    setSelectedContract(contract);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedContract(null);
    setIsModalOpen(false);
  };
  
  const formatCurrency = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <div className="p-8">
      <Header title="Contratos">
        <button onClick={() => openModal()} className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors shadow-sm">
          Novo Contrato
        </button>
      </Header>
      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
            {/* Table Head */}
            <thead className="bg-slate-50 dark:bg-slate-700/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Cliente</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Período</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Valor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            {/* Table Body */}
            <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
              {contracts.map(contract => (
                <tr key={contract.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{clients.find(c => c.id === contract.clientId)?.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{new Date(contract.startDate).toLocaleDateString('pt-BR')} - {new Date(contract.endDate).toLocaleDateString('pt-BR')}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{formatCurrency(contract.value)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{contract.status}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => openModal(contract)} className="text-teal-600 hover:text-teal-900 dark:text-teal-400 dark:hover:text-teal-200">Editar</button>
                    <button onClick={() => setContractToDelete(contract)} className="ml-4 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200">Excluir</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      {isModalOpen && <ContractModal contract={selectedContract} onClose={closeModal} onSave={handleSaveContract} clients={clients} />}
      {contractToDelete && (
        <ConfirmationModal
          isOpen={!!contractToDelete}
          onClose={() => setContractToDelete(null)}
          onConfirm={() => {
            handleDeleteContract(contractToDelete.id);
            setContractToDelete(null);
          }}
          title="Excluir Contrato"
          message={`Tem certeza que deseja excluir o contrato do cliente ${clients.find(c => c.id === contractToDelete.clientId)?.name}?`}
        />
      )}
    </div>
  );
};

export default ContractsPage;
