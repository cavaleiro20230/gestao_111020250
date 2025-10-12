import React, { useState, useContext } from 'react';
import type { MaterialRequest } from '../../../types';
import { AppContext, AuthContext } from '../../../App';
import MaterialRequestModal from '../../modals/MaterialRequestModal';
import ConfirmationModal from '../../modals/ConfirmationModal';
import TableControls from '../../TableControls';

const MaterialRequestsTab: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<MaterialRequest | null>(null);
  const [requestToDelete, setRequestToDelete] = useState<MaterialRequest | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const context = useContext(AppContext);
  const auth = useContext(AuthContext);
  if (!context || !auth) return null;

  const { user } = auth;
  const { 
      materialRequests, 
      handleSaveMaterialRequest, 
      handleDeleteMaterialRequest,
      handleUpdateMaterialRequestStatus,
      personnel,
      projects,
      budgetItems,
      fundingSources,
      products
    } = context;

  const openModal = (request: MaterialRequest | null = null) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedRequest(null);
    setIsModalOpen(false);
  };

  const filteredRequests = materialRequests.filter(r =>
    r.requesterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.projectName.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a,b) => new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime());
  
  const getStatusClass = (status: MaterialRequest['status']) => {
    switch (status) {
      case 'Atendida': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'Aprovada': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'Solicitada': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'Pendente de Aprovação': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'Rejeitada': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return '';
    }
  };

  return (
    <div>
      <TableControls
        onAdd={() => openModal()}
        addLabel="Nova Requisição"
        onSearch={setSearchTerm}
      />

      <div className="overflow-x-auto mt-4">
        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
          <thead className="bg-slate-50 dark:bg-slate-700/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Data</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Solicitante</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Projeto</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Itens</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
            {filteredRequests.map(r => (
              <tr key={r.id}>
                <td className="px-6 py-4 whitespace-nowrap">{new Date(r.requestDate).toLocaleDateString('pt-BR')}</td>
                <td className="px-6 py-4 whitespace-nowrap font-medium">{r.requesterName}</td>
                <td className="px-6 py-4 whitespace-nowrap">{r.projectName}</td>
                <td className="px-6 py-4 whitespace-nowrap">{r.items.length}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(r.status)}`}>
                    {r.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                  {r.status === 'Solicitada' && (user?.role === 'admin' || user?.role === 'project_manager') && (
                    <button onClick={() => handleUpdateMaterialRequestStatus(r.id, 'Aprovada')} className="text-green-600 hover:text-green-900">Aprovar</button>
                  )}
                  {r.status === 'Aprovada' && (user?.role === 'admin' || user?.role === 'project_manager') && (
                    <button onClick={() => handleUpdateMaterialRequestStatus(r.id, 'Atendida')} className="text-blue-600 hover:text-blue-900">Atender</button>
                  )}
                  <button onClick={() => openModal(r)} className="text-teal-600 hover:text-teal-900">Detalhes</button>
                  {r.status !== 'Atendida' && <button onClick={() => setRequestToDelete(r)} className="text-red-600 hover:text-red-900">Excluir</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && <MaterialRequestModal request={selectedRequest} onClose={closeModal} onSave={handleSaveMaterialRequest} user={user} projects={projects} budgetItems={budgetItems} fundingSources={fundingSources} products={products} />}
      {requestToDelete && (
        <ConfirmationModal
          isOpen={!!requestToDelete}
          onClose={() => setRequestToDelete(null)}
          onConfirm={() => {
            handleDeleteMaterialRequest(requestToDelete.id);
            setRequestToDelete(null);
          }}
          title="Excluir Requisição"
          message={`Tem certeza que deseja excluir a requisição de material do projeto ${requestToDelete.projectName}?`}
        />
      )}
    </div>
  );
};

export default MaterialRequestsTab;
