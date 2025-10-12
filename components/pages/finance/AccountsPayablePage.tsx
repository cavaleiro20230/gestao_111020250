import React, { useState, useContext } from 'react';
import { AppContext } from '../../../App';
import Header from '../../Header';
import Card from '../../Card';
import AccountPayableModal from '../../modals/AccountPayableModal';
import ConfirmationModal from '../../modals/ConfirmationModal';
import AIExpenseAnalysisModal from '../../modals/AIExpenseAnalysisModal';
import { Page, AIExpenseData } from '../../../types';
import type { AccountPayable } from '../../../types';
import TableControls from '../../TableControls';
import { SparklesIcon } from '../../icons';

const AccountsPayablePage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<AccountPayable | null>(null);
  const [accountToDelete, setAccountToDelete] = useState<AccountPayable | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const context = useContext(AppContext);
  if (!context) return null;

  const { accountsPayable, documents, handleSaveAccountPayable, handleDeleteAccountPayable, otherConfig, setActivePage } = context;

  const openModal = (account: AccountPayable | null = null) => {
    setSelectedAccount(account);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedAccount(null);
    setIsModalOpen(false);
  };

  const formatCurrency = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const filteredAccounts = accountsPayable.filter(account =>
    account.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    account.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAnalysisComplete = (data: AIExpenseData) => {
    const newAccount: Partial<AccountPayable> = {
        id: '', // Will be generated on save
        description: data.description || 'Despesa Analisada por IA',
        category: data.category || 'Outros',
        value: data.value || 0,
        dueDate: data.dueDate || new Date().toISOString().split('T')[0],
        status: 'Aberto',
        // FIX: Add the required 'reconciled' property.
        reconciled: false,
    };
    setSelectedAccount(newAccount as AccountPayable);
    setIsAIModalOpen(false);
    setIsModalOpen(true);
  };

  return (
    <div className="p-8">
      <Header title="Contas a Pagar">
        <div className="flex space-x-2">
            <button onClick={() => setIsAIModalOpen(true)} className="flex items-center px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors shadow-sm">
                <SparklesIcon className="w-5 h-5 mr-2" />
                Analisar Despesa com IA
            </button>
            <button onClick={() => openModal()} className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors shadow-sm">
              Nova Conta
            </button>
        </div>
      </Header>
       <div className="mb-4">
          <button onClick={() => setActivePage(Page.Finance)} className="text-sm text-teal-600 hover:text-teal-800 dark:text-teal-400 dark:hover:text-teal-200 font-medium">
              &larr; Voltar para Financeiro
          </button>
      </div>
      <Card>
        <TableControls
          onAdd={() => openModal()}
          addLabel="Nova Conta"
          onSearch={setSearchTerm}
        />
        <div className="overflow-x-auto mt-4">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
            {/* Table Head */}
            <thead className="bg-slate-50 dark:bg-slate-700/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Descrição</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Categoria</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Valor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Vencimento</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            {/* Table Body */}
            <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
              {filteredAccounts.map(account => (
                <tr key={account.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{account.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{account.category}</td>
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
      {isModalOpen && <AccountPayableModal account={selectedAccount} onClose={closeModal} onSave={handleSaveAccountPayable} costCenters={otherConfig.costCenters} documents={documents} />}
      {isAIModalOpen && <AIExpenseAnalysisModal isOpen={isAIModalOpen} onClose={() => setIsAIModalOpen(false)} onAnalysisComplete={handleAnalysisComplete} />}
      {accountToDelete && (
        <ConfirmationModal
          isOpen={!!accountToDelete}
          onClose={() => setAccountToDelete(null)}
          onConfirm={() => {
            handleDeleteAccountPayable(accountToDelete.id);
            setAccountToDelete(null);
          }}
          title="Excluir Conta a Pagar"
          message={`Tem certeza que deseja excluir a conta "${accountToDelete.description}"?`}
        />
      )}
    </div>
  );
};

export default AccountsPayablePage;