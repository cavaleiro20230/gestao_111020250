// FIX: Create missing BalanceSheetReportPage.tsx component
import React, { useContext, useMemo } from 'react';
import Header from '../../Header';
import Card from '../../Card';
import { AppContext } from '../../../App';
import { Page, ChartOfAccount } from '../../../types';

interface AccountWithBalance extends ChartOfAccount {
    balance: number;
}

const BalanceSheetReportPage: React.FC = () => {
    const context = useContext(AppContext);
    if (!context) return null;

    const { chartOfAccounts, accountingBatches, setActivePage } = context;

    const reportData = useMemo(() => {
        const accountBalances: Record<string, number> = {};
        
        // Initialize all accounts with 0 balance
        chartOfAccounts.forEach(acc => accountBalances[acc.id] = 0);

        // Calculate balance from processed batches
        accountingBatches
            .filter(b => b.status === 'Contabilizado')
            .forEach(batch => {
                batch.entries.forEach(entry => {
                    const account = chartOfAccounts.find(a => a.id === entry.chartOfAccountId);
                    if (account) {
                        const balanceModifier = (account.type === 'Ativo' || account.type === 'Despesa') ? entry.debit - entry.credit : entry.credit - entry.debit;
                        accountBalances[entry.chartOfAccountId] += balanceModifier;
                    }
                });
            });

        const assets: AccountWithBalance[] = [];
        const liabilities: AccountWithBalance[] = [];
        const equity: AccountWithBalance[] = [];

        chartOfAccounts.forEach(account => {
            const accountWithBalance = { ...account, balance: accountBalances[account.id] || 0 };
            if (account.type === 'Ativo') assets.push(accountWithBalance);
            else if (account.type === 'Passivo') liabilities.push(accountWithBalance);
            else if (account.type === 'Patrimônio Líquido') equity.push(accountWithBalance);
        });

        const totalAssets = assets.reduce((sum, a) => sum + a.balance, 0);
        const totalLiabilities = liabilities.reduce((sum, l) => sum + l.balance, 0);
        const totalEquity = equity.reduce((sum, e) => sum + e.balance, 0);
        
        return { assets, liabilities, equity, totalAssets, totalLiabilities, totalEquity };
    }, [chartOfAccounts, accountingBatches]);

    const formatCurrency = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    return (
        <div className="p-8">
            <Header title="Balanço Patrimonial" />
            <div className="mb-4">
                <button onClick={() => setActivePage(Page.Reports)} className="text-sm text-teal-600 hover:text-teal-800 dark:text-teal-400 dark:hover:text-teal-200 font-medium">
                    &larr; Voltar para Relatórios
                </button>
            </div>
            <Card>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Assets */}
                    <div>
                        <h3 className="text-lg font-bold border-b-2 pb-2 mb-2">Ativos</h3>
                        <table className="w-full text-sm">
                            <tbody>
                                {reportData.assets.map(item => (
                                    <tr key={item.id} className="border-b border-slate-100 dark:border-slate-700/50">
                                        <td className="py-2">{item.code} - {item.name}</td>
                                        <td className="py-2 text-right">{formatCurrency(item.balance)}</td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr className="font-bold bg-slate-50 dark:bg-slate-700/50">
                                    <td className="py-3 px-2">Total de Ativos</td>
                                    <td className="py-3 px-2 text-right">{formatCurrency(reportData.totalAssets)}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                    {/* Liabilities & Equity */}
                    <div>
                        <h3 className="text-lg font-bold border-b-2 pb-2 mb-2">Passivos e Patrimônio Líquido</h3>
                        <table className="w-full text-sm">
                            <tbody>
                                {reportData.liabilities.map(item => (
                                    <tr key={item.id} className="border-b border-slate-100 dark:border-slate-700/50">
                                        <td className="py-2">{item.code} - {item.name}</td>
                                        <td className="py-2 text-right">{formatCurrency(item.balance)}</td>
                                    </tr>
                                ))}
                                 <tr className="font-semibold bg-slate-50 dark:bg-slate-700/50">
                                    <td className="py-2 px-2">Total de Passivos</td>
                                    <td className="py-2 px-2 text-right">{formatCurrency(reportData.totalLiabilities)}</td>
                                </tr>
                                {reportData.equity.map(item => (
                                     <tr key={item.id} className="border-b border-slate-100 dark:border-slate-700/50">
                                        <td className="py-2">{item.code} - {item.name}</td>
                                        <td className="py-2 text-right">{formatCurrency(item.balance)}</td>
                                    </tr>
                                ))}
                                 <tr className="font-semibold bg-slate-50 dark:bg-slate-700/50">
                                    <td className="py-2 px-2">Total do Patrimônio Líquido</td>
                                    <td className="py-2 px-2 text-right">{formatCurrency(reportData.totalEquity)}</td>
                                </tr>
                            </tbody>
                             <tfoot>
                                <tr className="font-bold bg-slate-50 dark:bg-slate-700/50">
                                    <td className="py-3 px-2">Total Passivo + PL</td>
                                    <td className="py-3 px-2 text-right">{formatCurrency(reportData.totalLiabilities + reportData.totalEquity)}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default BalanceSheetReportPage;