// FIX: Create missing AccountabilityReportPage.tsx component
import React, { useState, useContext, useMemo } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { AppContext } from '../../../App';
import Header from '../../Header';
import Card from '../../Card';
import { Page } from '../../../types';
import { ArrowDownTrayIcon } from '../../icons';

type jsPDFWithAutoTable = jsPDF & {
  autoTable: (options: any) => jsPDF;
};

const AccountabilityReportPage: React.FC = () => {
    const context = useContext(AppContext);
    const [selectedProjectId, setSelectedProjectId] = useState<string>('');
    if (!context) return null;

    const { projects, accountsPayable, timesheetEntries, personnel, budgetItems, setActivePage } = context;
    const selectedProject = projects.find(p => p.id === selectedProjectId);

    const reportData = useMemo(() => {
        if (!selectedProject) return [];

        const data: { [key: string]: { budgetItemName: string, items: any[] } } = {};

        // Process Accounts Payable
        accountsPayable
            .filter(ap => ap.projectId === selectedProjectId && ap.status === 'Pago' && ap.budgetItemId)
            .forEach(ap => {
                const budgetItem = budgetItems.find(bi => bi.id === ap.budgetItemId);
                const key = budgetItem?.id || 'unknown';
                if (!data[key]) data[key] = { budgetItemName: budgetItem?.name || 'Não Classificado', items: [] };
                data[key].items.push({
                    date: ap.paymentDate,
                    description: ap.description,
                    value: ap.value
                });
            });
        
        // Process Timesheets
        timesheetEntries
            .filter(ts => ts.projectId === selectedProjectId && ts.status === 'Aprovado')
            .forEach(ts => {
                const person = personnel.find(p => p.id === ts.personnelId);
                const cost = (person?.costPerHour || 0) * ts.hours;
                const budgetItem = budgetItems.find(bi => bi.code.includes('3390.36')) || {id: 'personnel', name: 'Custos com Pessoal'}; // Simplification
                const key = budgetItem.id;
                 if (!data[key]) data[key] = { budgetItemName: budgetItem.name, items: [] };
                data[key].items.push({
                    date: ts.date,
                    description: `Apontamento de horas - ${ts.personnelName} (${ts.hours}h)`,
                    value: cost
                });
            });

        return Object.values(data).map(group => ({
            ...group,
            total: group.items.reduce((sum, item) => sum + item.value, 0)
        }));

    }, [selectedProjectId, accountsPayable, timesheetEntries, personnel, budgetItems]);

    const totalSpent = useMemo(() => reportData.reduce((sum, group) => sum + group.total, 0), [reportData]);
    const formatCurrency = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('pt-BR', {timeZone: 'UTC'});

    const handleExportPDF = () => {
        if (!selectedProject) return;
        const doc = new jsPDF() as jsPDFWithAutoTable;
        
        doc.text(`Prestação de Contas - Projeto: ${selectedProject.name}`, 14, 15);
        doc.text(`Período: ${formatDate(selectedProject.startDate)} a ${formatDate(selectedProject.endDate)}`, 14, 22);
        doc.text(`Orçamento Total: ${formatCurrency(selectedProject.budget)}`, 14, 29);

        let startY = 40;
        reportData.forEach(group => {
            const head = [['Data', 'Descrição', 'Valor (R$)']];
            const body = group.items.map(item => [formatDate(item.date), item.description, item.value.toFixed(2)]);
            
            doc.autoTable({
                head: [[{ content: group.budgetItemName, colSpan: 3, styles: { fillColor: [200, 200, 200], textColor: 20 } }]],
                startY: startY,
                theme: 'plain'
            });

            doc.autoTable({
                head: head,
                body: body,
                startY: (doc as any).lastAutoTable.finalY,
                theme: 'striped',
                foot: [['', 'Total da Rubrica', group.total.toFixed(2)]],
                footStyles: { fontStyle: 'bold' }
            });
            startY = (doc as any).lastAutoTable.finalY + 10;
        });
        
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(`Total Geral Gasto: ${formatCurrency(totalSpent)}`, 14, startY);

        doc.save(`prestacao_contas_${selectedProject.name.replace(/\s+/g, '_')}.pdf`);
    };

    return (
        <div className="p-8">
            <Header title="Relatório de Prestação de Contas por Projeto" />
            <div className="mb-4">
                <button onClick={() => setActivePage(Page.Reports)} className="text-sm text-teal-600 hover:text-teal-800 dark:text-teal-400 dark:hover:text-teal-200 font-medium">
                    &larr; Voltar para Relatórios
                </button>
            </div>

            <Card className="mb-6">
                <div className="flex items-end space-x-4">
                    <div className="flex-grow">
                        <label htmlFor="projectFilter" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Selecione o Projeto</label>
                        <select
                            id="projectFilter"
                            value={selectedProjectId}
                            onChange={(e) => setSelectedProjectId(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm bg-white dark:bg-slate-700"
                        >
                            <option value="" disabled>Selecione um projeto para começar</option>
                            {projects.map(project => (
                                <option key={project.id} value={project.id}>{project.name}</option>
                            ))}
                        </select>
                    </div>
                     <button onClick={handleExportPDF} disabled={!selectedProject} className="flex items-center px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                        <ArrowDownTrayIcon className="w-5 h-5 mr-2" />
                        Exportar PDF
                    </button>
                </div>
            </Card>

            {selectedProject && (
                <Card>
                    <div className="mb-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg flex justify-between items-center">
                        <div>
                            <h3 className="font-bold text-lg">{selectedProject.name}</h3>
                            <p className="text-sm text-slate-500">Orçamento: {formatCurrency(selectedProject.budget)}</p>
                        </div>
                         <div className="text-right">
                             <p className="text-sm text-slate-500">Total Gasto</p>
                            <p className="text-xl font-bold">{formatCurrency(totalSpent)}</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {reportData.map((group, index) => (
                            <div key={index}>
                                <h4 className="font-semibold px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-md">{group.budgetItemName}</h4>
                                <table className="min-w-full text-sm mt-2">
                                    <thead>
                                        <tr className="border-b border-slate-200 dark:border-slate-700">
                                            <th className="py-2 text-left font-medium">Data</th>
                                            <th className="py-2 text-left font-medium">Descrição</th>
                                            <th className="py-2 text-right font-medium">Valor</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {group.items.map((item, itemIndex) => (
                                            <tr key={itemIndex} className="border-b border-slate-100 dark:border-slate-700/50">
                                                <td className="py-2">{formatDate(item.date)}</td>
                                                <td className="py-2">{item.description}</td>
                                                <td className="py-2 text-right">{formatCurrency(item.value)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot>
                                        <tr className="font-bold">
                                            <td colSpan={2} className="py-2 text-right">Total da Rubrica:</td>
                                            <td className="py-2 text-right">{formatCurrency(group.total)}</td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        ))}
                    </div>
                </Card>
            )}

        </div>
    );
};

export default AccountabilityReportPage;
