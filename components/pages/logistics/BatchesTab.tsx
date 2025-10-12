
import React, { useState, useContext } from 'react';
import type { Batch } from '../../../types';
import { AppContext } from '../../../App';
import BatchModal from '../../modals/BatchModal';
import ConfirmationModal from '../../modals/ConfirmationModal';
import TableControls from '../../TableControls';

const BatchesTab: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
  const [batchToDelete, setBatchToDelete] = useState<Batch | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const context = useContext(AppContext);
  if (!context) return null;

  const { batches, projects, handleSaveBatch, handleDeleteBatch } = context;

  const openModal = (batch: Batch | null = null) => {
    setSelectedBatch(batch);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedBatch(null);
    setIsModalOpen(false);
  };
  
  const filteredBatches = batches.filter(b => 
    b.identifier.toLowerCase().includes(searchTerm.toLowerCase()) || 
    b.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <TableControls
        onAdd={() => openModal()}
        addLabel="Novo Lote"
        onSearch={setSearchTerm}
      />
      
      <div className="overflow-x-auto mt-4">
        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
          <thead className="bg-slate-50 dark:bg-slate-700/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Identificador</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Projeto</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Data Coleta/Receb.</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
            {filteredBatches.map(batch => (
              <tr key={batch.id}>
                <td className="px-6 py-4 whitespace-nowrap font-semibold">{batch.identifier}</td>
                <td className="px-6 py-4 whitespace-nowrap">{batch.projectName}</td>
                <td className="px-6 py-4 whitespace-nowrap">{new Date(batch.collectionDate).toLocaleDateString('pt-BR')}</td>
                <td className="px-6 py-4 whitespace-nowrap">{batch.status}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => openModal(batch)} className="text-teal-600 hover:text-teal-900 dark:text-teal-400 dark:hover:text-teal-200">Editar</button>
                  <button onClick={() => setBatchToDelete(batch)} className="ml-4 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200">Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {isModalOpen && <BatchModal batch={selectedBatch} onClose={closeModal} onSave={handleSaveBatch} projects={projects} />}
      {batchToDelete && (
        <ConfirmationModal
          isOpen={!!batchToDelete}
          onClose={() => setBatchToDelete(null)}
          onConfirm={() => {
            handleDeleteBatch(batchToDelete.id);
            setBatchToDelete(null);
          }}
          title="Excluir Lote"
          message={`Tem certeza que deseja excluir o lote ${batchToDelete.identifier}?`}
        />
      )}
    </div>
  );
};

export default BatchesTab;
