import React, { useContext, useMemo } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Header from '../../Header';
import Card from '../../Card';
import { AppContext } from '../../../App';
import { Page } from '../../../types';
import { ArrowDownTrayIcon } from '../../icons';

interface CostCenterData {
    name: string;
    receivables: number;
    payables: number;
    balance: number;
}

// FIX: The module augmentation for 'jspdf' was failing. Using a type intersection (`jsPDF & { autoTable: ... }`)
// is a more robust way to add plugin methods to a library's base type locally,
// as it correctly preserves all original methods from `jsPDF`.
type jsPDFWithAutoTable = jsPDF & {
  autoTable: (options: any) => jsPDF;
};

const CostCenterReportPage: React.FC = () => {
    const context = useContext(AppContext);
    if (!context) return null;

    const { accountsReceivable, accountsPayable, setActivePage } = context;

    const reportData = useMemo<CostCenterData[]>(() => {
        const groupedData: { [key: string]: { receivables: number; payables: number } } = {};

        accountsReceivable.forEach(ar => {
            const cc = ar.costCenter || 'Não Classificado';
            if (!groupedData[cc]) groupedData[cc] = { receivables: 0, payables: 0 };
            groupedData[cc].receivables += ar.value;
        });

        accountsPayable.forEach(ap => {
            const cc = ap.costCenter || 'Não Classificado';
            if (!groupedData[cc]) groupedData[cc] = { receivables: 0, payables: 0 };
            groupedData[cc].payables += ap.value;
        });

        return Object.entries(groupedData).map(([name, data]) => ({
            name,
            ...data,
            balance: data.receivables - data.payables,
        })).sort((a, b) => b.balance - a.balance);

    }, [accountsReceivable, accountsPayable]);

    const formatCurrency = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    const totals = useMemo(() => {
        return reportData.reduce((acc, item) => ({
            receivables: acc.receivables + item.receivables,
            payables: acc.payables + item.payables,
            balance: acc.balance + item.balance,
        }), { receivables: 0, payables: 0, balance: 0 });
    }, [reportData]);
    
    const handleExportCSV = () => {
        const headers = ['Centro de Custo', 'Total de Receitas (Créditos)', 'Total de Despesas (Débitos)', 'Saldo'];
        const rows = reportData.map(item => [
            `"${item.name}"`,
            item.receivables.toFixed(2).replace('.',','),
            item.payables.toFixed(2).replace('.',','),
            item.balance.toFixed(2).replace('.',',')
        ].join(';'));
        const totalsRow = [
            '"Total Geral"',
            totals.receivables.toFixed(2).replace('.',','),
            totals.payables.toFixed(2).replace('.',','),
            totals.balance.toFixed(2).replace('.',',')
        ].join(';');

        const csvContent = "\uFEFF" + headers.join(';') + "\n" + rows.join("\n") + "\n" + totalsRow;
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "relatorio_centro_de_custo.csv");
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleExportPDF = () => {
        // FIX: Casting the new jsPDF instance to our extended type `jsPDFWithAutoTable`
        // allows TypeScript to recognize the `autoTable` method.
        const doc = new jsPDF() as jsPDFWithAutoTable;
        const tableColumn = ["Centro de Custo", "Receitas", "Despesas", "Saldo"];
        const tableRows: any[][] = [];

        reportData.forEach(item => {
            const rowData = [
                item.name,
                formatCurrency(item.receivables),
                formatCurrency(item.payables),
                formatCurrency(item.balance)
            ];
            tableRows.push(rowData);
        });

        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            foot: [[
                'Total Geral',
                formatCurrency(totals.receivables),
                formatCurrency(totals.payables),
                formatCurrency(totals.balance)
            ]],
            startY: 20,
            headStyles: { fillColor: [13, 148, 136] }, // teal-600
            footStyles: { fillColor: [241, 245, 249] , textColor: [15, 23, 42], fontStyle: 'bold' }, // slate-100, slate-900
            theme: 'striped',
        });

        doc.text("Relatório por Centro de Custo", 14, 15);
        doc.save("relatorio_centro_de_custo.pdf");
    };


    return (
        <div className="p-8">
            <Header title="Relatório por Centro de Custo" />
            <div className="flex justify-between items-center mb-4">
                <button onClick={() => setActivePage(Page.Reports)} className="text-sm text-teal-600 hover:text-teal-800 dark:text-teal-400 dark:hover:text-teal-200 font-medium">
                    &larr; Voltar para Relatórios
                </button>
                 <div className="flex space-x-2">
                    <button onClick={handleExportCSV} className="flex items-center px-3 py-1.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-sm rounded-md font-medium transition-colors">
                        <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
                        Exportar CSV
                    </button>
                    <button onClick={handleExportPDF} className="flex items-center px-3 py-1.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-sm rounded-md font-medium transition-colors">
                        <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
                        Exportar PDF
                    </button>
                </div>
            </div>
            <Card>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                        <thead className="bg-slate-50 dark:bg-slate-700/50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Centro de Custo</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Total de Receitas (Créditos)</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Total de Despesas (Débitos)</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Saldo</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                            {reportData.map(({ name, receivables, payables, balance }) => (
                                <tr key={name}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-white">{name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 dark:text-green-400">{formatCurrency(receivables)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 dark:text-red-400">{formatCurrency(payables)}</td>
                                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-bold ${balance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                        {formatCurrency(balance)}
                                    </td>
                                </tr>
                            ))}
                            {reportData.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="text-center py-8 text-slate-500 dark:text-slate-400">
                                        Nenhum lançamento com centro de custo encontrado.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                         <tfoot className="bg-slate-50 dark:bg-slate-700/50">
                            <tr className="font-bold">
                                <td className="px-6 py-4 text-sm">Total Geral</td>
                                <td className="px-6 py-4 text-sm text-green-600 dark:text-green-400">{formatCurrency(totals.receivables)}</td>
                                <td className="px-6 py-4 text-sm text-red-600 dark:text-red-400">{formatCurrency(totals.payables)}</td>
                                <td className={`px-6 py-4 text-sm ${totals.balance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                    {formatCurrency(totals.balance)}
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default CostCenterReportPage;
