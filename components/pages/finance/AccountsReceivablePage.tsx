import React, { useState, useContext } from 'react';
import { AppContext } from '../../../App';
import Header from '../../Header';
import Card from '../../Card';
import AccountReceivableModal from '../../modals/AccountReceivableModal';
import ConfirmationModal from '../../modals/ConfirmationModal';
import { Page } from '../../../types';
import type { AccountReceivable } from '../../../types';

const AccountsReceivablePage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<AccountReceivable | null>(null);
  const [accountToDelete, setAccountToDelete] = useState<AccountReceivable | null>(null);
  
  const context = useContext(AppContext);
  if (!context) return null;

  const { accountsReceivable, handleSaveAccountReceivable, handleDeleteAccountReceivable, otherConfig, setActivePage } = context;

  const openModal = (account: AccountReceivable | null = null) => {
    setSelectedAccount(account);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedAccount(null);
    setIsModalOpen(false);
  };
  
  const formatCurrency = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });


  return (
    <div className="p-8">
      <Header title="Contas a Receber">
        <button onClick={() => openModal()} className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors shadow-sm">
          Nova Conta
        </button>
      </Header>
      <div className="mb-4">
          <button onClick={() => setActivePage(Page.Finance)} className="text-sm text-teal-600 hover:text-teal-800 dark:text-teal-400 dark:hover:text-teal-200 font-medium">
              &larr; Voltar para Financeiro
          </button>
      </div>
      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
            {/* Table Head */}
            <thead className="bg-slate-50 dark:bg-slate-700/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Descrição</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Valor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Vencimento</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            {/* Table Body */}
            <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
              {accountsReceivable.map(account => (
                <tr key={account.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{account.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{formatCurrency(account.value)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{new Date(account.dueDate).toLocaleDateString('pt-BR')}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{account.status}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => openModal(account)} className="text-teal-600 hover:text-teal-900 dark:text-teal-400 dark:hover:text-teal-200">Editar</button>
                    <button onClick={() => setAccountToDelete(account)} className="ml-4 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200">Excluir</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      {isModalOpen && <AccountReceivableModal account={selectedAccount} onClose={closeModal} onSave={handleSaveAccountReceivable} costCenters={otherConfig.costCenters} />}
      {accountToDelete && (
        <ConfirmationModal
          isOpen={!!accountToDelete}
          onClose={() => setAccountToDelete(null)}
          onConfirm={() => {
            handleDeleteAccountReceivable(accountToDelete.id);
            setAccountToDelete(null);
          }}
          title="Excluir Conta a Receber"
          message={`Tem certeza que deseja excluir a conta "${accountToDelete.description}"?`}
        />
      )}
    </div>
  );
};

export default AccountsReceivablePage;