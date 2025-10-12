import React, { useContext } from 'react';
import { AppContext, AuthContext } from '../App';
import { Page, UserRole } from '../types';
import { 
    CubeIcon, Bars4Icon, UsersIcon, ClipboardDocumentListIcon, DocumentTextIcon, KeyIcon,
    CheckCircleIcon
} from './icons';

interface NavItem {
    page: Page;
    label: string;
    icon: React.FC<{className?: string}>;
    roles: UserRole[];
}

const navItems: NavItem[] = [
    { page: Page.Dashboard, label: 'Dashboard', icon: Bars4Icon, roles: ['admin', 'finance', 'project_manager', 'superintendent', 'coordinator', 'inspector', 'employee'] },
    { page: Page.Approvals, label: 'Minhas Aprovações', icon: CheckCircleIcon, roles: ['admin', 'finance', 'project_manager', 'superintendent'] },
    { page: Page.Finance, label: 'Financeiro', icon: Bars4Icon, roles: ['admin', 'finance', 'superintendent'] },
    { page: Page.Projects, label: 'Projetos', icon: Bars4Icon, roles: ['admin', 'project_manager', 'superintendent', 'coordinator'] },
    { page: Page.Contracts, label: 'Contratos', icon: DocumentTextIcon, roles: ['admin', 'project_manager', 'superintendent', 'coordinator', 'inspector']},
    { page: Page.Registrations, label: 'Cadastros', icon: Bars4Icon, roles: ['admin', 'finance', 'project_manager', 'superintendent', 'coordinator'] },
    { page: Page.HumanResources, label: 'Recursos Humanos', icon: UsersIcon, roles: ['admin', 'superintendent', 'coordinator', 'employee']},
    { page: Page.Purchases, label: 'Compras', icon: ClipboardDocumentListIcon, roles: ['admin', 'finance', 'project_manager', 'superintendent', 'coordinator']},
    { page: Page.Sales, label: 'Vendas', icon: ClipboardDocumentListIcon, roles: ['admin', 'finance', 'superintendent']},
    { page: Page.Warehouse, label: 'Almoxarifado', icon: CubeIcon, roles: ['admin', 'project_manager', 'coordinator', 'employee']},
    { page: Page.Documents, label: 'Documentos', icon: DocumentTextIcon, roles: ['admin', 'project_manager', 'superintendent', 'coordinator', 'inspector', 'employee']},
    { page: Page.Logistics, label: 'Logística', icon: CubeIcon, roles: ['admin', 'project_manager', 'coordinator']},
    { page: Page.Assets, label: 'Patrimônio', icon: CubeIcon, roles: ['admin', 'finance', 'superintendent']},
    { page: Page.Accounting, label: 'Contabilidade', icon: DocumentTextIcon, roles: ['admin', 'finance', 'superintendent']},
    { page: Page.Budgeting, label: 'Orçamento', icon: DocumentTextIcon, roles: ['admin', 'finance', 'superintendent']},
    { page: Page.GrantManagement, label: 'Convênios', icon: DocumentTextIcon, roles: ['admin', 'project_manager', 'superintendent', 'coordinator']},
    { page: Page.Reports, label: 'Relatórios', icon: Bars4Icon, roles: ['admin', 'finance', 'project_manager', 'superintendent', 'coordinator', 'inspector']},
    { page: Page.Configuration, label: 'Configurações', icon: KeyIcon, roles: ['admin'] },
];


const Sidebar: React.FC = () => {
    const context = useContext(AppContext);
    const authContext = useContext(AuthContext);

    if (!context || !authContext || !authContext.user) return null;

    const { activePage, setActivePage } = context;
    const { user } = authContext;

    const userNavItems = navItems.filter(item => item.roles.includes(user.role) && item.page !== Page.Dashboard);

    return (
        <div className="w-full bg-slate-800 text-slate-300 flex flex-row items-center shadow-md">
            <nav className="flex-1 px-4 py-1 flex flex-row items-center space-x-1 overflow-x-auto">
                {userNavItems.map(item => (
                    <button
                        key={item.page}
                        onClick={() => setActivePage(item.page)}
                        className={`flex-shrink-0 flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                            activePage === item.page
                                ? 'bg-slate-700 text-white'
                                : 'hover:bg-slate-700/50 hover:text-white'
                        }`}
                    >
                        <item.icon className="w-5 h-5 mr-2" />
                        {item.label}
                    </button>
                ))}
            </nav>
        </div>
    );
};

export default Sidebar;