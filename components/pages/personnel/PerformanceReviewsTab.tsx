import React, { useState, useContext } from 'react';
import type { PerformanceReview } from '../../../types';
import { AppContext } from '../../../App';
import PerformanceReviewModal from '../../modals/PerformanceReviewModal';
import ConfirmationModal from '../../modals/ConfirmationModal';
import TableControls from '../../TableControls';

const PerformanceReviewsTab: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<PerformanceReview | null>(null);
  const [reviewToDelete, setReviewToDelete] = useState<PerformanceReview | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const context = useContext(AppContext);
  if (!context) return null;

  const { performanceReviews, handleSavePerformanceReview, handleDeletePerformanceReview, personnel, users } = context;

  const openModal = (review: PerformanceReview | null = null) => {
    setSelectedReview(review);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedReview(null);
    setIsModalOpen(false);
  };

  const filteredReviews = (performanceReviews || []).filter(r =>
    r.cycleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.employeeName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const getStatusClass = (status: PerformanceReview['status']) => {
    switch (status) {
      case 'Concluída': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'Em Andamento': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'Pendente': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      default: return '';
    }
  };

  return (
    <div>
      <TableControls
        onAdd={() => openModal()}
        addLabel="Nova Avaliação"
        onSearch={setSearchTerm}
      />

      <div className="overflow-x-auto mt-4">
        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
          <thead className="bg-slate-50 dark:bg-slate-700/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Ciclo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Avaliado(a)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Avaliador(a)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Data</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
            {filteredReviews.map(r => (
              <tr key={r.id}>
                <td className="px-6 py-4 whitespace-nowrap font-medium">{r.cycleName}</td>
                <td className="px-6 py-4 whitespace-nowrap">{r.employeeName}</td>
                <td className="px-6 py-4 whitespace-nowrap">{r.managerName}</td>
                <td className="px-6 py-4 whitespace-nowrap">{new Date(r.reviewDate).toLocaleDateString('pt-BR')}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(r.status)}`}>
                        {r.status}
                    </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => openModal(r)} className="text-teal-600 hover:text-teal-900">Detalhes</button>
                  <button onClick={() => setReviewToDelete(r)} className="ml-4 text-red-600 hover:text-red-900">Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && <PerformanceReviewModal review={selectedReview} onClose={closeModal} onSave={handleSavePerformanceReview} personnel={personnel} managers={users.filter(u => u.role === 'admin' || u.role === 'project_manager' || u.role === 'superintendent' || u.role === 'coordinator')} />}
      {reviewToDelete && (
        <ConfirmationModal
            isOpen={!!reviewToDelete}
            onClose={() => setReviewToDelete(null)}
            onConfirm={() => { handleDeletePerformanceReview(reviewToDelete.id); setReviewToDelete(null); }}
            title="Excluir Avaliação"
            message={`Tem certeza que deseja excluir a avaliação de ${reviewToDelete.employeeName} do ciclo ${reviewToDelete.cycleName}?`}
        />
      )}
    </div>
  );
};

export default PerformanceReviewsTab;