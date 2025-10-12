import React, { useState } from 'react';
import type { Supplier } from '../../../types';
import SupplierModal from '../../modals/SupplierModal';
import ConfirmationModal from '../../modals/ConfirmationModal';
import TableControls from '../../TableControls';

interface SuppliersTabProps {
  suppliers: Supplier[];
  onSave: (supplier: Supplier) => void;
  onDelete: (supplierId: string) => void;
}

const SuppliersTab: React.FC<SuppliersTabProps> = ({ suppliers, onSave, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [supplierToDelete, setSupplierToDelete] = useState<Supplier | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const openModal = (supplier: Supplier | null = null) => {
    setSelectedSupplier(supplier);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedSupplier(null);
    setIsModalOpen(false);
  };

  const filteredSuppliers = suppliers.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div>
      <TableControls
        onAdd={() => openModal()}
        addLabel="Novo Fornecedor"
        onSearch={setSearchTerm}
      />
      
      <div className="overflow-x-auto mt-4">
        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
          <thead className="bg-slate-50 dark:bg-slate-700/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Nome</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Contato</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
            {filteredSuppliers.map(supplier => (
              <tr key={supplier.id}>
                <td className="px-6 py-4 whitespace-nowrap">{supplier.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{supplier.contactPerson}</td>
                <td className="px-6 py-4 whitespace-nowrap">{supplier.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => openModal(supplier)} className="text-teal-600 hover:text-teal-900 dark:text-teal-400 dark:hover:text-teal-200">Editar</button>
                  <button onClick={() => setSupplierToDelete(supplier)} className="ml-4 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200">Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && <SupplierModal supplier={selectedSupplier} onClose={closeModal} onSave={onSave} />}
      {supplierToDelete && (
        <ConfirmationModal
          isOpen={!!supplierToDelete}
          onClose={() => setSupplierToDelete(null)}
          onConfirm={() => {
            onDelete(supplierToDelete.id);
            setSupplierToDelete(null);
          }}
          title="Excluir Fornecedor"
          message={`Tem certeza que deseja excluir o fornecedor ${supplierToDelete.name}?`}
        />
      )}
    </div>
  );
};

export default SuppliersTab;
