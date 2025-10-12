import React, { useState, useContext, useMemo } from 'react';
import { AppContext } from '../../../App';

const GeneralLedgerTab: React.FC = () => {
    const [selectedAccountId, setSelectedAccountId] = useState<string>('');
    const context = useContext(AppContext);
    if (!context) return null;

    const { chartOfAccounts, accountingBatches } = context;

    const ledgerEntries = useMemo(() => {
        if (!selectedAccountId) return [];
        
        const account = chartOfAccounts.find(a => a.id === selectedAccountId);
        if (!account) return [];
        
        const isDebitNormal = account.type === 'Ativo' || account.type === 'Despesa';
        let runningBalance = 0;

        const entries = accountingBatches
            .filter(b => b.status === 'Contabilizado')
            .flatMap(b => b.entries.map(e => ({ ...e, referenceDate: b.referenceDate })))
            .filter(e => e.chartOfAccountId === selectedAccountId)
            .sort((a, b) => new Date(a.referenceDate).getTime() - new Date(b.referenceDate).getTime())
            .map(entry => {
                const balanceChange = isDebitNormal ? entry.debit - entry.credit : entry.credit - entry.debit;
                runningBalance += balanceChange;
                return { ...entry, runningBalance };
            });

        return entries;
    }, [selectedAccountId, chartOfAccounts, accountingBatches]);

    const formatCurrency = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', 'currency': 'BRL' });

    return (
        <div className="space-y-4">
            <div>
                <label htmlFor="account-select" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Selecione uma Conta Contábil</label>
                <select 
                    id="account-select"
                    value={selectedAccountId}
                    onChange={e => setSelectedAccountId(e.target.value)}
                    className="mt-1 block w-full md:w-1/2 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm bg-white dark:bg-slate-700"
                >
                    <option value="" disabled>Selecione para ver o razão...</option>
                    {chartOfAccounts.sort((a,b) => a.code.localeCompare(b.code)).map(acc => (
                        <option key={acc.id} value={acc.id}>{acc.code} - {acc.name}</option>
                    ))}
                </select>
            </div>
            
            <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-lg">
                <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                    <thead className="bg-slate-50 dark:bg-slate-700/50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase">Data</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase">Descrição</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-300 uppercase">Débito</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-300 uppercase">Crédito</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-300 uppercase">Saldo</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                        {ledgerEntries.map(entry => (
                            <tr key={entry.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">{new Date(entry.referenceDate).toLocaleDateString('pt-BR')}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">{entry.description}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-right">{entry.debit > 0 ? formatCurrency(entry.debit) : '-'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-right">{entry.credit > 0 ? formatCurrency(entry.credit) : '-'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-semibold">{formatCurrency(entry.runningBalance)}</td>
                            </tr>
                        ))}
                         {selectedAccountId && ledgerEntries.length === 0 && (
                            <tr><td colSpan={5} className="text-center py-6 text-slate-500">Nenhum movimento para esta conta no período.</td></tr>
                        )}
                        {!selectedAccountId && (
                            <tr><td colSpan={5} className="text-center py-6 text-slate-500">Selecione uma conta para começar.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default GeneralLedgerTab;
