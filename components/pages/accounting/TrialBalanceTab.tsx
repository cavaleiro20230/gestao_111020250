import React, { useContext, useMemo } from 'react';
import { AppContext } from '../../../App';

const TrialBalanceTab: React.FC = () => {
    const context = useContext(AppContext);
    if (!context) return null;

    const { chartOfAccounts, accountingBatches } = context;

    const reportData = useMemo(() => {
        const balances = chartOfAccounts.map(account => {
            const isDebitNormal = account.type === 'Ativo' || account.type === 'Despesa';
            const balance = accountingBatches
                .filter(b => b.status === 'Contabilizado')
                .flatMap(b => b.entries)
                .filter(e => e.chartOfAccountId === account.id)
                .reduce((acc, entry) => {
                    const balanceChange = isDebitNormal ? entry.debit - entry.credit : entry.credit - entry.debit;
                    return acc + balanceChange;
                }, 0);
            
            return {
                ...account,
                debit: isDebitNormal && balance > 0 ? balance : 0,
                credit: !isDebitNormal && balance > 0 ? balance : 0,
            };
        });
        
        return balances.sort((a,b) => a.code.localeCompare(b.code));
    }, [chartOfAccounts, accountingBatches]);
    
    const totals = useMemo(() => reportData.reduce((acc, item) => ({
        debit: acc.debit + item.debit,
        credit: acc.credit + item.credit
    }), { debit: 0, credit: 0 }), [reportData]);

    const formatCurrency = (value: number) => value > 0 ? value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '-';
    
    return (
        <div className="overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-lg">
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                <thead className="bg-slate-50 dark:bg-slate-700/50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase">Código</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase">Conta Contábil</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-300 uppercase">Saldo Devedor</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-300 uppercase">Saldo Credor</th>
                    </tr>
                </thead>
                <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                    {reportData.map(account => (
                        <tr key={account.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">{account.code}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{account.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right">{formatCurrency(account.debit)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-right">{formatCurrency(account.credit)}</td>
                        </tr>
                    ))}
                </tbody>
                <tfoot className="bg-slate-50 dark:bg-slate-700/50">
                    <tr className="font-bold">
                        <td className="px-6 py-4 text-sm uppercase" colSpan={2}>Totais</td>
                        <td className="px-6 py-4 text-sm text-right">{formatCurrency(totals.debit)}</td>
                        <td className="px-6 py-4 text-sm text-right">{formatCurrency(totals.credit)}</td>
                    </tr>
                    {totals.debit !== totals.credit && (
                        <tr>
                            <td colSpan={4} className="text-center py-2 text-red-500 font-semibold bg-red-50 dark:bg-red-900/30">
                                Atenção! A soma dos débitos e créditos não é igual.
                            </td>
                        </tr>
                    )}
                </tfoot>
            </table>
        </div>
    );
};

export default TrialBalanceTab;
