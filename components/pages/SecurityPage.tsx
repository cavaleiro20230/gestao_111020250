import React, { useState, useContext } from 'react';
import type { User, UserRole } from '../../types';
import { AppContext } from '../../App';
import Header from '../Header';
import Card from '../Card';
import UserModal from '../modals/UserModal';
import ConfirmationModal from '../modals/ConfirmationModal';
import TableControls from '../TableControls';
import { USER_ROLES, Page } from '../../types';

type Tab = 'users' | 'roles';

const PAGE_NAMES: Partial<Record<Page, string>> = {
    [Page.Dashboard]: "Dashboard",
    [Page.Approvals]: "Minhas Aprovações",
    [Page.Finance]: "Financeiro (menu principal)",
    [Page.AccountsPayable]: "Contas a Pagar",
    [Page.AccountsReceivable]: "Contas a Receber",
    [Page.Billing]: "Faturamento",
    [Page.Projects]: "Projetos (menu principal)",
    [Page.ProjectBoard]: "Detalhes do Projeto (Kanban, etc.)",
    [Page.Registrations]: "Cadastros Gerais",
    [Page.Configuration]: "Configurações do Sistema",
    [Page.Reports]: "Relatórios (menu principal)",
    [Page.Contracts]: "Contratos",
    [Page.Sales]: "Vendas",
    [Page.Purchases]: "Compras",
    [Page.Warehouse]: "Almoxarifado",
    [Page.HumanResources]: "Recursos Humanos",
    [Page.Documents]: "Documentos",
    [Page.Logistics]: "Logística",
    [Page.Assets]: "Patrimônio",
    [Page.Accounting]: "Contabilidade",
    [Page.Budgeting]: "Orçamento",
    [Page.GrantManagement]: "Gestão de Convênios",
    [Page.Security]: "Central de Segurança",
    [Page.CashFlowReport]: "Relatório: Fluxo de Caixa",
    [Page.DREReport]: "Relatório: DRE",
    [Page.CostCenterReport]: "Relatório: Centro de Custo",
    [Page.ContractsReport]: "Relatório: Contratos",
    [Page.AccountabilityReport]: "Relatório: Prestação de Contas",
    [Page.BalanceSheetReport]: "Relatório: Balanço Patrimonial",
    [Page.CustomReportBuilder]: "Construtor de Relatórios",
};


