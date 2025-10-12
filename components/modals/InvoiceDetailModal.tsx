import React, { useContext } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Modal from './Modal';
import { Invoice, AppContextType } from '../../types';
import { AppContext } from '../../App';

type jsPDFWithAutoTable = jsPDF & {
  autoTable: (options: any) => jsPDF;
};

interface InvoiceDetailModalProps {
  invoice: Invoice;
  onClose: () => void;
}

const InvoiceDetailModal: React.FC<InvoiceDetailModalProps> = ({ invoice, onClose }) => {
    const context = useContext(AppContext) as AppContextType;
    const { companyConfig } = context;

    const formatCurrency = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    const formatDate = (date: string) => new Date(date).toLocaleDateString('pt-BR', {timeZone: 'UTC'});

    const handlePrint = () => {
        const doc = new jsPDF() as jsPDFWithAutoTable;

        // Header
        doc.setFontSize(20);
        doc.text(companyConfig.name, 14, 22);
        doc.setFontSize(10);
        doc.text(companyConfig.address, 14, 30);
        doc.text(`CNPJ: ${companyConfig.cnpj}`, 14, 35);
        
        doc.setFontSize(16);
        doc.text(`FATURA #${invoice.invoiceNumber}`, 200, 22, { align: 'right' });

        // Client Info
        doc.setFontSize(12);
        doc.text('Cliente:', 14, 50);
        doc.setFontSize(10);
        doc.text(invoice.clientName, 14, 56);
        
        // Dates
        doc.text(`Data de Emissão: ${formatDate(invoice.issueDate)}`, 200, 50, { align: 'right' });
        doc.text(`Data de Vencimento: ${formatDate(invoice.dueDate)}`, 200, 56, { align: 'right' });

        // Table
        const tableColumn = ["Descrição", "Qtd.", "Preço Unit.", "Total"];
        const tableRows = invoice.items.map(item => [
            item.description,
            item.quantity,
            formatCurrency(item.unitPrice),
            formatCurrency(item.total)
        ]);
        
        doc.autoTable({
            startY: 70,
            head: [tableColumn],
            body: tableRows,
            foot: [['', '', 'TOTAL', formatCurrency(invoice.totalValue)]],
            theme: 'striped',
            headStyles: { fillColor: [30, 41, 59] },
            footStyles: { fontStyle: 'bold', fontSize: 12, fillColor: [241, 245, 249], textColor: 20 },
        });

        doc.save(`fatura_${invoice.invoiceNumber}.pdf`);
    };

    return (
        <Modal isOpen={true} onClose={onClose} title={`Fatura #${invoice.invoiceNumber}`}>
            <div id="invoice-content" className="p-4 bg-white text-black">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h2 className="text-xl font-bold">{companyConfig.name}</h2>
                        <p className="text-xs">{companyConfig.address}</p>
                        <p className="text-xs">CNPJ: {companyConfig.cnpj}</p>
                    </div>
                    <div className="text-right">
                        <h3 className="text-lg font-bold">FATURA</h3>
                        <p className="text-sm">#{invoice.invoiceNumber}</p>
                    </div>
                </div>

                <div className="flex justify-between text-sm mb-6">
                    <div>
                        <p className="font-bold">Cliente:</p>
                        <p>{invoice.clientName}</p>
                    </div>
                    <div className="text-right">
                        <p><span className="font-bold">Data de Emissão:</span> {formatDate(invoice.issueDate)}</p>
                        <p><span className="font-bold">Data de Vencimento:</span> {formatDate(invoice.dueDate)}</p>
                    </div>
                </div>

                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-200">
                        <tr>
                            <th className="p-2">Descrição</th>
                            <th className="p-2 text-center">Qtd.</th>
                            <th className="p-2 text-right">Preço Unit.</th>
                            <th className="p-2 text-right">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoice.items.map(item => (
                            <tr key={item.id} className="border-b">
                                <td className="p-2">{item.description}</td>
                                <td className="p-2 text-center">{item.quantity}</td>
                                <td className="p-2 text-right">{formatCurrency(item.unitPrice)}</td>
                                <td className="p-2 text-right">{formatCurrency(item.total)}</td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr className="font-bold">
                            <td colSpan={3} className="p-2 text-right text-lg">TOTAL</td>
                            <td className="p-2 text-right text-lg">{formatCurrency(invoice.totalValue)}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            <div className="mt-6 flex justify-end space-x-2">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-lg">Fechar</button>
                <button onClick={handlePrint} className="px-4 py-2 bg-teal-600 text-white rounded-lg">Imprimir (PDF)</button>
            </div>
        </Modal>
    );
};

export default InvoiceDetailModal;