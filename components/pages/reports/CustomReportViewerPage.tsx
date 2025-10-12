import React, { useContext, useMemo } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Header from '../../Header';
import Card from '../../Card';
import { AppContext } from '../../../App';
import { Page, CustomReport } from '../../../types';
import { ArrowDownTrayIcon } from '../../icons';

type jsPDFWithAutoTable = jsPDF & {
  autoTable: (options: any) => jsPDF;
};

const CustomReportViewerPage: React.FC = () => {
    const context = useContext(AppContext);
    if (!context) return null;

    const { pageContext, customReports, setActivePage, ...data } = context;
    const report: CustomReport | undefined = customReports.find(r => r.id === pageContext?.reportId);

    const reportData = useMemo(() => {
        if (!report || !report.config.dataSource || !data[report.config.dataSource]) return [];
        
        let filteredData = [...data[report.config.dataSource]];

        report.config.filters.forEach(filter => {
            if (!filter.column || !filter.value) return;
            filteredData = filteredData.filter(row => {
                const rowValue = row[filter.column];
                const filterValue = filter.value;
                 switch (filter.operator) {
                    case 'equals': return String(rowValue).toLowerCase() === String(filterValue).toLowerCase();
                    case 'not_equals': return String(rowValue).toLowerCase() !== String(filterValue).toLowerCase();
                    case 'contains': return String(rowValue).toLowerCase().includes(String(filterValue).toLowerCase());
                    case 'greater_than': return Number(rowValue) > Number(filterValue);
                    case 'less_than': return Number(rowValue) < Number(filterValue);
                    default: return true;
                }
            });
        });
        return filteredData;
    }, [report, data]);

    if (!report) {
        return (
            <div className="p-8">
                <Header title="Erro" />
                <Card>
                    <p className="text-center text-red-500">Relatório não encontrado.</p>
                    <div className="text-center mt-4">
                        <button onClick={() => setActivePage(Page.CustomReportBuilder)} className="px-4 py-2 bg-teal-600 text-white rounded-lg">
                            Voltar para o Construtor
                        </button>
                    </div>
                </Card>
            </div>
        );
    }
    
    const headers = report.config.columns;
    
    const handleExportCSV = () => {
        const csvHeaders = headers.join(';');
        const csvRows = reportData.map(row => 
            headers.map(header => `"${row[header]}"`).join(';')
        );
        const csvContent = "\uFEFF" + [csvHeaders, ...csvRows].join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        link.setAttribute("href", URL.createObjectURL(blob));
        link.setAttribute("download", `${report.name.replace(/ /g,"_")}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleExportPDF = () => {
        const doc = new jsPDF() as jsPDFWithAutoTable;
        const tableColumn = headers;
        const tableRows = reportData.map(row => headers.map(header => row[header]));

        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 20,
            headStyles: { fillColor: [13, 148, 136] }, // teal-600
            theme: 'striped',
        });
        doc.text(report.name, 14, 15);
        doc.save(`${report.name.replace(/ /g,"_")}.pdf`);
    };


    return (
        <div className="p-8">
            <Header title={report.name}>
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
            </Header>
            <p className="text-slate-500 mb-4">{report.description}</p>
             <div className="mb-4">
                <button onClick={() => setActivePage(Page.CustomReportBuilder)} className="text-sm text-teal-600 hover:text-teal-800 dark:text-teal-400 dark:hover:text-teal-200 font-medium">
                    &larr; Voltar para o Construtor de Relatórios
                </button>
            </div>
            <Card>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700 text-sm">
                        <thead className="bg-slate-50 dark:bg-slate-700/50">
                            <tr>
                                {headers.map(header => (
                                    <th key={header} className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">{header}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                            {reportData.map((row, index) => (
                                <tr key={index}>
                                    {headers.map(header => (
                                        <td key={header} className="px-6 py-4 whitespace-nowrap">{String(row[header] ?? '')}</td>
                                    ))}
                                </tr>
                            ))}
                            {reportData.length === 0 && (
                                <tr>
                                    <td colSpan={headers.length} className="text-center py-8 text-slate-500">Nenhum dado encontrado.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default CustomReportViewerPage;