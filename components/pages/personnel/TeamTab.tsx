import React, { useState, useContext } from 'react';
import type { Personnel } from '../../../types';
import { AppContext } from '../../../App';
import PersonnelModal from '../../modals/PersonnelModal';
import ConfirmationModal from '../../modals/ConfirmationModal';
import TableControls from '../../TableControls';

const TeamTab: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPersonnel, setSelectedPersonnel] = useState<Personnel | null>(null);
  const [personnelToDelete, setPersonnelToDelete] = useState<Personnel | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const context = useContext(AppContext);
  if (!context) return null;

  const { personnel, handleSavePersonnel, handleDeletePersonnel } = context;

  const openModal = (p: Personnel | null = null) => {
    setSelectedPersonnel(p);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedPersonnel(null);
    setIsModalOpen(false);
  };

  const filteredPersonnel = personnel.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <div>
      <TableControls
        onAdd={() => openModal()}
        addLabel="Novo Membro da Equipe"
        onSearch={setSearchTerm}
      />

      <div className="overflow-x-auto mt-4">
        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
          <thead className="bg-slate-50 dark:bg-slate-700/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Nome</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Cargo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Vínculo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Custo/Hora</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
            {filteredPersonnel.map(p => (
              <tr key={p.id}>
                <td className="px-6 py-4 whitespace-nowrap font-medium">{p.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{p.position}</td>
                <td className="px-6 py-4 whitespace-nowrap">{p.linkType}</td>
                <td className="px-6 py-4 whitespace-nowrap">{formatCurrency(p.costPerHour)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => openModal(p)} className="text-teal-600 hover:text-teal-900 dark:text-teal-400 dark:hover:text-teal-200">Editar</button>
                  <button onClick={() => setPersonnelToDelete(p)} className="ml-4 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200">Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && <PersonnelModal personnel={selectedPersonnel} onClose={closeModal} onSave={handleSavePersonnel} />}
      {personnelToDelete && (
        <ConfirmationModal
          isOpen={!!personnelToDelete}
          onClose={() => setPersonnelToDelete(null)}
          onConfirm={() => {
            handleDeletePersonnel(personnelToDelete.id);
            setPersonnelToDelete(null);
          }}
          title="Excluir Membro da Equipe"
          message={`Tem certeza que deseja excluir ${personnelToDelete.name}?`}
        />
      )}
    </div>
  );
};

export default TeamTab;