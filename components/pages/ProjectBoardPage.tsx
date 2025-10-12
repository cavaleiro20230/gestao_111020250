import React, { useState, useContext } from 'react';
import { AppContext, AuthContext } from '../../App';
import Header from '../Header';
import { Page } from '../../types';
import Card from '../Card';
import ProjectOverviewTab from './projects/ProjectOverviewTab';
import ProjectKanbanTab from './projects/ProjectKanbanTab';
import ProjectDeliverablesTab from './projects/ProjectDeliverablesTab';
import ProjectGanttTab from './projects/ProjectGanttTab';
import { Bars4Icon } from '../icons';

type Tab = 'overview' | 'tasks' | 'deliverables' | 'gantt';

const ProjectBoardPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<Tab>('overview');
    const context = useContext(AppContext);
    
    if (!context) return null;

    const { projects, pageContext, setActivePage } = context;
    const projectId = pageContext?.projectId;
    const project = projects.find(p => p.id === projectId);

    if (!project) {
        return (
            <div className="p-8 text-center">
                <h2 className="text-xl font-semibold">Projeto não encontrado</h2>
                <button onClick={() => setActivePage(Page.Projects)} className="mt-4 px-4 py-2 bg-teal-600 text-white rounded-lg">Voltar para Projetos</button>
            </div>
        );
    }
    
    const tabs: { id: Tab, label: string }[] = [
        { id: 'overview', label: 'Visão Geral' },
        { id: 'tasks', label: 'Tarefas (Kanban)' },
        { id: 'deliverables', label: 'Entregas (EAP)' },
        { id: 'gantt', label: 'Cronograma (Gantt)' },
    ];
    
    const renderTabContent = () => {
        switch(activeTab) {
            case 'overview': return <ProjectOverviewTab project={project} />;
            case 'tasks': return <ProjectKanbanTab project={project} />;
            case 'deliverables': return <ProjectDeliverablesTab project={project} />;
            case 'gantt': return <ProjectGanttTab project={project} />;
            default: return null;
        }
    };


    return (
        <div className="p-8">
            <Header title={project.name} />
             <div className="mb-4">
                <button onClick={() => setActivePage(Page.Projects)} className="text-sm text-teal-600 hover:text-teal-800 dark:text-teal-400 dark:hover:text-teal-200 font-medium">
                    &larr; Voltar para a lista de projetos
                </button>
            </div>
             <Card>
                <div className="border-b border-slate-200 dark:border-slate-700">
                <nav className="-mb-px flex space-x-6 overflow-x-auto" aria-label="Tabs">
                    {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`${
                        activeTab === tab.id
                            ? 'border-teal-500 text-teal-600 dark:border-teal-400 dark:text-teal-400'
                            : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:border-slate-500'
                        } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                    >
                        {tab.label}
                    </button>
                    ))}
                </nav>
                </div>
                <div className="mt-6">
                    {renderTabContent()}
                </div>
            </Card>
        </div>
    );
};

export default ProjectBoardPage;