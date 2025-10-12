import React, { useContext, useState } from 'react';
import { AppContext } from '../../../App';
import Header from '../../Header';
import Card from '../../Card';
import { useToast } from '../../../contexts/ToastContext';

interface BankIntegrationsFormProps {
    onBack: () => void;
}

const availableBanks = ['Banco do Brasil', 'Itaú Unibanco', 'Caixa Econômica Federal', 'Bradesco'];

const BankIntegrationsForm: React.FC<BankIntegrationsFormProps> = ({ onBack }) => {
    const context = useContext(AppContext);
    const { showToast } = useToast();
    if (!context) return null;

    const { bankIntegrations, handleConnectBank, handleSyncBank } = context;
    const connectedBankNames = bankIntegrations.map(b => b.bankName);
    const unconnectedBanks = availableBanks.filter(b => !connectedBankNames.includes(b));
    
    const handleConnect = (bankName: string) => {
        handleConnectBank(bankName);
    };

    const handleSync = (integrationId: string) => {
        handleSyncBank(integrationId);
    };


    return (
        <div>
            <Header title="Integrações Bancárias (Open Finance)" />
            <div className="space-y-6">
                <Card>
                    <h3 className="font-semibold text-lg mb-4">Contas Conectadas</h3>
                     <div className="space-y-4">
                        {bankIntegrations.map(integration => (
                            <div key={integration.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                                <div>
                                    <p className="font-semibold">{integration.bankName}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                        Status: <span className="text-green-600 dark:text-green-400 font-medium capitalize">{integration.status}</span> | 
                                        Última Sincronização: {new Date(integration.lastSync).toLocaleString('pt-BR')}
                                    </p>
                                </div>
                                <button onClick={() => handleSync(integration.id)} className="px-4 py-2 bg-sky-600 text-white text-sm rounded-lg hover:bg-sky-700 transition-colors shadow-sm">
                                    Sincronizar
                                </button>
                            </div>
                        ))}
                         {bankIntegrations.length === 0 && <p className="text-sm text-center text-slate-500">Nenhuma conta conectada.</p>}
                     </div>
                </Card>

                 <Card>
                    <h3 className="font-semibold text-lg mb-4">Conectar Nova Conta</h3>
                    <div className="space-y-4">
                        {unconnectedBanks.map(bankName => (
                             <div key={bankName} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                                <p className="font-semibold">{bankName}</p>
                                <button onClick={() => handleConnect(bankName)} className="px-4 py-2 bg-teal-600 text-white text-sm rounded-lg hover:bg-teal-700 transition-colors shadow-sm">
                                    Conectar
                                </button>
                             </div>
                        ))}
                        {unconnectedBanks.length === 0 && <p className="text-sm text-center text-slate-500">Todos os bancos disponíveis já estão conectados.</p>}
                    </div>
                 </Card>

            </div>
            <div className="mt-6 flex justify-end">
                <button type="button" onClick={onBack} className="px-4 py-2 bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-white rounded-lg hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors">Voltar</button>
            </div>
        </div>
    );
};

export default BankIntegrationsForm;