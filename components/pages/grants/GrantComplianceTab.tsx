import React, { useState, useContext, useMemo } from 'react';
import { AppContext } from '../../../App';
import { Grant, ComplianceObligation } from '../../../types';
import ConfirmationModal from '../../modals/ConfirmationModal';
import AIComplianceModal from '../../modals/AIComplianceModal';
import { SparklesIcon } from '../../icons';

interface GrantComplianceTabProps {
    grant: Grant;
}

const GrantComplianceTab: React.FC<GrantComplianceTabProps> = ({ grant }) => {
    const [obligationToDelete, setObligationToDelete] = useState<ComplianceObligation | null>(null);
    const [isAIModalOpen, setIsAIModalOpen] = useState(false);

    const context = useContext(AppContext);
    if (!context) return null;

    const { complianceObligations, handleSaveComplianceObligation, handleDeleteComplianceObligation } = context;
    const grantObligations = useMemo(() => {
        return complianceObligations
            .filter(o => o.grantId === grant.id)
            .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
    }, [complianceObligations, grant.id]);
    
    const handleAddObligation = () => {
        const description = prompt("Descrição da Obrigação:");
        const dueDate = prompt("Data de Vencimento (AAAA-MM-DD):");
        if(description && dueDate) {
            handleSaveComplianceObligation({
                id: '', // will be generated
                grantId: grant.id,
                description,
                dueDate,
                status: 'Pendente'
            });
        }
    };
    
    const handleToggleStatus = (obligation: ComplianceObligation) => {
        handleSaveComplianceObligation({
            ...obligation,
            status: obligation.status === 'Pendente' ? 'Concluída' : 'Pendente'
        });
    };
    
    const getDaysUntilDue = (dueDate: string) => {
        const due = new Date(dueDate).getTime();
        const now = new Date().getTime();
        return Math.ceil((due - now) / (1000 * 3600 * 24));
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                 <button onClick={() => setIsAIModalOpen(true)} className="flex items-center px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors shadow-sm">
                    <SparklesIcon className="w-5 h-5 mr-2" />
                    Analisar Edital com IA
                </button>
                <button onClick={handleAddObligation} className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700">
                    Adicionar Obrigação Manual
                </button>
            </div>
            <div className="space-y-3">
                {grantObligations.map(obligation => {
                    const daysLeft = getDaysUntilDue(obligation.dueDate);
                    const isDueSoon = daysLeft <= 30 && obligation.status === 'Pendente';
                    const isOverdue = daysLeft < 0 && obligation.status === 'Pendente';
                    return (
                        <div key={obligation.id} className={`p-4 border rounded-lg flex items-center justify-between ${obligation.status === 'Concluída' ? 'bg-green-50 dark:bg-green-900/20' : isOverdue ? 'bg-red-50 dark:bg-red-900/20' : isDueSoon ? 'bg-yellow-50 dark:bg-yellow-900/20' : 'bg-slate-50 dark:bg-slate-800/30'}`}>
                            <div className="flex items-center">
                                <input type="checkbox" checked={obligation.status === 'Concluída'} onChange={() => handleToggleStatus(obligation)} className="h-5 w-5 rounded mr-4" />
                                <div>
                                    <p className={`font-medium ${obligation.status === 'Concluída' ? 'line-through text-slate-500' : ''}`}>{obligation.description}</p>
                                    <p className="text-sm text-slate-500">
                                        Vencimento: {new Date(obligation.dueDate).toLocaleDateString('pt-BR')}
                                        {obligation.status === 'Pendente' && (
                                            <span className={`font-bold ml-2 ${isOverdue ? 'text-red-500' : isDueSoon ? 'text-yellow-600' : ''}`}>
                                                {isOverdue ? `(Vencido há ${Math.abs(daysLeft)} dias)` : `(Faltam ${daysLeft} dias)`}
                                            </span>
                                        )}
                                    </p>
                                </div>
                            </div>
                            <button onClick={() => setObligationToDelete(obligation)} className="text-red-500 hover:text-red-700 text-lg">&times;</button>
                        </div>
                    )
                })}
            </div>
            
            {isAIModalOpen && <AIComplianceModal grantId={grant.id} onClose={() => setIsAIModalOpen(false)} />}
            
            {obligationToDelete && (
                 <ConfirmationModal
                    isOpen={!!obligationToDelete}
                    onClose={() => setObligationToDelete(null)}
                    onConfirm={() => {
                        handleDeleteComplianceObligation(obligationToDelete.id);
                        setObligationToDelete(null);
                    }}
                    title="Excluir Obrigação"
                    message={`Tem certeza que deseja excluir a obrigação: "${obligationToDelete.description}"?`}
                />
            )}
        </div>
    );
};

export default GrantComplianceTab;
