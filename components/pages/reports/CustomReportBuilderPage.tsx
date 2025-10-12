import React, { useContext, useState } from 'react';
import Header from '../../Header';
import Card from '../../Card';
import { AppContext } from '../../../App';
import { Page, CustomReport } from '../../../types';
import ConfirmationModal from '../../modals/ConfirmationModal';

const CustomReportBuilderPage: React.FC = () => {
    const context = useContext(AppContext);
    const [reportToDelete, setReportToDelete] = useState<CustomReport | null>(null);

    if (!context) return null;

    const { customReports, setActivePage, handleDeleteCustomReport } = context;

    return (
        <div className="p-8">
            <Header title="Construtor de Relatórios">
                <button 
                    onClick={() => setActivePage(Page.CustomReportEditor)}
                    className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors shadow-sm"
                >
                    Criar Novo Relatório
                </button>
            </Header>

            <div className="mt-6">
                <h2 className="text-xl font-semibold mb-4">Relatórios Salvos</h2>
                {customReports.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {customReports.map(report => (
                            <Card key={report.id}>
                                <h3 className="font-semibold text-lg">{report.name}</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 h-10">{report.description}</p>
                                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 flex justify-end space-x-2">
                                    <button 
                                        onClick={() => setActivePage(Page.CustomReportViewer, { reportId: report.id })}
                                        className="px-3 py-1 text-sm bg-teal-600 text-white rounded-md hover:bg-teal-700"
                                    >
                                        Visualizar
                                    </button>
                                    <button 
                                        onClick={() => setActivePage(Page.CustomReportEditor, { reportId: report.id })}
                                        className="px-3 py-1 text-sm bg-slate-200 dark:bg-slate-600 rounded-md hover:bg-slate-300"
                                    >
                                        Editar
                                    </button>
                                     <button 
                                        onClick={() => setReportToDelete(report)}
                                        className="px-3 py-1 text-sm bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300 rounded-md hover:bg-red-200"
                                    >
                                        Excluir
                                    </button>
                                </div>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card>
                        <div className="text-center py-12">
                            <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-300">Nenhum relatório personalizado</h2>
                            <p className="text-slate-500 mt-2">Clique em "Criar Novo Relatório" para começar.</p>
                        </div>
                    </Card>
                )}
            </div>
            
            {reportToDelete && (
                <ConfirmationModal
                    isOpen={!!reportToDelete}
                    onClose={() => setReportToDelete(null)}
                    onConfirm={() => {
                        handleDeleteCustomReport(reportToDelete.id);
                        setReportToDelete(null);
                    }}
                    title="Excluir Relatório"
                    message={`Tem certeza que deseja excluir o relatório "${reportToDelete.name}"?`}
                />
            )}
        </div>
    );
};

export default CustomReportBuilderPage;