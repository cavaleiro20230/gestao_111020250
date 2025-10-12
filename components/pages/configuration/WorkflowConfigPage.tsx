import React, { useState, useContext } from 'react';
import type { ApprovalWorkflow } from '../../../types';
import { AppContext } from '../../../App';
import Header from '../../Header';
import Card from '../../Card';
import WorkflowModal from '../../modals/WorkflowModal';
import ConfirmationModal from '../../modals/ConfirmationModal';

interface WorkflowConfigPageProps {
    onBack: () => void;
}

const WorkflowConfigPage: React.FC<WorkflowConfigPageProps> = ({ onBack }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedWorkflow, setSelectedWorkflow] = useState<ApprovalWorkflow | null>(null);
    const [workflowToDelete, setWorkflowToDelete] = useState<ApprovalWorkflow | null>(null);
    const context = useContext(AppContext);

    if (!context) return null;

    const { approvalWorkflows, handleSaveWorkflow, handleDeleteWorkflow } = context;

    const openModal = (workflow: ApprovalWorkflow | null = null) => {
        setSelectedWorkflow(workflow);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setSelectedWorkflow(null);
        setIsModalOpen(false);
    };

    return (
        <div>
            <Header title="Workflows de Aprovação">
                 <button onClick={() => openModal()} className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors shadow-sm">
                    Novo Workflow
                </button>
            </Header>
            <Card>
                 <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                        <thead className="bg-slate-50 dark:bg-slate-700/50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Nome</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Entidade</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Condição</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Etapas</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                            {approvalWorkflows.map(wf => (
                                <tr key={wf.id}>
                                    <td className="px-6 py-4 whitespace-nowrap font-medium">{wf.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{wf.entity}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{`Valor > ${wf.conditionValue.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}`}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{wf.steps.map(s => s.approverRole).join(' -> ')}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button onClick={() => openModal(wf)} className="text-teal-600 hover:text-teal-900 dark:text-teal-400 dark:hover:text-teal-200">Editar</button>
                                        <button onClick={() => setWorkflowToDelete(wf)} className="ml-4 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200">Excluir</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
            <div className="mt-6 flex justify-end">
                <button type="button" onClick={onBack} className="px-4 py-2 bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-white rounded-lg hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors">Voltar</button>
            </div>

            {isModalOpen && <WorkflowModal workflow={selectedWorkflow} onClose={closeModal} onSave={handleSaveWorkflow} />}
            {workflowToDelete && (
                <ConfirmationModal
                    isOpen={!!workflowToDelete}
                    onClose={() => setWorkflowToDelete(null)}
                    onConfirm={() => {
                        handleDeleteWorkflow(workflowToDelete.id);
                        setWorkflowToDelete(null);
                    }}
                    title="Excluir Workflow"
                    message={`Tem certeza que deseja excluir o workflow "${workflowToDelete.name}"?`}
                />
            )}
        </div>
    );
};

export default WorkflowConfigPage;
