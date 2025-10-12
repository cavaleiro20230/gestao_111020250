import React, { useContext, useMemo } from 'react';
import { AppContext } from '../../App';
import Header from '../Header';
import Card from '../Card';
import { Page, Budget } from '../../types';

const BudgetDetailPage: React.FC = () => {
    const context = useContext(AppContext);
    if (!context) return null;

    const { pageContext, budgets, accountsPayable, materialRequests, setActivePage } = context;
    const budget = budgets.find(b => b.id === pageContext?.budgetId);

    const reportData = useMemo(() => {
        if (!budget) return [];

        return budget.lineItems.map(item => {
            const realizedPayables = accountsPayable
                .filter(ap => ap.budgetItemId === item.budgetItemId && ap.status === 'Pago' && ap.paymentDate && new Date(ap.paymentDate).getFullYear() === budget.year)
                .reduce((sum, ap) => sum + ap.value, 0);
            
            const realizedMaterialRequests = materialRequests
                 .filter(mr => mr.budgetItemId === item.budgetItemId && mr.status === 'Atendida' && new Date(mr.requestDate).getFullYear() === budget.year)
                 .reduce((sum, mr) => sum + mr.items.reduce((itemSum, i) => itemSum + i.price * i.quantity, 0), 0);
            
            const realizedValue = realizedPayables + realizedMaterialRequests;
            const balance = item.projectedValue - realizedValue;
            const execution = item.projectedValue > 0 ? (realizedValue / item.projectedValue) * 100 : 0;

            return {
                ...item,
                realizedValue,
                balance,
                execution,
            };
        }).sort((a,b) => a.budgetItemCode.localeCompare(b.budgetItemCode));

    }, [budget, accountsPayable, materialRequests]);
    
    const totals = useMemo(() => {
        return reportData.reduce((acc, item) => ({
            projected: acc.projected + item.projectedValue,
            realized: acc.realized + item.realizedValue,
            balance: acc.balance + item.balance,
        }), { projected: 0, realized: 0, balance: 0 });
    }, [reportData]);

    if (!budget) {
        return <div className="p-8">Orçamento não encontrado.</div>;
    }

    const formatCurrency = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    const getExecutionBarColor = (percentage: number) => {
        if (percentage > 90) return 'bg-red-500';
        if (percentage > 75) return 'bg-yellow-500';
        return 'bg-teal-500';
    };

    return (
        <div className="p-8">
            <Header title={`Acompanhamento Orçamentário: ${budget.name}`} />
             <div className="mb-4">
                <button onClick={() => setActivePage(Page.Budgeting)} className="text-sm text-teal-600 hover:text-teal-800 dark:text-teal-400 dark:hover:text-teal-200 font-medium">
                    &larr; Voltar para Orçamentos
                </button>
            </div>
            <Card>
                 <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                        <thead className="bg-slate-50 dark:bg-slate-700/50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Rubrica</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Valor Orçado</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Valor Realizado</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Saldo</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider w-1/4">Execução</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                            {reportData.map(item => (
                                <tr key={item.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{item.budgetItemCode} - {item.budgetItemName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">{formatCurrency(item.projectedValue)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">{formatCurrency(item.realizedValue)}</td>
                                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${item.balance < 0 ? 'text-red-500' : ''}`}>{formatCurrency(item.balance)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <div className="flex items-center">
                                            <div className="w-full bg-slate-200 rounded-full h-4 dark:bg-slate-700 mr-2">
                                                <div className={`${getExecutionBarColor(item.execution)} h-4 rounded-full`} style={{width: `${Math.min(item.execution, 100)}%`}}></div>
                                            </div>
                                            <span>{item.execution.toFixed(1)}%</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot className="bg-slate-50 dark:bg-slate-700/50">
                            <tr className="font-bold">
                                <td className="px-6 py-4 text-sm">Total Geral</td>
                                <td className="px-6 py-4 text-sm">{formatCurrency(totals.projected)}</td>
                                <td className="px-6 py-4 text-sm">{formatCurrency(totals.realized)}</td>
                                <td className="px-6 py-4 text-sm">{formatCurrency(totals.balance)}</td>
                                <td className="px-6 py-4 text-sm">
                                    {((totals.realized / totals.projected) * 100).toFixed(1)}%
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default BudgetDetailPage;