const RoleManagementTab: React.FC = () => {
    const context = useContext(AppContext);
    if (!context) return null;

    const { rolePermissions, handleUpdateRolePermissions } = context;

    const pages = Object.keys(PAGE_NAMES).map(p => Number(p) as Page).sort((a,b) => PAGE_NAMES[a]!.localeCompare(PAGE_NAMES[b]!));
    const rolesToManage = USER_ROLES.filter(r => r !== 'funder' && r !== 'admin');

    const roleTranslations: Record<UserRole, string> = {
        admin: 'Admin',
        finance: 'Financeiro',
        project_manager: 'Ger. Projetos',
        superintendent: 'Superintendente',
        coordinator: 'Coordenador',
        inspector: 'Fiscal',
        employee: 'Colaborador',
        funder: 'Financiador'
    };

    return (
        <div className="overflow-x-auto">
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                Marque as caixas para conceder acesso a uma funcionalidade para um determinado perfil. As alterações são salvas automaticamente. O perfil "Admin" tem acesso a tudo por padrão.
            </p>
            <table className="min-w-full text-sm">
                <thead className="bg-slate-100 dark:bg-slate-700/50">
                    <tr>
                        <th className="sticky left-0 bg-slate-100 dark:bg-slate-700/50 p-2 text-left font-semibold">Funcionalidade</th>
                        {rolesToManage.map(role => (
                            <th key={role} className="p-2 font-semibold whitespace-nowrap">{roleTranslations[role]}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {pages.map(page => (
                        <tr key={page} className="border-t border-slate-200 dark:border-slate-700">
                            <td className="sticky left-0 bg-white dark:bg-slate-800 p-2 font-medium">{PAGE_NAMES[page]}</td>
                            {rolesToManage.map(role => (
                                <td key={role} className="p-2 text-center">
                                    <input
                                        type="checkbox"
                                        className="h-5 w-5 rounded"
                                        checked={rolePermissions[role]?.includes(page) || false}
                                        onChange={e => handleUpdateRolePermissions(role, page, e.target.checked)}
                                    />
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};


const UserManagementTab: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [userToToggleStatus, setUserToToggleStatus] = useState<User | null>(null);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const context = useContext(AppContext);

    if (!context) return null;

    const { users, handleSaveUser, handleDeleteUser } = context;

    const openModal = (user: User | null = null) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setSelectedUser(null);
        setIsModalOpen(false);
    };
    
    const handleConfirmToggleStatus = () => {
        if (userToToggleStatus) {
            const newStatus = userToToggleStatus.status === 'active' ? 'blocked' : 'active';
            handleSaveUser({ ...userToToggleStatus, status: newStatus });
            setUserToToggleStatus(null);
        }
    };
    
    const filteredUsers = users.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.position.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusClass = (status: User['status']) => {
        if (status === 'blocked') return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
        return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
    }
    
    return (
        <Card>
            <TableControls onAdd={() => openModal()} addLabel="Novo Usuário" onSearch={setSearchTerm} />
            <div className="overflow-x-auto mt-4">
                <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                    <thead className="bg-slate-50 dark:bg-slate-700/50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Nome</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Perfil</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                        {filteredUsers.map(user => (
                            <tr key={user.id}>
                                <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap capitalize">{user.role}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(user.status)}`}>
                                        {user.status === 'active' ? 'Ativo' : 'Bloqueado'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button onClick={() => openModal(user)} className="text-teal-600 hover:text-teal-900 dark:text-teal-400 dark:hover:text-teal-200">Editar</button>
                                    <button onClick={() => setUserToToggleStatus(user)} className="ml-4 text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-200">
                                        {user.status === 'active' ? 'Bloquear' : 'Desbloquear'}
                                    </button>
                                    <button onClick={() => setUserToDelete(user)} className="ml-4 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200">Excluir</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && <UserModal user={selectedUser} onClose={closeModal} onSave={handleSaveUser} />}
            
            {userToToggleStatus && (
                <ConfirmationModal
                    isOpen={!!userToToggleStatus}
                    onClose={() => setUserToToggleStatus(null)}
                    onConfirm={handleConfirmToggleStatus}
                    title={`${userToToggleStatus.status === 'active' ? 'Bloquear' : 'Desbloquear'} Usuário`}
                    message={`Tem certeza que deseja ${userToToggleStatus.status === 'active' ? 'bloquear' : 'desbloquear'} o usuário ${userToToggleStatus.name}?`}
                />
            )}

            {userToDelete && (
                <ConfirmationModal
                    isOpen={!!userToDelete}
                    onClose={() => setUserToDelete(null)}
                    onConfirm={() => {
                        handleDeleteUser(userToDelete.id);
                        setUserToDelete(null);
                    }}
                    title="Excluir Usuário"
                    message={`Tem certeza que deseja excluir ${userToDelete.name}? Esta ação é permanente.`}
                />
            )}
        </Card>
    );
};


const SecurityPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<Tab>('users');
    
    const tabs: {id: Tab, label: string}[] = [
        {id: 'users', label: 'Gerenciamento de Usuários'},
        {id: 'roles', label: 'Perfis de Acesso (RBAC)'}
    ];

    return (
        <div className="p-8">
            <Header title="Central de Segurança" />
            
            <div className="border-b border-slate-200 dark:border-slate-700 mb-6">
                <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                     {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`${
                            activeTab === tab.id
                                ? 'border-teal-500 text-teal-600 dark:border-teal-400 dark:text-teal-400'
                                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:border-slate-500'
                            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>
            
            {activeTab === 'users' && <UserManagementTab />}
            {activeTab === 'roles' && <RoleManagementTab />}

        </div>
    );
};

export default SecurityPage;