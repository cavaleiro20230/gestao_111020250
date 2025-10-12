
import React, { useState, useContext } from 'react';
import Header from '../Header';
import Card from '../Card';
import BatchesTab from './logistics/BatchesTab';
import ShipmentsTab from './logistics/ShipmentsTab';
import { AppContext } from '../../App';

type Tab = 'batches' | 'shipments';

const LogisticsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('batches');
  const context = useContext(AppContext);

  if (!context) return null;

  const tabs: { id: Tab, label: string }[] = [
    { id: 'batches', label: 'Lotes de Amostras/Insumos' },
    { id: 'shipments', label: 'Remessas' },
  ];

  const renderTabContent = () => {
    switch(activeTab) {
      case 'batches': return <BatchesTab />;
      case 'shipments': return <ShipmentsTab />;
      default: return null;
    }
  };

  return (
    <div className="p-8">
      <Header title="Logística e Controle de Amostras" />
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

export default LogisticsPage;
