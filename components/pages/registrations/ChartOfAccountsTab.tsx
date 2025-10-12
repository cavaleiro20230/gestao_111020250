import React, { useState } from 'react';
import type { ChartOfAccount } from '../../../types';
import ChartOfAccountModal from '../../modals/ChartOfAccountModal';
import ConfirmationModal from '../../modals/ConfirmationModal';
import TableControls from '../../TableControls';

interface ChartOfAccountsTabProps {
  accounts: ChartOfAccount[];
  onSave: (account: ChartOfAccount) => void;
  onDelete: (accountId: string) => void;
}

const ChartOfAccountsTab: React.FC<ChartOfAccountsTabProps> = ({ accounts, onSave, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<ChartOfAccount | null>(null);
  const [accountToDelete, setAccountToDelete] = useState<ChartOfAccount | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const openModal = (account: ChartOfAccount | null = null) => {
    setSelectedAccount(account);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedAccount(null);
    setIsModalOpen(false);
  };
  
  const filteredAccounts = accounts.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.code.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a,b) => a.code.localeCompare(b.code));

  return (
    <div>
      <TableControls
        onAdd={() => openModal()}
        addLabel="Nova Conta"
        onSearch={setSearchTerm}
      />
      
      <div className="overflow-x-auto mt-4">
        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
          <thead className="bg-slate-50 dark:bg-slate-700/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Código</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Nome da Conta</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Tipo</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
            {filteredAccounts.map(account => (
              <tr key={account.id}>
                <td className="px-6 py-4 whitespace-nowrap">{account.code}</td>
                <td className="px-6 py-4 whitespace-nowrap">{account.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{account.type}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => openModal(account)} className="text-teal-600 hover:text-teal-900 dark:text-teal-400 dark:hover:text-teal-200">Editar</button>
                  <button onClick={() => setAccountToDelete(account)} className="ml-4 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200">Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {isModalOpen && <ChartOfAccountModal account={selectedAccount} onClose={closeModal} onSave={onSave} />}
      {accountToDelete && (
        <ConfirmationModal
          isOpen={!!accountToDelete}
          onClose={() => setAccountToDelete(null)}
          onConfirm={() => {
            onDelete(accountToDelete.id);
            setAccountToDelete(null);
          }}
          title="Excluir Conta"
          message={`Tem certeza que deseja excluir a conta ${accountToDelete.name}?`}
        />
      )}
    </div>
  );
};

export default ChartOfAccountsTab;
