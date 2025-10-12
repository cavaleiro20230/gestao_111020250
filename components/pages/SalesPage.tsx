import React, { useState } from 'react';
import Header from '../Header';
import Card from '../Card';
import SalesOrdersTab from './sales/SalesOrdersTab';

type Tab = 'orders' | 'invoices' | 'quotes';

const SalesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('orders');

  const tabs: { id: Tab, label: string }[] = [
    { id: 'orders', label: 'Ordens de Venda' },
    { id: 'invoices', label: 'Faturas (Em breve)' },
    { id: 'quotes', label: 'Orçamentos (Em breve)' },
  ];

  const renderTabContent = () => {
    switch(activeTab) {
      case 'orders': return <SalesOrdersTab />;
      default: return <div className="text-center py-12"><p className="text-slate-500">Funcionalidade em desenvolvimento.</p></div>;
    }
  };

  return (
    <div className="p-8">
      <Header title="Vendas" />
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
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${tab.id !== 'orders' ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={tab.id !== 'orders'}
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

export default SalesPage;