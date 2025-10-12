import React, { useContext } from 'react';
import { AppContext } from '../../../App';
import Header from '../../Header';
import Card from '../../Card';
import ChartOfAccountsTab from '../registrations/ChartOfAccountsTab';

interface ChartOfAccountsManagementPageProps {
    onBack: () => void;
}

const ChartOfAccountsManagementPage: React.FC<ChartOfAccountsManagementPageProps> = ({ onBack }) => {
    const context = useContext(AppContext);

    if (!context) return null;

    const { chartOfAccounts, handleSaveChartOfAccount, handleDeleteChartOfAccount } = context;

    return (
        <div>
            <Header title="Gerenciamento do Plano de Contas" />
            <Card>
                <ChartOfAccountsTab 
                    accounts={chartOfAccounts}
                    onSave={handleSaveChartOfAccount}
                    onDelete={handleDeleteChartOfAccount}
                />
            </Card>
            <div className="mt-6 flex justify-end">
                <button type="button" onClick={onBack} className="px-4 py-2 bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-white rounded-lg hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors">Voltar</button>
            </div>
        </div>
    );
};

export default ChartOfAccountsManagementPage;
