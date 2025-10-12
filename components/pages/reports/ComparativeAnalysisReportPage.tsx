import React, { useState, useContext } from 'react';
import { AppContext } from '../../../App';
import Header from '../../Header';
import Card from '../../Card';
import { Page, Project, ProjectAnalysisData } from '../../../types';
import { getComparativeProjectAnalysis } from '../../../services/geminiService';
import { SparklesIcon } from '../../icons';

const ComparativeAnalysisReportPage: React.FC = () => {
    const context = useContext(AppContext);
    const [selectedProjectIds, setSelectedProjectIds] = useState<string[]>([]);
    const [question, setQuestion] = useState<string>('');
    const [analysis, setAnalysis] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    if (!context) return null;
    const { projects, accountsPayable, timesheetEntries, personnel, budgetItems, setActivePage } = context;

    const handleProjectToggle = (projectId: string) => {
        setSelectedProjectIds(prev =>
            prev.includes(projectId)
                ? prev.filter(id => id !== projectId)
                : [...prev, projectId]
        );
    };
    
    const handleAnalyze = async () => {
        if (selectedProjectIds.length < 2 || !question.trim()) {
            setError("Por favor, selecione pelo menos dois projetos e faça uma pergunta.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setAnalysis('');

        try {
            const projectsData: ProjectAnalysisData[] = selectedProjectIds.map(projectId => {
                 const project = projects.find(p => p.id === projectId)!;
                 const projectExpenses = accountsPayable.filter(ap => ap.projectId === project.id && ap.status === 'Pago');
                 const projectTimesheets = timesheetEntries.filter(ts => ts.projectId === project.id && ts.status === 'Aprovado');
                 const { personnelCost, totalHours } = projectTimesheets.reduce((acc, ts) => {
                    const person = personnel.find(p => p.id === ts.personnelId);
                    acc.personnelCost += person ? ts.hours * person.costPerHour : 0;
                    acc.totalHours += ts.hours;
                    return acc;
                }, { personnelCost: 0, totalHours: 0 });
                const totalSpent = projectExpenses.reduce((sum, item) => sum + item.value, 0) + personnelCost;
                const daysSinceStart = (new Date().getTime() - new Date(project.startDate).getTime()) / (1000 * 3600 * 24);
                const burnRate = daysSinceStart > 0 ? totalSpent / daysSinceStart : 0;
                
                return { project, totalSpent, personnelCost, totalHours, spentByBudgetItem: [], burnRate, projectedExhaustionDate: '', daysLeftInBudget: 0 };
            });

            const result = await getComparativeProjectAnalysis(projectsData, question);
            setAnalysis(result);

        } catch (e: any) {
            setError(e.message || 'Ocorreu um erro inesperado.');
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div className="p-8">
            <Header title="Análise Comparativa com IA" />
            <div className="mb-4">
                <button onClick={() => setActivePage(Page.Reports)} className="text-sm text-teal-600 hover:text-teal-800 dark:text-teal-400 dark:hover:text-teal-200 font-medium">
                    &larr; Voltar para Relatórios
                </button>
            </div>

            <Card className="mb-6">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">1. Selecione os projetos para comparar (mínimo 2)</label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            {projects.map(project => (
                                <div key={project.id} className="flex items-center p-2 bg-slate-50 dark:bg-slate-700/50 rounded-md">
                                    <input
                                        type="checkbox"
                                        id={`proj-${project.id}`}
                                        checked={selectedProjectIds.includes(project.id)}
                                        onChange={() => handleProjectToggle(project.id)}
                                        className="h-4 w-4 text-teal-600 border-slate-300 rounded focus:ring-teal-500"
                                    />
                                    <label htmlFor={`proj-${project.id}`} className="ml-2 text-sm truncate">{project.name}</label>
                                </div>
                            ))}
                        </div>
                    </div>
                     <div>
                        <label htmlFor="question" className="block text-sm font-medium text-slate-700 dark:text-slate-300">2. Faça sua pergunta</label>
                        <textarea
                            id="question"
                            rows={2}
                            value={question}
                            onChange={e => setQuestion(e.target.value)}
                            placeholder="Ex: Qual projeto tem o maior custo com pessoal? Qual está mais adiantado no cronograma?"
                            className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm bg-white dark:bg-slate-700"
                        />
                    </div>
                     <div className="text-right">
                        <button onClick={handleAnalyze} disabled={isLoading || selectedProjectIds.length < 2 || !question.trim()} className="inline-flex items-center px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors shadow-sm disabled:bg-slate-400 disabled:cursor-not-allowed">
                             <SparklesIcon className="w-5 h-5 mr-2" />
                            {isLoading ? 'Analisando...' : 'Comparar com IA'}
                        </button>
                    </div>
                </div>
            </Card>

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

            {analysis && (
                 <Card>
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">Análise Comparativa:</h3>
                    <div className="prose prose-sm dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 whitespace-pre-wrap">
                        {analysis}
                    </div>
                 </Card>
            )}

        </div>
    );
};

export default ComparativeAnalysisReportPage;