// FIX: Replaced corrupted file content with the correct component code.
import React, { useContext } from 'react';
import Header from '../../Header';
import Card from '../../Card';
import { AppContext } from '../../../App';
import { Page } from '../../../types';
import { DocumentTextIcon, SparklesIcon } from '../../icons';

const ReportsPage: React.FC = () => {
    const context = useContext(AppContext);
    if (!context) return null;

    const { setActivePage } = context;

    const reports = [
        { page: Page.CashFlowReport, title: 'Fluxo de Caixa', description: 'Analise as entradas e saídas de caixa em um período.' },
        { page: Page.DREReport, title: 'DRE Gerencial', description: 'Demonstrativo de resultado do exercício.' },
        { page: Page.CostCenterReport, title: 'Resultado por Centro de Custo', description: 'Visualize receitas e despesas agrupadas por centro de custo.' },
        { page: Page.ContractsReport, title: 'Relatório de Contratos', description: 'Acompanhe o status e valores dos contratos ativos.' },
        { page: Page.AccountabilityReport, title: 'Prestação de Contas por Projeto', description: 'Gere o relatório detalhado de despesas para um projeto específico.' },
        { page: Page.BalanceSheetReport, title: 'Balanço Patrimonial', description: 'Visualize a posição de ativos, passivos e patrimônio líquido.' },
    ];

    return (
        <div className="p-8">
            <Header title="Central de Relatórios" />

            <Card className="mb-6 bg-teal-50 dark:bg-teal-900/20 border-teal-200 dark:border-teal-800">
                 <div className="flex items-center">
                    <SparklesIcon className="w-8 h-8 mr-4 text-teal-500"/>
                    <div>
                        <h3 className="font-semibold text-lg">Análise Comparativa com IA</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-300">Compare o desempenho de múltiplos projetos e obtenha insights com a ajuda da IA Gemini.</p>
                    </div>
                    <button onClick={() => setActivePage(Page.ComparativeAnalysisReport)} className="ml-auto px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700">
                        Analisar
                    </button>
                 </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reports.map(report => (
                    <Card 
                        key={report.page} 
                        className="hover:shadow-lg transition-shadow cursor-pointer flex flex-col"
                        onClick={() => setActivePage(report.page)}
                    >
                        <DocumentTextIcon className="w-6 h-6 mb-2 text-teal-600 dark:text-teal-400"/>
                        <h3 className="font-semibold text-lg">{report.title}</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 flex-grow">{report.description}</p>
                    </Card>
                ))}
                 <Card 
                    className="hover:shadow-lg transition-shadow cursor-pointer flex flex-col"
                    onClick={() => setActivePage(Page.CustomReportBuilder)}
                >
                    <DocumentTextIcon className="w-6 h-6 mb-2 text-sky-600 dark:text-sky-400"/>
                    <h3 className="font-semibold text-lg">Construtor de Relatórios</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 flex-grow">Crie seus próprios relatórios personalizados a partir dos dados do sistema.</p>
                </Card>
            </div>
        </div>
    );
};

export default ReportsPage;