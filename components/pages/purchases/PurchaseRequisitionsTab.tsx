import React, { useState, useContext } from 'react';
// FIX: Import 'PurchaseRequisition' type from the main types file.
import type { PurchaseRequisition } from '../../../types';
import { AppContext, AuthContext } from '../../../App';
import ConfirmationModal from '../../modals/ConfirmationModal';
import TableControls from '../../TableControls';
import PurchaseRequisitionModal from '../../modals/PurchaseRequisitionModal';

const PurchaseRequisitionsTab: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReq, setSelectedReq] = useState<PurchaseRequisition | null>(null);
  const [reqToDelete, setReqToDelete] = useState<PurchaseRequisition | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const context = useContext(AppContext);
  const auth = useContext(AuthContext);
  if (!context || !auth?.user) return null;

  const { user } = auth;
  // FIX: Destructure the correctly named handlers from the context.
  const { purchaseRequisitions, handleSavePurchaseRequisition, handleDeletePurchaseRequisition, handleUpdatePurchaseRequisitionStatus, personnel, projects } = context;

  const openModal = (req: PurchaseRequisition | null = null) => {
    setSelectedReq(req);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedReq(null);
    setIsModalOpen(false);
  };

  const filteredReqs = purchaseRequisitions.filter(r =>
    r.requesterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.projectName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusClass = (status: PurchaseRequisition['status']) => {
    switch (status) {
      case 'Aprovada': return 'bg-green-100 text-green-800';
      case 'Rejeitada': return 'bg-red-100 text-red-800';
      case 'Pendente': return 'bg-yellow-100 text-yellow-800';
      case 'Concluída': return 'bg-blue-100 text-blue-800';
      default: return '';
    }
  };
  
  const formatCurrency = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });


  return (
    <div>
      <TableControls
        onAdd={() => openModal()}
        addLabel="Nova Solicitação de Compra"
        onSearch={setSearchTerm}
      />

      <div className="overflow-x-auto mt-4">
        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
          <thead className="bg-slate-50 dark:bg-slate-700/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Nº</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Data</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Solicitante</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Projeto</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Valor Estimado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
            {filteredReqs.map(req => {
                const totalValue = req.items.reduce((sum, item) => sum + item.quantity * item.estimatedPrice, 0);
                return (
              <tr key={req.id}>
                <td className="px-6 py-4 whitespace-nowrap font-semibold">{req.requisitionNumber}</td>
                <td className="px-6 py-4 whitespace-nowrap">{new Date(req.requestDate).toLocaleDateString('pt-BR')}</td>
                <td className="px-6 py-4 whitespace-nowrap">{req.requesterName}</td>
                <td className="px-6 py-4 whitespace-nowrap">{req.projectName}</td>
                <td className="px-6 py-4 whitespace-nowrap">{formatCurrency(totalValue)}</td>
                <td className="px-6 py-4 whitespace-nowrap"><span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(req.status)}`}>{req.status}</span></td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    {req.status === 'Pendente' && (user?.role === 'admin' || user?.role === 'project_manager') && (
                        <>
                            {/* FIX: Use the correctly named status update handler. */}
                            <button onClick={() => handleUpdatePurchaseRequisitionStatus(req.id, 'Aprovada')} className="text-green-600 hover:text-green-800">Aprovar</button>
                            <button onClick={() => handleUpdatePurchaseRequisitionStatus(req.id, 'Rejeitada')} className="text-red-600 hover:text-red-800">Rejeitar</button>
                        </>
                    )}
                  <button onClick={() => openModal(req)} className="text-teal-600 hover:text-teal-900">Detalhes</button>
                  {req.status !== 'Concluída' && <button onClick={() => setReqToDelete(req)} className="text-red-600 hover:text-red-900">Excluir</button>}
                </td>
              </tr>
            )})}
          </tbody>
        </table>
      </div>

      {isModalOpen && <PurchaseRequisitionModal requisition={selectedReq} onClose={closeModal} onSave={handleSavePurchaseRequisition} user={user} projects={projects} />}
      {reqToDelete && (
        <ConfirmationModal
          isOpen={!!reqToDelete}
          onClose={() => setReqToDelete(null)}
          onConfirm={() => {
            handleDeletePurchaseRequisition(reqToDelete.id);
            setReqToDelete(null);
          }}
          title="Excluir Solicitação"
          message={`Tem certeza que deseja excluir a solicitação #${reqToDelete.requisitionNumber}?`}
        />
      )}
    </div>
  );
};

export default PurchaseRequisitionsTab;
