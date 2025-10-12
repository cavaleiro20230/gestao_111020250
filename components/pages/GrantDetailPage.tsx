import React, { useState, useContext } from 'react';
import { AppContext } from '../../App';
import Header from '../Header';
import { Page, Grant } from '../../types';
import Card from '../Card';
import GrantComplianceTab from './grants/GrantComplianceTab';

type Tab = 'compliance' | 'financials';

const GrantDetailPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<Tab>('compliance');
    const context = useContext(AppContext);
    
    if (!context) return null;

    const { grants, pageContext, setActivePage } = context;
    const grantId = pageContext?.grantId;
    const grant = grants.find(g => g.id === grantId);

    if (!grant) {
        return (
            <div className="p-8 text-center">
                <h2 className="text-xl font-semibold">Convênio não encontrado</h2>
                <button onClick={() => setActivePage(Page.GrantManagement)} className="mt-4 px-4 py-2 bg-teal-600 text-white rounded-lg">Voltar para Convênios</button>
            </div>
        );
    }
    
    const tabs: { id: Tab, label: string }[] = [
        { id: 'compliance', label: 'Obrigações de Compliance' },
        { id: 'financials', label: 'Financeiro' },
    ];
    
    const renderTabContent = () => {
        switch(activeTab) {
            case 'compliance': return <GrantComplianceTab grant={grant} />;
            case 'financials': return <p className="text-center text-slate-500">Módulo financeiro do convênio em desenvolvimento.</p>;
            default: return null;
        }
    };


    return (
        <div className="p-8">
            <Header title={grant.name} />
             <div className="mb-4">
                <button onClick={() => setActivePage(Page.GrantManagement)} className="text-sm text-teal-600 hover:text-teal-800 dark:text-teal-400 dark:hover:text-teal-200 font-medium">
                    &larr; Voltar para a lista de convênios
                </button>
            </div>
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

export default GrantDetailPage;
