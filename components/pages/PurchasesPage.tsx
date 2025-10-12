// FIX: Create this file to act as a container for purchasing-related tabs.
import React, { useState } from 'react';
import Header from '../Header';
import Card from '../Card';
import PurchaseOrdersTab from './purchases/PurchaseOrdersTab';
import PurchaseRequisitionsTab from './purchases/PurchaseRequisitionsTab';
import QuotationMapsTab from './purchases/QuotationMapsTab';

type Tab = 'requisitions' | 'quotations' | 'orders';

const PurchasesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('requisitions');

  const tabs: { id: Tab, label: string }[] = [
    { id: 'requisitions', label: 'Solicitações de Compra' },
    { id: 'quotations', label: 'Mapas de Cotação' },
    { id: 'orders', label: 'Ordens de Compra' },
  ];

  const renderTabContent = () => {
    switch(activeTab) {
      case 'requisitions': return <PurchaseRequisitionsTab />;
      case 'orders': return <PurchaseOrdersTab />;
      case 'quotations': return <QuotationMapsTab />;
      default: return null;
    }
  };

  return (
    <div className="p-8">
      <Header title="Compras" />
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

export default PurchasesPage;
