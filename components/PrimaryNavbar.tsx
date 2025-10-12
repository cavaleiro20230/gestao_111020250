import React, { useState, useContext, useRef, useEffect } from 'react';
import { AppContext, AuthContext } from '../App';
import { MagnifyingGlassIcon, ArrowLeftOnRectangleIcon, Bars3Icon } from './icons';
import NotificationsPanel from './NotificationsPanel';
import { Page, UserRole } from '../types';
import { pageAccess } from '../config/pageAccess';

interface NavSubItem {
    page: Page;
    label: string;
    roles: UserRole[];
}

interface NavMenuItem {
    label: string;
    roles: UserRole[];
    page?: Page;
    subItems?: NavSubItem[];
}

const menuConfig: NavMenuItem[] = [
    {
        label: 'Financeiro',
        roles: ['admin', 'finance', 'superintendent', 'inspector'],
        subItems: [
            { label: 'Resumo Financeiro', page: Page.Finance, roles: pageAccess[Page.Finance] },
            { label: 'Contas a Pagar', page: Page.AccountsPayable, roles: pageAccess[Page.AccountsPayable] },
            { label: 'Contas a Receber', page: Page.AccountsReceivable, roles: pageAccess[Page.AccountsReceivable] },
            { label: 'Faturamento', page: Page.Billing, roles: pageAccess[Page.Billing] },
            { label: 'Conciliação Bancária', page: Page.Accounting, roles: pageAccess[Page.Accounting] },
        ]
    },
    {
        label: 'Contabilidade',
        roles: ['admin', 'finance', 'superintendent'],
        subItems: [
            { label: 'Lançamentos Contábeis', page: Page.Accounting, roles: pageAccess[Page.Accounting] },
            { label: 'Patrimônio', page: Page.Assets, roles: pageAccess[Page.Assets] },
            { label: 'Orçamento', page: Page.Budgeting, roles: pageAccess[Page.Budgeting] },
            { label: 'Configurações Contábeis', page: Page.AccountingConfiguration, roles: pageAccess[Page.AccountingConfiguration] },
        ]
    },
    {
        label: 'Projetos',
        roles: ['admin', 'project_manager', 'superintendent', 'coordinator', 'inspector'],
        subItems: [
            { label: 'Painel de Projetos', page: Page.Projects, roles: pageAccess[Page.Projects] },
            { label: 'Gestão de Convênios', page: Page.GrantManagement, roles: pageAccess[Page.GrantManagement] },
        ]
    },
    {
        label: 'Suprimentos',
        roles: ['admin', 'finance', 'project_manager', 'superintendent', 'coordinator', 'employee'],
        subItems: [
            { label: 'Compras', page: Page.Purchases, roles: pageAccess[Page.Purchases] },
            { label: 'Almoxarifado', page: Page.Warehouse, roles: pageAccess[Page.Warehouse] },
            { label: 'Logística', page: Page.Logistics, roles: pageAccess[Page.Logistics] },
        ]
    },
    {
        label: 'Recursos Humanos',
        page: Page.HumanResources,
        roles: pageAccess[Page.HumanResources],
    },
    {
        label: 'Corporativo',
        roles: ['admin', 'finance', 'project_manager', 'superintendent', 'coordinator', 'inspector', 'employee'],
        subItems: [
            { label: 'Minhas Aprovações', page: Page.Approvals, roles: pageAccess[Page.Approvals] },
            { label: 'Documentos', page: Page.Documents, roles: pageAccess[Page.Documents] },
            { label: 'Relatórios', page: Page.Reports, roles: pageAccess[Page.Reports] },
        ]
    },
    {
        label: 'Administração',
        roles: ['admin', 'finance', 'project_manager', 'superintendent', 'coordinator'],
        subItems: [
            { label: 'Cadastros Gerais', page: Page.Registrations, roles: pageAccess[Page.Registrations] },
            { label: 'Configurações', page: Page.Configuration, roles: pageAccess[Page.Configuration] },
        ]
    },
    {
        label: 'Central de Segurança',
        page: Page.Security,
        roles: ['admin'],
    }
];


