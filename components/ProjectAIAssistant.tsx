import React, { useState, useCallback, useContext } from 'react';
import { getProjectAnalysis } from '../services/geminiService';
import type { Project, ProjectAnalysisData } from '../types';
import { AppContext } from '../App';
import Card from './Card';
import { SparklesIcon } from './icons';

interface ProjectAIAssistantProps {
    project: Project;
}

const ProjectAIAssistant: React.FC<ProjectAIAssistantProps> = ({ project }) => {
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
            const { accountsPayable, timesheetEntries, personnel, budgetItems } = context;
            
            const projectExpenses = accountsPayable
                .filter(ap => ap.projectId === project.id && ap.status === 'Pago');

            const projectTimesheets = timesheetEntries.filter(ts => ts.projectId === project.id && ts.status === 'Aprovado');
            
            const { personnelCost, totalHours } = projectTimesheets.reduce((acc, ts) => {
                const person = personnel.find(p => p.id === ts.personnelId);
                acc.personnelCost += person ? ts.hours * person.costPerHour : 0;
                acc.totalHours += ts.hours;
                return acc;
            }, { personnelCost: 0, totalHours: 0 });
            
            const totalSpent = projectExpenses.reduce((sum, item) => sum + item.value, 0) + personnelCost;

            const spentByBudgetItemMap = [...projectExpenses, ...projectTimesheets.map(ts => ({...ts, value: (personnel.find(p=>p.id === ts.personnelId)?.costPerHour || 0) * ts.hours, budgetItemId: 'personnel-cost'}))]
                .reduce((acc, item) => {
                    if(!item.budgetItemId) return acc;
                    const budgetItemName = item.budgetItemId === 'personnel-cost' ? 'Custos com Pessoal' : (budgetItems.find(bi => bi.id === item.budgetItemId)?.name || 'Outros');
                    acc[budgetItemName] = (acc[budgetItemName] || 0) + item.value;
                    return acc;
                }, {} as { [key: string]: number });

            // FIX: Cast the value to `number` to address a type inference issue where it was treated as `unknown`.
            const spentByBudgetItem = Object.entries(spentByBudgetItemMap).map(([name, value]) => ({ name, value: value as number }));
            
            // Predictive Analysis
            const daysSinceStart = (new Date().getTime() - new Date(project.startDate).getTime()) / (1000 * 3600 * 24);
            const burnRate = daysSinceStart > 0 ? totalSpent / daysSinceStart : 0;
            const remainingBudget = project.budget - totalSpent;
            const daysLeftInBudget = burnRate > 0 ? remainingBudget / burnRate : Infinity;
            const projectedExhaustionDate = new Date();
            projectedExhaustionDate.setDate(projectedExhaustionDate.getDate() + daysLeftInBudget);

            const analysisData: ProjectAnalysisData = {
                project,
                totalSpent,
                personnelCost,
                totalHours,
                spentByBudgetItem,
                burnRate,
                projectedExhaustionDate: daysLeftInBudget === Infinity ? 'N/A' : projectedExhaustionDate.toISOString(),
                daysLeftInBudget,
            };

            const result = await getProjectAnalysis(analysisData);
            setInsights(result);
        } catch (e: any) {
            setError(e.message || 'Ocorreu um erro inesperado.');
        } finally {
            setIsLoading(false);
        }
    }, [project, context]);
    
    return (
        <Card>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Assistente de IA do Projeto</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Obtenha uma análise estratégica e preditiva sobre o andamento e a saúde financeira deste projeto.</p>
                </div>
                <button
                    onClick={handleGetAnalysis}
                    disabled={isLoading}
                    className="mt-4 md:mt-0 flex items-center justify-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed shadow-sm"
                >
                    <SparklesIcon className="w-5 h-5 mr-2" />
                    {isLoading ? 'Analisando...' : 'Analisar com IA'}
                </button>
            </div>
            
            {isLoading && (
                 <div className="mt-4 p-4 text-center text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700/50 rounded-lg">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500 mx-auto"></div>
                    <p className="mt-2">Consolidando dados do projeto e consultando Gemini...</p>
                 </div>
            )}
            
            {error && (
                <div className="mt-4 p-4 text-red-700 bg-red-100 dark:bg-red-900/50 dark:text-red-300 rounded-lg">
                    <strong>Erro:</strong> {error}
                </div>
            )}

            {insights && (
                 <div className="mt-4 p-4 bg-slate-100 dark:bg-slate-700/50 rounded-lg">
                    <h4 className="font-semibold text-slate-800 dark:text-white mb-2">Análise Estratégica do Projeto:</h4>
                    <div className="prose prose-sm dark:prose-invert text-slate-600 dark:text-slate-300 whitespace-pre-wrap">
                        {insights}
                    </div>
                 </div>
            )}
        </Card>
    );
};

export default ProjectAIAssistant;