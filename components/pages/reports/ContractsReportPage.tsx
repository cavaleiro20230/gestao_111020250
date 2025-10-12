import React, { useState, useContext, useMemo } from 'react';
import { AppContext } from '../../../App';
import Header from '../../Header';
import Card from '../../Card';
import { Page } from '../../../types';
import type { Contract } from '../../../types';

const ContractsReportPage: React.FC = () => {
    const context = useContext(AppContext);
    const [selectedClientId, setSelectedClientId] = useState<string>('all');

    if (!context) return null;

    const { contracts, clients, setActivePage } = context;

    const filteredContracts = useMemo(() => {
        return contracts
            .filter(contract => contract.status !== 'Cancelado')
            .filter(contract => selectedClientId === 'all' || contract.clientId === selectedClientId);
    }, [contracts, selectedClientId]);

    const { totalValue, totalContracts } = useMemo(() => {
        return filteredContracts.reduce((acc, contract) => {
            acc.totalValue += contract.value;
            acc.totalContracts += 1;
            return acc;
        }, { totalValue: 0, totalContracts: 0 });
    }, [filteredContracts]);

    const formatCurrency = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('pt-BR', { timeZone: 'UTC' });

    const getStatusClass = (status: Contract['status']) => {
        switch (status) {
            case 'Ativo': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
            case 'Encerrado': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
        }
    };
    
    return (
        <div className="p-8">
            <Header title="Relatório de Contratos" />
            <div className="mb-4">
                <button onClick={() => setActivePage(Page.Reports)} className="text-sm text-teal-600 hover:text-teal-800 dark:text-teal-400 dark:hover:text-teal-200 font-medium">
                    &larr; Voltar para Relatórios
                </button>
            </div>

            <Card className="mb-6">
                <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
                    <div className="w-full md:w-1/3">
                        <label htmlFor="clientFilter" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Filtrar por Cliente</label>
                        <select
                            id="clientFilter"
                            value={selectedClientId}
                            onChange={(e) => setSelectedClientId(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm bg-white dark:bg-slate-700"
                        >
                            <option value="all">Todos os Clientes</option>
                            {clients.map(client => (
                                <option key={client.id} value={client.id}>{client.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                 <Card>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Total de Contratos</p>
                    <p className="text-2xl font-semibold">{totalContracts}</p>
                </Card>
                <Card>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Valor Total dos Contratos</p>
                    <p className="text-2xl font-semibold">{formatCurrency(totalValue)}</p>
                </Card>
            </div>

            <Card>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                        <thead className="bg-slate-50 dark:bg-slate-700/50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Cliente</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Período de Vigência</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Valor Total</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                            {filteredContracts.length > 0 ? filteredContracts.map(contract => (
                                <tr key={contract.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-white">{contract.clientName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">{`${formatDate(contract.startDate)} - ${formatDate(contract.endDate)}`}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">{formatCurrency(contract.value)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(contract.status)}`}>
                                            {contract.status}
                                        </span>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={4} className="text-center py-8 text-slate-500 dark:text-slate-400">
                                        Nenhum contrato encontrado para os filtros selecionados.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default ContractsReportPage;
