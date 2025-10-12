import React, { useState, useContext } from 'react';
import { AppContext } from '../../App';
import Header from '../Header';
import Card from '../Card';
import BudgetModal from '../modals/BudgetModal';
import ConfirmationModal from '../modals/ConfirmationModal';
import { Page, Budget } from '../../types';

const BudgetingPage: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);
    const [budgetToDelete, setBudgetToDelete] = useState<Budget | null>(null);

    const context = useContext(AppContext);
    if (!context) return null;

    const { budgets, budgetItems, handleSaveBudget, handleDeleteBudget, setActivePage } = context;

    const openModal = (budget: Budget | null = null) => {
        setSelectedBudget(budget);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setSelectedBudget(null);
        setIsModalOpen(false);
    };

    const formatCurrency = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    const getStatusClass = (status: Budget['status']) => {
        switch (status) {
            case 'Aprovado': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
            case 'Planejamento': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
            case 'Encerrado': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
            default: return '';
        }
    };

    return (
        <div className="p-8">
            <Header title="Planejamento Orçamentário">
                <button onClick={() => openModal()} className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors shadow-sm">
                    Novo Orçamento
                </button>
            </Header>
            <Card>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                        <thead className="bg-slate-50 dark:bg-slate-700/50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Nome do Orçamento</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Ano</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Valor Total</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                            {budgets.map(budget => (
                                <tr key={budget.id} onClick={() => setActivePage(Page.BudgetDetail, { budgetId: budget.id })} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer">
                                    <td className="px-6 py-4 whitespace-nowrap font-medium">{budget.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{budget.year}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{formatCurrency(budget.lineItems.reduce((sum, item) => sum + item.projectedValue, 0))}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(budget.status)}`}>
                                            {budget.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button onClick={(e) => { e.stopPropagation(); openModal(budget); }} className="text-teal-600 hover:text-teal-900 dark:text-teal-400 dark:hover:text-teal-200">Editar</button>
                                        <button onClick={(e) => { e.stopPropagation(); setBudgetToDelete(budget); }} className="ml-4 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200">Excluir</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
            {isModalOpen && <BudgetModal budget={selectedBudget} onClose={closeModal} onSave={handleSaveBudget} budgetItems={budgetItems} />}
            {budgetToDelete && (
                <ConfirmationModal
                    isOpen={!!budgetToDelete}
                    onClose={() => setBudgetToDelete(null)}
                    onConfirm={() => {
                        handleDeleteBudget(budgetToDelete.id);
                        setBudgetToDelete(null);
                    }}
                    title="Excluir Orçamento"
                    message={`Tem certeza que deseja excluir o orçamento "${budgetToDelete.name}"?`}
                />
            )}
        </div>
    );
};

export default BudgetingPage;
