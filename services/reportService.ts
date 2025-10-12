import jsPDF from 'jspdf';
import 'jspdf-autotable';
import type { Project } from '../types';

type jsPDFWithAutoTable = jsPDF & {
  autoTable: (options: any) => jsPDF;
};

const formatCurrency = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const formatDate = (dateString?: string) => dateString ? new Date(dateString).toLocaleDateString('pt-BR', {timeZone: 'UTC'}) : 'N/A';

interface ReportData {
    detailedExpenses: { date?: string; description: string; value: number; budgetItemName: string }[];
    detailedPersonnelCosts: { date: string; description: string; value: number; budgetItemName: string }[];
    totalSpent: number;
}

export const generateAccountabilityPDF = (project: Project, data: ReportData) => {
    const doc = new jsPDF() as jsPDFWithAutoTable;
    
    doc.text(`Prestação de Contas - Projeto: ${project.name}`, 14, 15);
    doc.setFontSize(10);
    doc.text(`Período: ${formatDate(project.startDate)} a ${formatDate(project.endDate)}`, 14, 22);
    doc.text(`Orçamento Total: ${formatCurrency(project.budget)}`, 14, 29);

    let startY = 40;

    const allItems = [...data.detailedExpenses, ...data.detailedPersonnelCosts]
        .sort((a,b) => new Date(a.date || 0).getTime() - new Date(b.date || 0).getTime());

    const groupedByBudgetItem = allItems.reduce((acc, item) => {
        const key = item.budgetItemName;
        if (!acc[key]) {
            acc[key] = [];
        }
        acc[key].push(item);
        return acc;
    }, {} as Record<string, typeof allItems>);


    for (const budgetItemName in groupedByBudgetItem) {
        const items = groupedByBudgetItem[budgetItemName];
        const groupTotal = items.reduce((sum, item) => sum + item.value, 0);

        const head = [['Data', 'Descrição', 'Valor (R$)']];
        const body = items.map(item => [formatDate(item.date), item.description, item.value.toFixed(2)]);
        
        doc.autoTable({
            head: [[{ content: budgetItemName, colSpan: 3, styles: { fillColor: [200, 200, 200], textColor: 20 } }]],
            startY: startY,
            theme: 'plain'
        });

        doc.autoTable({
            head: head,
            body: body,
            startY: (doc as any).lastAutoTable.finalY,
            theme: 'striped',
            foot: [['', 'Total da Rubrica', groupTotal.toFixed(2)]],
            footStyles: { fontStyle: 'bold' }
        });
        startY = (doc as any).lastAutoTable.finalY + 10;
    }
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`Total Geral Gasto: ${formatCurrency(data.totalSpent)}`, 14, startY);

    doc.save(`prestacao_contas_${project.name.replace(/\s+/g, '_')}.pdf`);
};
