import React, { useState, useContext } from 'react';
import type { BudgetItem } from '../../../types';
import { AppContext } from '../../../App';
import ConfirmationModal from '../../modals/ConfirmationModal';
import TableControls from '../../TableControls';
import BudgetItemModal from '../../modals/BudgetItemModal';

interface BudgetItemsTabProps {
  items: BudgetItem[];
  onSave: (item: BudgetItem) => void;
  onDelete: (id: string) => void;
}

const BudgetItemsTab: React.FC<BudgetItemsTabProps> = ({ items, onSave, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<BudgetItem | null>(null);
  const [itemToDelete, setItemToDelete] = useState<BudgetItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const openModal = (item: BudgetItem | null = null) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedItem(null);
    setIsModalOpen(false);
  };
  
  const filteredItems = items.filter(i => 
    i.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    i.code.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a,b) => a.code.localeCompare(b.code));

  return (
    <div>
      <TableControls
        onAdd={() => openModal()}
        addLabel="Nova Rubrica"
        onSearch={setSearchTerm}
      />
      
      <div className="overflow-x-auto mt-4">
        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
          <thead className="bg-slate-50 dark:bg-slate-700/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Código</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Nome</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Descrição</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
            {filteredItems.map(item => (
              <tr key={item.id}>
                <td className="px-6 py-4 whitespace-nowrap">{item.code}</td>
                <td className="px-6 py-4 whitespace-nowrap">{item.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{item.description}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => openModal(item)} className="text-teal-600 hover:text-teal-900 dark:text-teal-400 dark:hover:text-teal-200">Editar</button>
                  <button onClick={() => setItemToDelete(item)} className="ml-4 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200">Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {isModalOpen && <BudgetItemModal item={selectedItem} onClose={closeModal} onSave={onSave} />}
      {itemToDelete && (
        <ConfirmationModal
          isOpen={!!itemToDelete}
          onClose={() => setItemToDelete(null)}
          onConfirm={() => {
            onDelete(itemToDelete.id);
            setItemToDelete(null);
          }}
          title="Excluir Rubrica"
          message={`Tem certeza que deseja excluir a rubrica ${itemToDelete.name}?`}
        />
      )}
    </div>
  );
};

export default BudgetItemsTab;
