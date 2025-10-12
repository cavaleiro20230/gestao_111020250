import React, { useState, useContext, useMemo } from 'react';
import { AppContext, AuthContext } from '../../App';
import Header from '../Header';
import Card from '../Card';
import ConfirmationModal from '../modals/ConfirmationModal';
import { ApprovalInstance } from '../../types';

const ApprovalsPage: React.FC = () => {
    const context = useContext(AppContext);
    const auth = useContext(AuthContext);
    const [itemToUpdate, setItemToUpdate] = useState<{ instance: ApprovalInstance; newStatus: 'approved' | 'rejected' } | null>(null);
    const [notes, setNotes] = useState('');

    if (!context || !auth || !auth.user) return null;

    const { user } = auth;
    const { approvalInstances, materialRequests, handleProcessApproval } = context;

    const myPendingApprovals = useMemo(() => {
        return approvalInstances.filter(instance => {
            if (instance.status !== 'pending') return false;
            const currentStep = instance.stepStates[instance.currentStep];
            return currentStep && currentStep.status === 'pending' && currentStep.approverRole === user.role;
        });
    }, [approvalInstances, user.role]);

    const getItemDetails = (instance: ApprovalInstance) => {
        if (instance.entity === 'MaterialRequest') {
            const request = materialRequests.find(r => r.id === instance.entityId);
            if (!request) return { description: 'Requisição não encontrada', value: 0 };
            const totalValue = request.items.reduce((sum, item) => sum + item.quantity * item.price, 0);
            return {
                description: `Requisição de Material para "${request.projectName}"`,
                value: totalValue,
            };
        }
        return { description: 'Item desconhecido', value: 0 };
    };
    
    const handleConfirmUpdate = () => {
        if (itemToUpdate) {
            handleProcessApproval(itemToUpdate.instance.id, itemToUpdate.newStatus, notes);
            setItemToUpdate(null);
            setNotes('');
        }
    };

    const formatCurrency = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });


    return (
        <div className="p-8">
            <Header title="Minhas Aprovações Pendentes" />
            <Card>
                 <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                        <thead className="bg-slate-50 dark:bg-slate-700/50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Item</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Valor</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                            {myPendingApprovals.map(instance => {
                                const details = getItemDetails(instance);
                                return (
                                    <tr key={instance.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">{details.description}</td>
                                        <td className="px-6 py-4 whitespace-nowrap font-semibold">{formatCurrency(details.value)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                                            <button onClick={() => setItemToUpdate({ instance, newStatus: 'approved'})} className="text-green-600 hover:text-green-800">Aprovar</button>
                                            <button onClick={() => setItemToUpdate({ instance, newStatus: 'rejected'})} className="text-red-600 hover:text-red-800">Rejeitar</button>
                                        </td>
                                    </tr>
                                )
                            })}
                            {myPendingApprovals.length === 0 && (
                                <tr>
                                    <td colSpan={3} className="text-center py-10 text-slate-500">
                                        Nenhuma pendência de aprovação para você.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

             {itemToUpdate && (
                <ConfirmationModal
                isOpen={!!itemToUpdate}
                onClose={() => setItemToUpdate(null)}
                onConfirm={handleConfirmUpdate}
                title={`${itemToUpdate.newStatus === 'approved' ? 'Aprovar' : 'Rejeitar'} Item`}
                message={`Tem certeza que deseja ${itemToUpdate.newStatus === 'approved' ? 'aprovar' : 'rejeitar'} este item?`}
                >
                    <div className="mt-4">
                        <label htmlFor="approvalNotes" className="block text-sm font-medium">Notas (Opcional)</label>
                        <textarea id="approvalNotes" value={notes} onChange={e => setNotes(e.target.value)} rows={2} className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-slate-600" />
                    </div>
                </ConfirmationModal>
            )}
        </div>
    );
};

export default ApprovalsPage;
