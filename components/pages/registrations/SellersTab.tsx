import React, { useState } from 'react';
import type { Seller } from '../../../types';
import SellerModal from '../../modals/SellerModal';
import ConfirmationModal from '../../modals/ConfirmationModal';
import TableControls from '../../TableControls';

interface SellersTabProps {
  sellers: Seller[];
  onSave: (seller: Seller) => void;
  onDelete: (sellerId: string) => void;
}

const SellersTab: React.FC<SellersTabProps> = ({ sellers, onSave, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSeller, setSelectedSeller] = useState<Seller | null>(null);
  const [sellerToDelete, setSellerToDelete] = useState<Seller | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const openModal = (seller: Seller | null = null) => {
    setSelectedSeller(seller);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedSeller(null);
    setIsModalOpen(false);
  };

  const filteredSellers = sellers.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div>
      <TableControls
        onAdd={() => openModal()}
        addLabel="Novo Vendedor"
        onSearch={setSearchTerm}
      />

      <div className="overflow-x-auto mt-4">
        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
          <thead className="bg-slate-50 dark:bg-slate-700/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Nome</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Comissão (%)</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
            {filteredSellers.map(seller => (
              <tr key={seller.id}>
                <td className="px-6 py-4 whitespace-nowrap">{seller.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{seller.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">{seller.commissionRate}%</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => openModal(seller)} className="text-teal-600 hover:text-teal-900 dark:text-teal-400 dark:hover:text-teal-200">Editar</button>
                  <button onClick={() => setSellerToDelete(seller)} className="ml-4 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200">Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && <SellerModal seller={selectedSeller} onClose={closeModal} onSave={onSave} />}
      {sellerToDelete && (
        <ConfirmationModal
          isOpen={!!sellerToDelete}
          onClose={() => setSellerToDelete(null)}
          onConfirm={() => {
            onDelete(sellerToDelete.id);
            setSellerToDelete(null);
          }}
          title="Excluir Vendedor"
          message={`Tem certeza que deseja excluir o vendedor ${sellerToDelete.name}?`}
        />
      )}
    </div>
  );
};

export default SellersTab;
