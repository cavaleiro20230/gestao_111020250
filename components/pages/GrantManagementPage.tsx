import React, { useState, useContext } from 'react';
import { AppContext } from '../../App';
import Header from '../Header';
import Card from '../Card';
import GrantModal from '../modals/GrantModal';
import ConfirmationModal from '../modals/ConfirmationModal';
import TableControls from '../TableControls';
import type { Grant } from '../../types';
import { Page } from '../../types';

const GrantManagementPage: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedGrant, setSelectedGrant] = useState<Grant | null>(null);
    const [grantToDelete, setGrantToDelete] = useState<Grant | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const context = useContext(AppContext);
    if (!context) return null;

    const { grants, fundingSources, users, handleSaveGrant, handleDeleteGrant, setActivePage } = context;

    const openModal = (grant: Grant | null = null) => {
        setSelectedGrant(grant);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setSelectedGrant(null);
        setIsModalOpen(false);
    };

    const filteredGrants = grants.filter(g =>
        g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        g.fundingSourceName.toLowerCase().includes(searchTerm.toLowerCase())
    ).sort((a,b) => new Date(b.proposalDate).getTime() - new Date(a.proposalDate).getTime());

    const formatCurrency = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    const formatDate = (dateString?: string) => dateString ? new Date(dateString).toLocaleDateString('pt-BR', {timeZone: 'UTC'}) : 'N/A';
    
    const getStatusClass = (status: Grant['status']) => {
        switch (status) {
            case 'Aprovado':
            case 'Ativo':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
            case 'Em Análise':
            case 'Proposta':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
            case 'Rejeitado':
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
            case 'Encerrado':
                return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
            default: return '';
        }
    };

    return (
        <div className="p-8">
            <Header title="Gestão de Convênios e Propostas">
                <button onClick={() => openModal()} className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors shadow-sm">
                    Nova Proposta/Convênio
                </button>
            </Header>
            <Card>
                <TableControls onAdd={() => openModal()} addLabel="Nova Proposta" onSearch={setSearchTerm} />
                <div className="overflow-x-auto mt-4">
                    <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                        <thead className="bg-slate-50 dark:bg-slate-700/50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Nome</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Fonte de Recurso</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Valor</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Relatório Final</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                            {filteredGrants.map(grant => (
                                <tr key={grant.id} onClick={() => setActivePage(Page.GrantDetail, { grantId: grant.id })} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer">
                                    <td className="px-6 py-4 whitespace-nowrap font-medium">{grant.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{grant.fundingSourceName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{formatCurrency(grant.totalValue)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(grant.status)}`}>
                                            {grant.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">{formatDate(grant.finalReportDueDate)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button onClick={(e) => { e.stopPropagation(); openModal(grant); }} className="text-teal-600 hover:text-teal-900 dark:text-teal-400 dark:hover:text-teal-200">Editar</button>
                                        <button onClick={(e) => { e.stopPropagation(); setGrantToDelete(grant); }} className="ml-4 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200">Excluir</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
            {isModalOpen && <GrantModal grant={selectedGrant} onClose={closeModal} onSave={handleSaveGrant} fundingSources={fundingSources} users={users} />}
            {grantToDelete && (
                <ConfirmationModal
                    isOpen={!!grantToDelete}
                    onClose={() => setGrantToDelete(null)}
                    onConfirm={() => {
                        handleDeleteGrant(grantToDelete.id);
                        setGrantToDelete(null);
                    }}
                    title="Excluir Convênio/Proposta"
                    message={`Tem certeza que deseja excluir "${grantToDelete.name}"?`}
                />
            )}
        </div>
    );
};
export default GrantManagementPage;
