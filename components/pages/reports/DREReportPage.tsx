import React, { useState, useContext, useMemo } from 'react';
import Header from '../../Header';
import Card from '../../Card';
import { AppContext } from '../../../App';
import { Page } from '../../../types';

const DREReportPage: React.FC = () => {
    const context = useContext(AppContext);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    if (!context) return null;

    const { accountsReceivable, accountsPayable, setActivePage } = context;

    const reportData = useMemo(() => {
        const revenues = accountsReceivable
            .filter(ar => ar.status === 'Pago' && ar.paymentDate && new Date(ar.paymentDate).getFullYear() === selectedYear)
            .reduce((sum, ar) => sum + ar.value, 0);

        const expensesByCategory = accountsPayable
            .filter(ap => ap.status === 'Pago' && ap.paymentDate && new Date(ap.paymentDate).getFullYear() === selectedYear)
            .reduce((acc, ap) => {
                const category = ap.category || 'Outras Despesas';
                acc[category] = (acc[category] || 0) + ap.value;
                return acc;
            // FIX: All errors in this file are caused by incorrect type inference in the `reduce` function.
            // By casting the initial value `{}` to `Record<string, number>`, we ensure that `expensesByCategory`
            // and its derived values (`totalExpenses`, `netResult`, and the `value` in the map function)
            // are correctly typed as `number`, resolving all downstream type errors.
            }, {} as Record<string, number>);
        
        const totalExpenses = Object.values(expensesByCategory).reduce((sum, value) => sum + value, 0);
        const netResult = revenues - totalExpenses;

        return {
            revenues,
            expensesByCategory,
            totalExpenses,
            netResult
        };

    }, [accountsReceivable, accountsPayable, selectedYear]);
    
    const availableYears = useMemo(() => {
        const years = new Set<number>();
        [...accountsPayable, ...accountsReceivable].forEach(item => {
            if(item.paymentDate) {
                years.add(new Date(item.paymentDate).getFullYear());
            }
        });
        return Array.from(years).sort((a,b) => b - a);
    }, [accountsPayable, accountsReceivable]);

    const formatCurrency = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    return (
        <div className="p-8">
            <Header title="DRE - Demonstrativo de Resultado" />
            <div className="mb-4">
                <button onClick={() => setActivePage(Page.Reports)} className="text-sm text-teal-600 hover:text-teal-800 dark:text-teal-400 dark:hover:text-teal-200 font-medium">
                    &larr; Voltar para Relatórios
                </button>
            </div>

             <Card className="mb-6">
                <div className="w-full md:w-1/4">
                    <label htmlFor="yearFilter" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Ano</label>
                    <select
                        id="yearFilter"
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                        className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm bg-white dark:bg-slate-700"
                    >
                        {availableYears.map(year => <option key={year} value={year}>{year}</option>)}
                    </select>
                </div>
            </Card>

            <Card>
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <tbody>
                            <tr className="border-b border-slate-200 dark:border-slate-700">
                                <td className="py-3 px-4 font-semibold text-slate-800 dark:text-slate-100">(=) Receita Operacional Bruta</td>
                                <td className="py-3 px-4 text-right font-semibold text-green-600 dark:text-green-400">{formatCurrency(reportData.revenues)}</td>
                            </tr>
                            <tr className="border-b border-slate-200 dark:border-slate-700">
                                <td colSpan={2} className="py-3 px-4 font-semibold text-slate-800 dark:text-slate-100">(-) Despesas Operacionais</td>
                            </tr>
                            {Object.entries(reportData.expensesByCategory).map(([category, value]) => (
                                <tr key={category} className="border-b border-slate-100 dark:border-slate-700/50">
                                    <td className="py-2 px-4 pl-8 text-slate-600 dark:text-slate-300">{category}</td>
                                    <td className="py-2 px-4 text-right text-red-600 dark:text-red-400">({formatCurrency(value)})</td>
                                </tr>
                            ))}
                             <tr className="border-b-2 border-slate-300 dark:border-slate-600">
                                <td className="py-3 px-4 font-semibold text-slate-800 dark:text-slate-100">(=) Total de Despesas</td>
                                <td className="py-3 px-4 text-right font-semibold text-red-600 dark:text-red-400">({formatCurrency(reportData.totalExpenses)})</td>
                            </tr>
                             <tr className="bg-slate-50 dark:bg-slate-700/50">
                                <td className="py-4 px-4 font-bold text-lg text-slate-900 dark:text-white">(=) Resultado Líquido do Período</td>
                                <td className={`py-4 px-4 text-right font-bold text-lg ${reportData.netResult >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                    {formatCurrency(reportData.netResult)}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default DREReportPage;