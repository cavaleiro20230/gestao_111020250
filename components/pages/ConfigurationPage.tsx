import React, { useState, useContext } from 'react';
import type { CompanyConfig, FiscalConfig, FinancialConfig, OtherConfig, AccountingConfig } from '../../types';
import { AppContext } from '../../App';
import CompanyConfigForm from './configuration/CompanyConfigForm';
import FiscalConfigForm from './configuration/FiscalConfigForm';
import FinancialConfigForm from './configuration/FinancialConfigForm';
import OtherConfigForm from './configuration/OtherConfigForm';
import Card from '../Card';
import Header from '../Header';
import AuditTrailPage from './AuditTrailPage';
import BankIntegrationsForm from './configuration/BankIntegrationsForm';
import { ShieldCheckIcon, LinkIcon, ArrowPathIcon, DocumentTextIcon } from '../icons';
import WorkflowConfigPage from './configuration/WorkflowConfigPage';
import { Page } from '../../types';
import ChartOfAccountsManagementPage from './configuration/ChartOfAccountsManagementPage';

type ConfigView = 'main' | 'company' | 'fiscal' | 'financial' | 'other' | 'audit' | 'integrations' | 'workflows' | 'chartOfAccounts';

const ConfigurationPage: React.FC = () => {
    const [view, setView] = useState<ConfigView>('main');
    const context = useContext(AppContext);

    if (!context) return null;

    const { 
        companyConfig, handleSaveCompanyConfig,
        fiscalConfig, handleSaveFiscalConfig,
        financialConfig, handleSaveFinancialConfig,
        otherConfig, handleSaveOtherConfig,
        setActivePage
    } = context;

    const renderContent = () => {
        switch (view) {
            case 'company':
                return <CompanyConfigForm config={companyConfig} onSave={handleSaveCompanyConfig} onBack={() => setView('main')} />;
            case 'fiscal':
                return <FiscalConfigForm config={fiscalConfig} onSave={handleSaveFiscalConfig} onBack={() => setView('main')} />;
            case 'financial':
                return <FinancialConfigForm config={financialConfig} onSave={handleSaveFinancialConfig} onBack={() => setView('main')} />;
            case 'other':
                return <OtherConfigForm config={otherConfig} onSave={handleSaveOtherConfig} onBack={() => setView('main')} />;
            case 'audit':
                return <AuditTrailPage onBack={() => setView('main')} />;
            case 'integrations':
                return <BankIntegrationsForm onBack={() => setView('main')} />;
             case 'workflows':
                return <WorkflowConfigPage onBack={() => setView('main')} />;
            case 'chartOfAccounts':
                return <ChartOfAccountsManagementPage onBack={() => setView('main')} />;
            case 'main':
            default:
                return (
                    <div>
                        <Header title="Configurações" />
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setView('company')}>
                                <h3 className="font-semibold text-lg">Dados da Empresa</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Configure as informações da sua empresa.</p>
                            </Card>
                            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setView('chartOfAccounts')}>
                                <DocumentTextIcon className="w-6 h-6 mb-2 text-teal-600 dark:text-teal-400"/>
                                <h3 className="font-semibold text-lg">Plano de Contas</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Adicione ou edite as contas contábeis do sistema.</p>
                            </Card>
                            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setView('fiscal')}>
                                <h3 className="font-semibold text-lg">Fiscal</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Defina regimes tributários e alíquotas.</p>
                            </Card>
                             <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setView('financial')}>
                                <h3 className="font-semibold text-lg">Financeiro</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Ajuste juros, multas e notificações.</p>
                            </Card>
                             <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setView('other')}>
                                <h3 className="font-semibold text-lg">Outras</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Gerencie centros de custo e condições de pagamento.</p>
                            </Card>
                             <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setView('audit')}>
                                <ShieldCheckIcon className="w-6 h-6 mb-2 text-teal-600 dark:text-teal-400"/>
                                <h3 className="font-semibold text-lg">Trilha de Auditoria</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Visualize o log de todas as ações no sistema.</p>
                            </Card>
                             <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setView('integrations')}>
                                <LinkIcon className="w-6 h-6 mb-2 text-teal-600 dark:text-teal-400"/>
                                <h3 className="font-semibold text-lg">Integrações Bancárias</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Conecte contas e simule o Open Finance.</p>
                            </Card>
                            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setView('workflows')}>
                                <ArrowPathIcon className="w-6 h-6 mb-2 text-teal-600 dark:text-teal-400"/>
                                <h3 className="font-semibold text-lg">Workflows de Aprovação</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Crie cadeias de aprovação personalizadas.</p>
                            </Card>
                        </div>
                    </div>
                );
        }
    };
    
    return <div className="p-8">{renderContent()}</div>;
};

export default ConfigurationPage;