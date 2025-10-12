// FIX: Create missing AccountingPage.tsx component.
import React, { useState, useContext } from 'react';
import Header from '../Header';
import Card from '../Card';
import AccountingBatchesTab from './accounting/AccountingBatchesTab';
import BankReconciliationTab from './accounting/BankReconciliationTab';
import GeneralLedgerTab from './accounting/GeneralLedgerTab';
import TrialBalanceTab from './accounting/TrialBalanceTab';
import { AppContext } from '../../App';
import { Page } from '../../types';
import { KeyIcon } from '../icons';

type Tab = 'batches' | 'reconciliation' | 'ledger' | 'trial_balance';

const AccountingPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('batches');
  const context = useContext(AppContext);
  if (!context) return null;

  const { setActivePage } = context;

  const tabs: { id: Tab, label: string }[] = [
    { id: 'batches', label: 'Lotes de Lançamentos' },
    { id: 'reconciliation', label: 'Conciliação Bancária' },
    { id: 'ledger', label: 'Livro Razão' },
    { id: 'trial_balance', label: 'Balancete de Verificação' },
  ];

  const renderTabContent = () => {
    switch(activeTab) {
      case 'batches': return <AccountingBatchesTab />;
      case 'reconciliation': return <BankReconciliationTab />;
      case 'ledger': return <GeneralLedgerTab />;
      case 'trial_balance': return <TrialBalanceTab />;
      default: return null;
    }
  };

  return (
    <div className="p-8">
      <Header title="Contabilidade">
        <button 
            onClick={() => setActivePage(Page.AccountingConfiguration)}
            className="flex items-center px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors shadow-sm"
        >
            <KeyIcon className="w-5 h-5 mr-2" />
            Configurações Contábeis
        </button>
      </Header>
      <Card>
        <div className="border-b border-slate-200 dark:border-slate-700">
          <nav className="-mb-px flex space-x-6 overflow-x-auto" aria-label="Tabs">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`${
                  activeTab === tab.id
                    ? 'border-teal-500 text-teal-600 dark:border-teal-400 dark:text-teal-400'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:border-slate-500'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
        <div className="mt-6">
            {renderTabContent()}
        </div>
      </Card>
    </div>
  );
};

export default AccountingPage;
