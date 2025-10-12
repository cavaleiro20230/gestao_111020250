import React, { useState, useContext } from 'react';
import { AppContext } from '../../../App';
import type { PurchaseOrder } from '../../../types';
import TableControls from '../../TableControls';
import PurchaseOrderModal from '../../modals/PurchaseOrderModal';
import ConfirmationModal from '../../modals/ConfirmationModal';

const PurchaseOrdersTab: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<PurchaseOrder | null>(null);
    const [orderToDelete, setOrderToDelete] = useState<PurchaseOrder | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    
    const context = useContext(AppContext);
    if (!context) return null;

    const { purchaseOrders, suppliers, products, handleSavePurchaseOrder, handleDeletePurchaseOrder } = context;

    const openModal = (order: PurchaseOrder | null = null) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setSelectedOrder(null);
        setIsModalOpen(false);
    };

    const filteredOrders = purchaseOrders.filter(o => 
        o.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(o.orderNumber).includes(searchTerm)
    ).sort((a,b) => b.orderNumber - a.orderNumber);

    const formatCurrency = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    const getStatusClass = (status: PurchaseOrder['status']) => {
        switch (status) {
            case 'Recebido Total': return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
            case 'Recebido Parcial': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300';
            case 'Pendente': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
            case 'Cancelado': return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
            default: return '';
        }
    };

    return (
        <div>
            <TableControls 
                onAdd={() => openModal()}
                addLabel="Nova Ordem de Compra"
                onSearch={setSearchTerm}
            />
            <div className="overflow-x-auto mt-4">
                <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                    <thead className="bg-slate-50 dark:bg-slate-700/50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Nº Ordem</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Fornecedor</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Data</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Valor Total</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                        {filteredOrders.map(order => (
                            <tr key={order.id}>
                                <td className="px-6 py-4 whitespace-nowrap font-semibold">{order.orderNumber}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{order.supplierName}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{new Date(order.orderDate).toLocaleDateString('pt-BR')}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{formatCurrency(order.totalValue)}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(order.status)}`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button onClick={() => openModal(order)} className="text-teal-600 hover:text-teal-900 dark:text-teal-400 dark:hover:text-teal-200">Editar</button>
                                    <button onClick={() => setOrderToDelete(order)} className="ml-4 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200">Excluir</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && <PurchaseOrderModal order={selectedOrder} suppliers={suppliers} products={products} onClose={closeModal} onSave={handleSavePurchaseOrder} />}

            {orderToDelete && (
                <ConfirmationModal
                    isOpen={!!orderToDelete}
                    onClose={() => setOrderToDelete(null)}
                    onConfirm={() => {
                        handleDeletePurchaseOrder(orderToDelete.id);
                        setOrderToDelete(null);
                    }}
                    title="Excluir Ordem de Compra"
                    message={`Tem certeza que deseja excluir a ordem de compra #${orderToDelete.orderNumber}?`}
                />
            )}
        </div>
    );
};

export default PurchaseOrdersTab;