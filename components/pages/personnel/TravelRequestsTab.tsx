import React, { useState, useContext } from 'react';
// FIX: Import the 'TravelRequest' type from the main types file.
import type { TravelRequest } from '../../../types';
import { AppContext, AuthContext } from '../../../App';
import TravelRequestModal from '../../modals/TravelRequestModal';
import ConfirmationModal from '../../modals/ConfirmationModal';
import TableControls from '../../TableControls';

const TravelRequestsTab: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<TravelRequest | null>(null);
  const [requestToDelete, setRequestToDelete] = useState<TravelRequest | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const context = useContext(AppContext);
  const auth = useContext(AuthContext);
  if (!context || !auth) return null;

  const { user } = auth;
  // FIX: Rename the destructured handler to the more specific 'handleUpdateTravelRequestStatus' to avoid naming conflicts.
  const { travelRequests, personnel, projects, handleSaveTravelRequest, handleDeleteTravelRequest, handleUpdateTravelRequestStatus } = context;

  const openModal = (request: TravelRequest | null = null) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedRequest(null);
    setIsModalOpen(false);
  };

  const filteredRequests = travelRequests.filter(r =>
    r.requesterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.projectName.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a,b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
  
  const formatCurrency = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const getStatusClass = (status: TravelRequest['status']) => {
    switch (status) {
      case 'Aprovada':
      case 'Realizada':
      case 'Concluída':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'Solicitada':
      case 'Prestação de Contas':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'Rejeitada':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return '';
    }
  };


  return (
    <div>
      <TableControls
        onAdd={() => openModal()}
        addLabel="Nova Solicitação de Viagem"
        onSearch={setSearchTerm}
      />

      <div className="overflow-x-auto mt-4">
        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
          <thead className="bg-slate-50 dark:bg-slate-700/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Solicitante</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Projeto</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Destino</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Valor Total</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
            {filteredRequests.map(r => (
              <tr key={r.id}>
                <td className="px-6 py-4 whitespace-nowrap font-medium">{r.requesterName}</td>
                <td className="px-6 py-4 whitespace-nowrap">{r.projectName}</td>
                <td className="px-6 py-4 whitespace-nowrap">{r.destination}</td>
                <td className="px-6 py-4 whitespace-nowrap">{formatCurrency(r.totalValue)}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(r.status)}`}>
                    {r.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                  {r.status === 'Solicitada' && (user?.role === 'admin' || user?.role === 'project_manager') && (
                    <button onClick={() => handleUpdateTravelRequestStatus(r.id, 'Aprovada')} className="text-green-600 hover:text-green-900">Aprovar</button>
                  )}
                  {r.status === 'Realizada' && (
                    <button onClick={() => handleUpdateTravelRequestStatus(r.id, 'Concluída')} className="text-blue-600 hover:text-blue-900">Finalizar Prest. Contas</button>
                  )}
                  <button onClick={() => openModal(r)} className="text-teal-600 hover:text-teal-900">Editar</button>
                  <button onClick={() => setRequestToDelete(r)} className="text-red-600 hover:text-red-900">Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && <TravelRequestModal request={selectedRequest} onClose={closeModal} onSave={handleSaveTravelRequest} personnel={personnel} projects={projects} />}
      {requestToDelete && (
        <ConfirmationModal
          isOpen={!!requestToDelete}
          onClose={() => setRequestToDelete(null)}
          onConfirm={() => {
            handleDeleteTravelRequest(requestToDelete.id);
            setRequestToDelete(null);
          }}
          title="Excluir Solicitação"
          message={`Tem certeza que deseja excluir a solicitação de viagem para ${requestToDelete.destination}?`}
        />
      )}
    </div>
  );
};

export default TravelRequestsTab;
