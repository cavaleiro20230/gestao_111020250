import React, { useState, useContext, useMemo } from 'react';
import { AppContext, AuthContext } from '../../App';
import Card from '../Card';
import useAccountabilityData from '../../hooks/useAccountabilityData';
import { generateAccountabilityPDF } from '../../services/reportService';
import ProjectRiskAnalysis from '../ProjectRiskAnalysis';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { ArrowLeftOnRectangleIcon } from '../icons';

const COLORS = ['#0d9488', '#0ea5e9', '#f97316', '#8b5cf6', '#ec4899', '#f43f5e', '#84cc16'];

const FunderPortalPage: React.FC = () => {
    const appContext = useContext(AppContext);
    const authContext = useContext(AuthContext);
    const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

    if (!appContext || !authContext || !authContext.user) {
        return <div className="p-8">Carregando...</div>;
    }

    const { user, logout } = authContext;
    const { projects, documents } = appContext;

    const funderProjects = useMemo(() => {
        return projects.filter(p => p.clientId === user.clientId);
    }, [projects, user.clientId]);

    // Auto-select the first project
    if (!selectedProjectId && funderProjects.length > 0) {
        setSelectedProjectId(funderProjects[0].id);
    }
    
    const selectedProject = useMemo(() => {
        return projects.find(p => p.id === selectedProjectId);
    }, [projects, selectedProjectId]);

    const projectData = useAccountabilityData(selectedProject || null);
    
    const communicationLog = useMemo(() => {
        return documents.find(d => d.projectId === selectedProjectId && d.type === 'communication_log');
    }, [documents, selectedProjectId]);
    
    const formatCurrency = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    const formatDate = (dateString?: string) => dateString ? new Date(dateString).toLocaleDateString('pt-BR', {timeZone: 'UTC'}) : 'N/A';

    return (
        <div className="flex h-screen bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
            {/* Sidebar */}
            <aside className="w-64 bg-white dark:bg-slate-800 p-4 border-r border-slate-200 dark:border-slate-700 flex flex-col">
                 <h1 className="text-2xl font-bold text-teal-600 dark:text-teal-400 mb-6">Portal de Transparência da FEMAR</h1>
                 <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Seus Projetos</h2>
                 <nav className="flex-1 space-y-2">
                     {funderProjects.map(p => (
                         <button
                             key={p.id}
                             onClick={() => setSelectedProjectId(p.id)}
                             className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${selectedProjectId === p.id ? 'bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300' : 'hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                         >
                             {p.name}
                         </button>
                     ))}
                 </nav>
                 <div>
                    <div className="text-xs text-slate-400 mb-2">Logado como: {user.name}</div>
                    <button
                        onClick={logout}
                        className="w-full flex items-center justify-center px-3 py-2 rounded-md text-sm font-medium transition-colors bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600"
                    >
                        <ArrowLeftOnRectangleIcon className="w-5 h-5 mr-2" />
                        Sair
                    </button>
                 </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-8">
                {!selectedProject ? (
                     <div className="text-center py-20">
                        <h2 className="text-2xl font-semibold">Bem-vindo(a)</h2>
                        <p className="text-slate-500 mt-2">Selecione um projeto na barra lateral para ver os detalhes.</p>
                    </div>
                ) : (
                    <div>
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="text-3xl font-bold">{selectedProject.name}</h2>
                                <p className="text-slate-500">{selectedProject.clientName}</p>
                            </div>
                            <button
                                onClick={() => generateAccountabilityPDF(selectedProject, projectData)}
                                className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors shadow-sm"
                            >
                                Baixar Prestação de Contas
                            </button>
                        </div>
                        
                        {/* KPIs */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                            <Card><p className="text-sm text-slate-500">Execução Orçamentária</p><p className="text-2xl font-semibold">{projectData.budgetExecution.toFixed(1)}%</p></Card>
                            <Card><p className="text-sm text-slate-500">Progresso do Cronograma</p><p className="text-2xl font-semibold">{projectData.timeExecution.toFixed(1)}%</p></Card>
                            <Card><p className="text-sm text-slate-500">Próxima Entrega</p><p className="text-xl font-semibold truncate">{projectData.nextDeliverable ? `${projectData.nextDeliverable.name} (${formatDate(projectData.nextDeliverable.dueDate)})` : 'N/A'}</p></Card>
                        </div>

                        {/* Analysis and Details */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                            <div className="lg:col-span-2 space-y-6">
                                <ProjectRiskAnalysis project={selectedProject} />
                                <Card>
                                    <h3 className="font-semibold mb-2">Entregas Principais (EAP)</h3>
                                    <ul className="space-y-2 text-sm">
                                        {appContext.projectDeliverables.filter(d => d.projectId === selectedProject.id).map(d => (
                                            <li key={d.id} className="flex justify-between p-2 bg-slate-50 dark:bg-slate-800/50 rounded-md">
                                                <span>{d.name}</span>
                                                <span className="font-medium">{formatDate(d.dueDate)}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </Card>
                            </div>
                            <Card>
                                <h3 className="font-semibold mb-4 text-center">Distribuição de Despesas</h3>
                                <ResponsiveContainer width="100%" height={250}>
                                    <PieChart>
                                        <Pie data={projectData.expensesByCategory} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                                            {projectData.expensesByCategory.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                        </Pie>
                                        <Tooltip formatter={(value) => formatCurrency(value as number)} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </Card>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Card>
                                 <h3 className="font-semibold mb-2">Extrato Financeiro Detalhado</h3>
                                 <div className="max-h-80 overflow-y-auto">
                                    <table className="w-full text-sm">
                                        <tbody>
                                        {[...projectData.detailedExpenses, ...projectData.detailedPersonnelCosts].sort((a,b) => new Date(a.date||0).getTime() - new Date(b.date||0).getTime()).map((item, index) => (
                                            <tr key={index} className="border-b border-slate-100 dark:border-slate-700/50">
                                                <td className="py-2">{formatDate(item.date)}</td>
                                                <td className="py-2">{item.description}</td>
                                                <td className="py-2 text-right font-mono">{formatCurrency(item.value)}</td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                 </div>
                            </Card>
                             <Card>
                                <h3 className="font-semibold mb-2">Diário de Bordo</h3>
                                {communicationLog ? (
                                    <pre className="p-2 bg-slate-50 dark:bg-slate-700/50 rounded-md text-xs whitespace-pre-wrap font-sans max-h-80 overflow-y-auto">{communicationLog.content}</pre>
                                ) : <p className="text-sm text-slate-500">Nenhum registro de comunicação encontrado.</p>}
                            </Card>
                        </div>

                    </div>
                )}
            </main>
        </div>
    );
};

export default FunderPortalPage;
