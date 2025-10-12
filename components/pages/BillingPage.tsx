import React, { useState, useContext, useMemo } from 'react';
import Header from '../Header';
import Card from '../Card';
import { AppContext } from '../../App';
import { SalesOrder, Invoice } from '../../types';
import ConfirmationModal from '../modals/ConfirmationModal';
import InvoiceDetailModal from '../modals/InvoiceDetailModal';

type Tab = 'to-invoice' | 'invoices';

const BillingPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<Tab>('to-invoice');
    const [invoiceToUpdate, setInvoiceToUpdate] = useState<{ invoice: Invoice; status: Invoice['status'] } | null>(null);
    const [invoiceToView, setInvoiceToView] = useState<Invoice | null>(null);
    
    const context = useContext(AppContext);
    if (!context) return null;

    const { salesOrders, invoices, handleGenerateInvoiceFromSalesOrder, handleUpdateInvoiceStatus } = context;

    const ordersToInvoice = useMemo(() => {
        return salesOrders.filter(o => o.status === 'Pedido');
    }, [salesOrders]);

    const formatCurrency = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    const formatDate = (date: string) => new Date(date).toLocaleDateString('pt-BR', {timeZone: 'UTC'});

    const getStatusClass = (status: Invoice['status']) => {
        switch (status) {
            case 'Paga': return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
            case 'Pendente': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
            case 'Vencida': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300';
            case 'Cancelada': return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
            default: return '';
        }
    };

    const handleConfirmUpdate = () => {
        if (invoiceToUpdate) {
            handleUpdateInvoiceStatus(invoiceToUpdate.invoice.id, invoiceToUpdate.status);
            setInvoiceToUpdate(null);
        }
    };

    const tabs: { id: Tab; label: string }[] = [
        { id: 'to-invoice', label: 'A Faturar' },
        { id: 'invoices', label: 'Faturas Emitidas' },
    ];

    return (
        <div className="p-8">
            <Header title="Faturamento" />
            <Card>
                <div className="border-b border-slate-200 dark:border-slate-700">
                    <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`${
                                    activeTab === tab.id
                                    ? 'border-teal-500 text-teal-600 dark:border-teal-400 dark:text-teal-400'
                                    : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 hover:text-slate-300'
                                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="mt-6">
                    {activeTab === 'to-invoice' && (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                                <thead className="bg-slate-50 dark:bg-slate-700/50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium">Ordem de Venda</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium">Cliente</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium">Data</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium">Valor</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium">Ação</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                                    {ordersToInvoice.map(order => (
                                        <tr key={order.id}>
                                            <td className="px-6 py-4 font-semibold">#{order.orderNumber}</td>
                                            <td className="px-6 py-4">{order.clientName}</td>
                                            <td className="px-6 py-4">{formatDate(order.orderDate)}</td>
                                            <td className="px-6 py-4">{formatCurrency(order.totalValue)}</td>
                                            <td className="px-6 py-4 text-right">
                                                <button onClick={() => handleGenerateInvoiceFromSalesOrder(order.id)} className="px-3 py-1.5 bg-teal-600 text-white text-sm rounded-md hover:bg-teal-700">
                                                    Gerar Fatura
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {ordersToInvoice.length === 0 && (
                                        <tr><td colSpan={5} className="text-center py-10 text-slate-500">Nenhuma ordem de venda pendente de faturamento.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                    {activeTab === 'invoices' && (
                         <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                                <thead className="bg-slate-50 dark:bg-slate-700/50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium">Fatura</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium">Cliente</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium">Emissão</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium">Vencimento</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium">Valor</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium">Status</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium">Ações</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                                    {invoices.map(inv => (
                                        <tr key={inv.id}>
                                            <td className="px-6 py-4 font-semibold">#{inv.invoiceNumber}</td>
                                            <td className="px-6 py-4">{inv.clientName}</td>
                                            <td className="px-6 py-4">{formatDate(inv.issueDate)}</td>
                                            <td className="px-6 py-4">{formatDate(inv.dueDate)}</td>
                                            <td className="px-6 py-4">{formatCurrency(inv.totalValue)}</td>
                                            <td className="px-6 py-4"><span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(inv.status)}`}>{inv.status}</span></td>
                                            <td className="px-6 py-4 text-right text-sm space-x-2">
                                                <button onClick={() => setInvoiceToView(inv)} className="font-medium text-teal-600 hover:text-teal-800">Detalhes</button>
                                                {inv.status === 'Pendente' && <button onClick={() => setInvoiceToUpdate({invoice: inv, status: 'Paga'})} className="font-medium text-green-600 hover:text-green-800">Marcar Paga</button>}
                                                {inv.status !== 'Cancelada' && inv.status !== 'Paga' && <button onClick={() => setInvoiceToUpdate({invoice: inv, status: 'Cancelada'})} className="font-medium text-red-600 hover:text-red-800">Cancelar</button>}
                                            </td>
                                        </tr>
                                    ))}
                                     {invoices.length === 0 && (
                                        <tr><td colSpan={7} className="text-center py-10 text-slate-500">Nenhuma fatura emitida.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </Card>

            {invoiceToUpdate && (
                <ConfirmationModal
                    isOpen={!!invoiceToUpdate}
                    onClose={() => setInvoiceToUpdate(null)}
                    onConfirm={handleConfirmUpdate}
                    title={`Confirmar alteração de Status`}
                    message={`Tem certeza que deseja marcar a fatura #${invoiceToUpdate.invoice.invoiceNumber} como "${invoiceToUpdate.status}"?`}
                />
            )}

            {invoiceToView && (
                <InvoiceDetailModal invoice={invoiceToView} onClose={() => setInvoiceToView(null)} />
            )}
        </div>
    );
};

export default BillingPage;