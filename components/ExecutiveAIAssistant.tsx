import React, { useState, useCallback, useContext, useMemo } from 'react';
import { getExecutiveSummary } from '../services/geminiService';
import type { ExecutiveSummaryData } from '../types';
import { AppContext } from '../App';
import Card from './Card';
import { SparklesIcon } from './icons';

const ExecutiveAIAssistant: React.FC = () => {
    const [insights, setInsights] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const context = useContext(AppContext);

    const handleGetAnalysis = useCallback(async () => {
        if (!context) return;
        setIsLoading(true);
        setError(null);
        setInsights('');

        try {
            const { projects, accountsPayable, timesheetEntries, personnel, fundingSources } = context;

            const sixMonthsAgo = new Date();
            sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

            const recentPayables = accountsPayable.filter(a => a.status === 'Pago' && a.paymentDate && new Date(a.paymentDate) >= sixMonthsAgo);
            const totalExpenses = recentPayables.reduce((sum, a) => sum + a.value, 0);
            const totalRevenue = 250000; // Simplified for demo

            const projectsAtRisk = projects.filter(p => {
                 const spent = accountsPayable.filter(a => a.projectId === p.id && a.status === 'Pago').reduce((s, a) => s + a.value, 0);
                 return p.budget > 0 && (spent / p.budget) > 0.8;
            }).map(p => ({ name: p.name, reason: `execução orçamentária em ${(p.budget > 0 ? (accountsPayable.filter(a => a.projectId === p.id).reduce((s, a) => s + a.value, 0) / p.budget) * 100 : 0).toFixed(0)}%` }));

            const fundingDistribution = recentPayables.reduce((acc, ap) => {
                const proj = projects.find(p => p.id === ap.projectId);
                const fundingSrcId = proj ? 'fs-1' : 'fs-3'; // Simplified
                const fundingSrcName = fundingSources.find(f => f.id === fundingSrcId)?.name || 'N/A';
                acc[fundingSrcName] = (acc[fundingSrcName] || 0) + ap.value;
                return acc;
            }, {} as Record<string, number>);

            const monthlyPerformance = Array.from({length: 6}, (_, i) => {
                const d = new Date();
                d.setMonth(d.getMonth() - i);
                return { name: d.toLocaleString('default', {month: 'short'}), revenue: 0, expenses: 0};
            }).reverse();


            const executiveData: ExecutiveSummaryData = {
                totalRevenue,
                totalExpenses,
                projectsAtRisk,
                // FIX: Cast the value to `number` to address a type inference issue where it was treated as `unknown`.
                fundingDistribution: Object.entries(fundingDistribution).map(([name, value]) => ({name, value: value as number})),
                monthlyPerformance,
            };

            const result = await getExecutiveSummary(executiveData);
            setInsights(result);
        } catch (e: any) {
            setError(e.message || 'Ocorreu um erro inesperado.');
        } finally {
            setIsLoading(false);
        }
    }, [context]);
    
    return (
        <Card>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Resumo Executivo com IA</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Obtenha um resumo estratégico da saúde financeira e operacional da fundação.</p>
                </div>
                <button
                    onClick={handleGetAnalysis}
                    disabled={isLoading}
                    className="mt-4 md:mt-0 flex items-center justify-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed shadow-sm"
                >
                    <SparklesIcon className="w-5 h-5 mr-2" />
                    {isLoading ? 'Analisando...' : 'Gerar Resumo'}
                </button>
            </div>
            
            {isLoading && (
                 <div className="mt-4 p-4 text-center text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700/50 rounded-lg">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500 mx-auto"></div>
                    <p className="mt-2">Consolidando dados e consultando Gemini...</p>
                 </div>
            )}
            
            {error && (
                <div className="mt-4 p-4 text-red-700 bg-red-100 dark:bg-red-900/50 dark:text-red-300 rounded-lg">
                    <strong>Erro:</strong> {error}
                </div>
            )}

            {insights && (
                 <div className="mt-4 p-4 bg-slate-100 dark:bg-slate-700/50 rounded-lg">
                    <div className="prose prose-sm dark:prose-invert text-slate-600 dark:text-slate-300 whitespace-pre-wrap">
                        {insights}
                    </div>
                 </div>
            )}
        </Card>
    );
};

export default ExecutiveAIAssistant;