const PrimaryNavbar: React.FC<{ onSearchClick: () => void }> = ({ onSearchClick }) => {
    const authContext = useContext(AuthContext);
    const appContext = useContext(AppContext);
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const navRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (navRef.current && !navRef.current.contains(event.target as Node)) {
                setOpenDropdown(null);
                setIsUserMenuOpen(false);
                setIsNotificationsOpen(false);
                setIsMobileMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (!authContext || !appContext || !authContext.user) return null;

    const { user, logout } = authContext;
    const { notifications, handleNotificationClick, setActivePage, rolePermissions } = appContext;
    const { role: userRole } = user;

    const unreadCount = notifications.filter(n => n.userId === user?.id && !n.read).length;

    const handleNotificationPanelClick = (notificationId: string, link?: any) => {
        handleNotificationClick(notificationId, link);
        setIsNotificationsOpen(false);
    };

    const handleMenuClick = (menuItem: NavMenuItem) => {
        if (menuItem.subItems && menuItem.subItems.length > 0) {
            setOpenDropdown(openDropdown === menuItem.label ? null : menuItem.label);
        } else if (menuItem.page !== undefined) {
            setActivePage(menuItem.page);
            setOpenDropdown(null);
        }
    };

    const handleSubItemClick = (page: Page) => {
        setActivePage(page);
        setOpenDropdown(null);
    }
    
    const accessibleMenuItems = menuConfig
        .map(item => {
            if (userRole === 'admin') {
                return item; // Admin vê todos os menus configurados
            }

            if (item.page !== undefined) {
                // É um link direto
                return rolePermissions[userRole]?.includes(item.page) ? item : null;
            } else if (item.subItems) {
                // É um dropdown, verifica se há subitens acessíveis
                const accessibleSubItems = item.subItems.filter(sub => rolePermissions[userRole]?.includes(sub.page));
                if (accessibleSubItems.length > 0) {
                    return { ...item, subItems: accessibleSubItems };
                }
                return null; // Oculta o dropdown se não houver subitens acessíveis
            }
            return null;
        })
        .filter((item): item is NavMenuItem => item !== null);


    return (
        <div ref={navRef} className="bg-slate-800 text-slate-300 shadow-md z-30">
            <div className="flex justify-between items-center px-4 h-16 flex-shrink-0">
                <div className="flex items-center">
                    <div className="text-2xl font-bold text-white mr-4">FEMAR</div>
                    <nav className="hidden md:flex items-center space-x-1">
                        {accessibleMenuItems.map(item => (
                            <div key={item.label} className="relative">
                                <button
                                    onClick={() => handleMenuClick(item)}
                                    className="flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-slate-700"
                                >
                                    {item.label}
                                    {item.subItems && item.subItems.length > 0 && <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>}
                                </button>
                                {openDropdown === item.label && item.subItems && (
                                    <div className="absolute top-full left-0 mt-2 w-56 bg-white dark:bg-slate-700 rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5">
                                        {item.subItems.map(sub => (
                                            <a
                                                key={sub.label}
                                                href="#"
                                                onClick={(e) => { e.preventDefault(); handleSubItemClick(sub.page); }}
                                                className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600"
                                            >
                                                {sub.label}
                                            </a>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </nav>
                    <div className="md:hidden">
                        <button onClick={() => setIsMobileMenuOpen(prev => !prev)} className="p-2 rounded-md hover:bg-slate-700">
                            <Bars3Icon className="w-6 h-6" />
                        </button>
                    </div>
                </div>
                
                <div className="flex items-center space-x-2 md:space-x-4">
                    <button onClick={onSearchClick} className="p-2 rounded-full hover:bg-slate-700">
                        <MagnifyingGlassIcon className="w-5 h-5" />
                    </button>
                    <div className="relative">
                        <button onClick={() => { setIsNotificationsOpen(prev => !prev); setIsUserMenuOpen(false); setOpenDropdown(null); }} className="p-2 rounded-full hover:bg-slate-700">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                            {unreadCount > 0 && <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">{unreadCount}</span>}
                        </button>
                        {isNotificationsOpen && <NotificationsPanel onClose={() => setIsNotificationsOpen(false)} onNotificationClick={handleNotificationPanelClick} />}
                    </div>
                    <div className="relative">
                        <button onClick={() => { setIsUserMenuOpen(prev => !prev); setIsNotificationsOpen(false); setOpenDropdown(null); }} className="flex items-center p-1 rounded-full hover:bg-slate-700">
                            <div className="text-right mr-3 hidden sm:block">
                                <div className="font-semibold text-sm text-white">{user?.name}</div>
                                <div className="text-xs text-slate-400">{user?.position}</div>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-teal-500 flex items-center justify-center text-white font-bold">{user?.name?.charAt(0)}</div>
                        </button>
                        {isUserMenuOpen && (
                            <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg shadow-lg">
                                <button onClick={logout} className="w-full flex items-center px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600">
                                    <ArrowLeftOnRectangleIcon className="w-5 h-5 mr-3" /> Sair
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {isMobileMenuOpen && (
                <div className="md:hidden border-t border-slate-700">
                    <nav className="px-2 pt-2 pb-3 space-y-1">
                        {accessibleMenuItems.map(item => {
                            if (item.subItems) {
                                return (
                                    <div key={item.label}>
                                        <h3 className="px-3 pt-2 pb-1 text-xs font-semibold text-slate-400 uppercase tracking-wider">{item.label}</h3>
                                        {item.subItems.map(sub => (
                                            <a key={sub.label} href="#" onClick={(e) => { e.preventDefault(); handleSubItemClick(sub.page); setIsMobileMenuOpen(false); }} className="block px-3 py-2 rounded-md text-base font-medium hover:bg-slate-700">
                                                {sub.label}
                                            </a>
                                        ))}
                                    </div>
                                )
                            }
                            return (
                                <a key={item.label} href="#" onClick={(e) => { e.preventDefault(); handleMenuClick(item); setIsMobileMenuOpen(false); }} className="block px-3 py-2 rounded-md text-base font-medium hover:bg-slate-700">
                                    {item.label}
                                </a>
                            )
                        })}
                    </nav>
                </div>
            )}
        </div>
    );
};

export default PrimaryNavbar;