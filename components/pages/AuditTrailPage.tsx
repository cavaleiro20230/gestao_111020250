import React, { useState, useContext, useMemo } from 'react';
import type { AuditLog, User } from '../../types';
import { AppContext } from '../../App';
import Header from '../Header';
import Card from '../Card';
import Modal from '../modals/Modal';

interface AuditTrailPageProps {
    onBack: () => void;
}

const AuditTrailPage: React.FC<AuditTrailPageProps> = ({ onBack }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [userFilter, setUserFilter] = useState('all');
    const [actionFilter, setActionFilter] = useState('all');
    const [viewingUserLogs, setViewingUserLogs] = useState<User | null>(null);
    const context = useContext(AppContext);

    if (!context) return null;

    const { auditLogs, users } = context;
    
    const filteredLogs = useMemo(() => {
        return auditLogs
            .filter(log => userFilter === 'all' || log.userId === userFilter)
            .filter(log => actionFilter === 'all' || log.action === actionFilter)
            .filter(log => log.details.toLowerCase().includes(searchTerm.toLowerCase()) || log.userName.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [auditLogs, searchTerm, userFilter, actionFilter]);

    const getActionLabel = (action: AuditLog['action']) => {
        const labels = {
            create: 'Criação', update: 'Atualização', delete: 'Exclusão',
            status_change: 'Mudança de Status', login: 'Login', logout: 'Logout', processed: 'Processado'
        };
        return labels[action] || action;
    };

    const handleUserClick = (userId: string) => {
        const user = users.find(u => u.id === userId);
        if (user) {
            setViewingUserLogs(user);
        }
    };

    return (
        <div>
            <Header title="Trilha de Auditoria" />
            <Card>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <input
                        type="text"
                        placeholder="Pesquisar nos detalhes..."
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white dark:bg-slate-700"
                    />
                     <select value={userFilter} onChange={e => setUserFilter(e.target.value)} className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700">
                        <option value="all">Todos os Usuários</option>
                        {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                     </select>
                     <select value={actionFilter} onChange={e => setActionFilter(e.target.value)} className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700">
                        <option value="all">Todas as Ações</option>
                        <option value="create">Criação</option>
                        <option value="update">Atualização</option>
                        <option value="delete">Exclusão</option>
                        <option value="status_change">Mudança de Status</option>
                        <option value="login">Login</option>
                        <option value="logout">Logout</option>
                        <option value="processed">Processado</option>
                     </select>
                </div>

                 <div className="overflow-x-auto mt-4">
                    <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                        <thead className="bg-slate-50 dark:bg-slate-700/50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Data/Hora</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Usuário</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Ação</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Entidade</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Detalhes</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                            {filteredLogs.map(log => (
                                <tr key={log.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">{new Date(log.timestamp).toLocaleString('pt-BR')}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <button onClick={() => handleUserClick(log.userId)} className="text-teal-600 hover:text-teal-800 dark:text-teal-400 dark:hover:text-teal-200 font-medium">
                                            {log.userName}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">{getActionLabel(log.action)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">{log.entity}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">{log.details}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
            <div className="mt-6 flex justify-end">
                <button type="button" onClick={onBack} className="px-4 py-2 bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-white rounded-lg hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors">Voltar</button>
            </div>

            {viewingUserLogs && (
                <Modal
                    isOpen={!!viewingUserLogs}
                    onClose={() => setViewingUserLogs(null)}
                    title={`Atividades de ${viewingUserLogs.name}`}
                >
                    <div className="max-h-[60vh] overflow-y-auto">
                        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                            <thead className="bg-slate-50 dark:bg-slate-700/50 sticky top-0">
                                <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Data/Hora</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Ação</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Detalhes</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                                {auditLogs
                                    .filter(log => log.userId === viewingUserLogs.id)
                                    .map(log => (
                                        <tr key={log.id}>
                                            <td className="px-4 py-2 whitespace-nowrap text-sm">{new Date(log.timestamp).toLocaleString('pt-BR')}</td>
                                            <td className="px-4 py-2 whitespace-nowrap text-sm">{getActionLabel(log.action)}</td>
                                            <td className="px-4 py-2 text-sm">{log.details || `${log.entity} #${log.entityId?.substring(0, 8)}`}</td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                     <div className="mt-6 flex justify-end">
                        <button
                            type="button"
                            onClick={() => setViewingUserLogs(null)}
                            className="px-4 py-2 bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-white rounded-lg hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors"
                        >
                            Fechar
                        </button>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default AuditTrailPage;