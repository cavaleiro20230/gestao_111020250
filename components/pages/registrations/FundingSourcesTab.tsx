import React, { useState, useContext } from 'react';
import type { FundingSource } from '../../../types';
import { AppContext } from '../../../App';
import ConfirmationModal from '../../modals/ConfirmationModal';
import TableControls from '../../TableControls';
import FundingSourceModal from '../../modals/FundingSourceModal';

interface FundingSourcesTabProps {
  sources: FundingSource[];
  onSave: (source: FundingSource) => void;
  onDelete: (id: string) => void;
}

const FundingSourcesTab: React.FC<FundingSourcesTabProps> = ({ sources, onSave, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSource, setSelectedSource] = useState<FundingSource | null>(null);
  const [sourceToDelete, setSourceToDelete] = useState<FundingSource | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const openModal = (source: FundingSource | null = null) => {
    setSelectedSource(source);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedSource(null);
    setIsModalOpen(false);
  };
  
  const filteredSources = sources.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <TableControls
        onAdd={() => openModal()}
        addLabel="Nova Fonte de Recurso"
        onSearch={setSearchTerm}
      />
      
      <div className="overflow-x-auto mt-4">
        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
          <thead className="bg-slate-50 dark:bg-slate-700/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Nome</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Descrição</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
            {filteredSources.map(source => (
              <tr key={source.id}>
                <td className="px-6 py-4 whitespace-nowrap">{source.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{source.description}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => openModal(source)} className="text-teal-600 hover:text-teal-900 dark:text-teal-400 dark:hover:text-teal-200">Editar</button>
                  <button onClick={() => setSourceToDelete(source)} className="ml-4 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200">Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {isModalOpen && <FundingSourceModal source={selectedSource} onClose={closeModal} onSave={onSave} />}
      {sourceToDelete && (
        <ConfirmationModal
          isOpen={!!sourceToDelete}
          onClose={() => setSourceToDelete(null)}
          onConfirm={() => {
            onDelete(sourceToDelete.id);
            setSourceToDelete(null);
          }}
          title="Excluir Fonte de Recurso"
          message={`Tem certeza que deseja excluir a fonte de recurso ${sourceToDelete.name}?`}
        />
      )}
    </div>
  );
};

export default FundingSourcesTab;
