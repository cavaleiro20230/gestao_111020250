// FIX: Create the main App.tsx component with state management, context providers, and page routing.
// FIX: Import 'useContext' to resolve 'Cannot find name' error.
import React, { useState, createContext, useContext } from 'react';
import useLocalStorage from './hooks/useLocalStorage';
import { ToastProvider, useToast } from './contexts/ToastContext';
import { v4 as uuidv4 } from 'uuid';

import {
    // Types
    Page, User, UserRole, AppContextType, AuthContextType,
    Client, Product, Service, Supplier, Transporter, Seller,
    FundingSource, BudgetItem, ChartOfAccount, AccountPayable,
    AccountReceivable, Contract, Project, ProjectTask, ProjectDeliverable,
    Document, DocumentPermission, DocumentVersion, Personnel, TimesheetEntry,
    CompanyConfig, FiscalConfig, FinancialConfig, OtherConfig, AccountingConfig,
    Batch, Shipment, PurchaseOrder, SalesOrder, Invoice, AuditLog, BankIntegration,
    BankStatementLine, ApprovalWorkflow, ApprovalInstance, HolidayRequest,
    // FIX: Import the new types to be used for state management.
    TravelRequest, PurchaseRequisition,
    OnboardingProcess, PerformanceReview, CustomReport, MaterialRequest, Budget,
    Asset, DepreciationEntry, Grant, ComplianceObligation, Notification,
    AccountingBatch, AccountingEntry, TaskComment
} from './types';

import {
    // Initial Data
    INITIAL_USERS, INITIAL_CLIENTS, INITIAL_PRODUCTS,
    INITIAL_SERVICES, INITIAL_SUPPLIERS, INITIAL_PROJECTS,
    INITIAL_ACCOUNTS_PAYABLE, INITIAL_ACCOUNTS_RECEIVABLE,
    INITIAL_CONTRACTS, INITIAL_DOCUMENTS, INITIAL_PERSONNEL,
    INITIAL_TIMESHEET_ENTRIES, INITIAL_FUNDING_SOURCES,
    INITIAL_BUDGET_ITEMS, INITIAL_CHART_OF_ACCOUNTS, INITIAL_BATCHES,
    INITIAL_SHIPMENTS, INITIAL_PURCHASE_ORDERS, INITIAL_SALES_ORDERS,
    INITIAL_INVOICES, INITIAL_AUDIT_LOGS, INITIAL_BANK_INTEGRATIONS, INITIAL_BANK_STATEMENT_LINES,
    INITIAL_WORKFLOWS, INITIAL_HOLIDAY_REQUESTS, 
    // FIX: Import the new initial data arrays.
    INITIAL_TRAVEL_REQUESTS, INITIAL_PURCHASE_REQUISITIONS,
    INITIAL_ONBOARDING,
    INITIAL_PERFORMANCE_REVIEWS, INITIAL_REPORTS, INITIAL_MATERIAL_REQUESTS,
    INITIAL_BUDGETS, INITIAL_ASSETS, INITIAL_GRANTS, INITIAL_COMPLIANCE_OBLIGATIONS,
    INITIAL_NOTIFICATIONS, INITIAL_ACCOUNTING_BATCHES, INITIAL_ROLE_PERMISSIONS
} from './services/initialData';

// Page Components
import LoginPage from './components/pages/LoginPage';
import DashboardPage from './components/pages/DashboardPage';
import FinancePage from './components/pages/FinancePage';
import ProjectsPage from './components/pages/ProjectsPage';
import RegistrationsPage from './components/pages/RegistrationsPage';
import ConfigurationPage from './components/pages/ConfigurationPage';
import ReportsPage from './components/pages/reports/ReportsPage';
import UnauthorizedPage from './components/pages/UnauthorizedPage';
import ContractsPage from './components/pages/ContractsPage';
import SalesPage from './components/pages/SalesPage';
import PurchasesPage from './components/pages/PurchasesPage';
import WarehousePage from './components/pages/WarehousePage';
import HumanResourcesPage from './components/pages/HumanResourcesPage';
import DocumentsPage from './components/pages/DocumentsPage';
import LogisticsPage from './components/pages/LogisticsPage';
import AssetsPage from './components/pages/AssetsPage';
import AccountingPage from './components/pages/AccountingPage';
import BudgetingPage from './components/pages/BudgetingPage';
import GrantManagementPage from './components/pages/GrantManagementPage';
import ApprovalsPage from './components/pages/ApprovalsPage';
import OKRsPage from './components/pages/OKRsPage';
import SecurityPage from './components/pages/SecurityPage';
import AccountsPayablePage from './components/pages/finance/AccountsPayablePage';
import AccountsReceivablePage from './components/pages/finance/AccountsReceivablePage';
import BillingPage from './components/pages/BillingPage';
import CashFlowReportPage from './components/pages/reports/CashFlowReportPage';
import DREReportPage from './components/pages/reports/DREReportPage';
import CostCenterReportPage from './components/pages/reports/CostCenterReportPage';
import ContractsReportPage from './components/pages/reports/ContractsReportPage';
import AccountabilityReportPage from './components/pages/reports/AccountabilityReportPage';
import ComparativeAnalysisReportPage from './components/pages/reports/ComparativeAnalysisReportPage';
import BalanceSheetReportPage from './components/pages/reports/BalanceSheetReportPage';
import CustomReportBuilderPage from './components/pages/reports/CustomReportBuilderPage';
import CustomReportEditorPage from './components/pages/reports/CustomReportEditorPage';
import CustomReportViewerPage from './components/pages/reports/CustomReportViewerPage';
import ProjectBoardPage from './components/pages/ProjectBoardPage';
import BudgetDetailPage from './components/pages/BudgetDetailPage';
import GrantDetailPage from './components/pages/GrantDetailPage';
import AccountingConfigurationPage from './components/pages/accounting/AccountingConfigurationPage';
import FunderPortalPage from './components/pages/FunderPortalPage';


// Layout Components
import Sidebar from './components/Sidebar';
import PrimaryNavbar from './components/PrimaryNavbar';
import AISearchFab from './components/AISearchFab';
import AISearchModal from './components/AISearchModal';

import { pageAccess } from './config/pageAccess';


export const AppContext = createContext<AppContextType | null>(null);
export const AuthContext = createContext<AuthContextType | null>(null);

const AppContent: React.FC = () => {
    const [activePage, setActivePage] = useLocalStorage<Page>('activePage', Page.Dashboard);
    const [pageContext, setPageContext] = useState<any>(null);

    const [clients, setClients] = useLocalStorage<Client[]>('clients', INITIAL_CLIENTS);
    const [products, setProducts] = useLocalStorage<Product[]>('products', INITIAL_PRODUCTS);
    const [services, setServices] = useLocalStorage<Service[]>('services', INITIAL_SERVICES);
    const [suppliers, setSuppliers] = useLocalStorage<Supplier[]>('suppliers', INITIAL_SUPPLIERS);
    const [transporters, setTransporters] = useLocalStorage<any[]>('transporters', []);
    const [sellers, setSellers] = useLocalStorage<any[]>('sellers', []);
    const [fundingSources, setFundingSources] = useLocalStorage<FundingSource[]>('fundingSources', INITIAL_FUNDING_SOURCES);
    const [budgetItems, setBudgetItems] = useLocalStorage<BudgetItem[]>('budgetItems', INITIAL_BUDGET_ITEMS);
    const [chartOfAccounts, setChartOfAccounts] = useLocalStorage<ChartOfAccount[]>('chartOfAccounts', INITIAL_CHART_OF_ACCOUNTS);
    const [accountsPayable, setAccountsPayable] = useLocalStorage<AccountPayable[]>('accountsPayable', INITIAL_ACCOUNTS_PAYABLE);
    const [accountsReceivable, setAccountsReceivable] = useLocalStorage<AccountReceivable[]>('accountsReceivable', INITIAL_ACCOUNTS_RECEIVABLE);
    const [contracts, setContracts] = useLocalStorage<Contract[]>('contracts', INITIAL_CONTRACTS);
    const [projects, setProjects] = useLocalStorage<Project[]>('projects', INITIAL_PROJECTS);
    const [projectTasks, setProjectTasks] = useLocalStorage<ProjectTask[]>('projectTasks', []);
    const [projectDeliverables, setProjectDeliverables] = useLocalStorage<ProjectDeliverable[]>('projectDeliverables', []);
    const [documents, setDocuments] = useLocalStorage<Document[]>('documents', INITIAL_DOCUMENTS);
    const [personnel, setPersonnel] = useLocalStorage<Personnel[]>('personnel', INITIAL_PERSONNEL);
    const [timesheetEntries, setTimesheetEntries] = useLocalStorage<TimesheetEntry[]>('timesheetEntries', INITIAL_TIMESHEET_ENTRIES);
    const [batches, setBatches] = useLocalStorage<Batch[]>('batches', INITIAL_BATCHES);
    const [shipments, setShipments] = useLocalStorage<Shipment[]>('shipments', INITIAL_SHIPMENTS);
    const [purchaseOrders, setPurchaseOrders] = useLocalStorage<PurchaseOrder[]>('purchaseOrders', INITIAL_PURCHASE_ORDERS);
    const [salesOrders, setSalesOrders] = useLocalStorage<SalesOrder[]>('salesOrders', INITIAL_SALES_ORDERS);
    const [invoices, setInvoices] = useLocalStorage<Invoice[]>('invoices', INITIAL_INVOICES);
    const [auditLogs, setAuditLogs] = useLocalStorage<AuditLog[]>('auditLogs', INITIAL_AUDIT_LOGS);
    const [bankIntegrations, setBankIntegrations] = useLocalStorage<BankIntegration[]>('bankIntegrations', INITIAL_BANK_INTEGRATIONS);
    const [bankStatementLines, setBankStatementLines] = useLocalStorage<BankStatementLine[]>('bankStatementLines', INITIAL_BANK_STATEMENT_LINES);
    const [approvalWorkflows, setApprovalWorkflows] = useLocalStorage<ApprovalWorkflow[]>('approvalWorkflows', INITIAL_WORKFLOWS);
    const [approvalInstances, setApprovalInstances] = useLocalStorage<ApprovalInstance[]>('approvalInstances', []);
    const [holidayRequests, setHolidayRequests] = useLocalStorage<HolidayRequest[]>('holidayRequests', INITIAL_HOLIDAY_REQUESTS);
    // FIX: Add state for travel requests.
    const [travelRequests, setTravelRequests] = useLocalStorage<TravelRequest[]>('travelRequests', INITIAL_TRAVEL_REQUESTS);
    const [onboardingProcesses, setOnboardingProcesses] = useLocalStorage<OnboardingProcess[]>('onboardingProcesses', INITIAL_ONBOARDING);
    const [performanceReviews, setPerformanceReviews] = useLocalStorage<PerformanceReview[]>('performanceReviews', INITIAL_PERFORMANCE_REVIEWS);
    const [customReports, setCustomReports] = useLocalStorage<CustomReport[]>('customReports', INITIAL_REPORTS);
    const [materialRequests, setMaterialRequests] = useLocalStorage<MaterialRequest[]>('materialRequests', INITIAL_MATERIAL_REQUESTS);
    // FIX: Add state for purchase requisitions.
    const [purchaseRequisitions, setPurchaseRequisitions] = useLocalStorage<PurchaseRequisition[]>('purchaseRequisitions', INITIAL_PURCHASE_REQUISITIONS);
    const [budgets, setBudgets] = useLocalStorage<Budget[]>('budgets', INITIAL_BUDGETS);
    const [assets, setAssets] = useLocalStorage<Asset[]>('assets', INITIAL_ASSETS);
    const [depreciationHistory, setDepreciationHistory] = useLocalStorage<DepreciationEntry[]>('depreciationHistory', []);
    const [grants, setGrants] = useLocalStorage<Grant[]>('grants', INITIAL_GRANTS);
    const [complianceObligations, setComplianceObligations] = useLocalStorage<ComplianceObligation[]>('complianceObligations', INITIAL_COMPLIANCE_OBLIGATIONS);
    const [notifications, setNotifications] = useLocalStorage<Notification[]>('notifications', INITIAL_NOTIFICATIONS);
    const [accountingBatches, setAccountingBatches] = useLocalStorage<AccountingBatch[]>('accountingBatches', INITIAL_ACCOUNTING_BATCHES);
    const [rolePermissions, setRolePermissions] = useLocalStorage<Record<UserRole, Page[]>>('rolePermissions', INITIAL_ROLE_PERMISSIONS);


    const [companyConfig, setCompanyConfig] = useLocalStorage<CompanyConfig>('companyConfig', { name: 'FEMAR', cnpj: '00.000.000/0001-00', address: 'Rua Exemplo, 123', phone: '(99) 99999-9999', email: 'contato@femar.com' });
    const [fiscalConfig, setFiscalConfig] = useLocalStorage<FiscalConfig>('fiscalConfig', { taxRegime: 'Lucro Presumido', icmsRate: 18, pisCofinsRate: 3.65, enableNfse: true });
    const [financialConfig, setFinancialConfig] = useLocalStorage<FinancialConfig>('financialConfig', { lateFeeInterest: 1, lateFeeFine: 2, dueNotificationDays: 5, contractAdjustmentIndex: 'IGP-M', allowPartialPayment: true });
    const [otherConfig, setOtherConfig] = useLocalStorage<OtherConfig>('otherConfig', { paymentConditions: ['30 dias', '30/60 dias', 'À Vista'], costCenters: ['Administrativo', 'Projeto A', 'Projeto B'], enableAutomaticBackup: true });
    const [accountingConfig, setAccountingConfig] = useLocalStorage<AccountingConfig>('accountingConfig', {
        closingDate: '2023-12-31',
        payableDebitAccountId: 'acc-d-1',
        payableCreditAccountId: 'acc-a-1',
        receivableDebitAccountId: 'acc-a-1',
        receivableCreditAccountId: 'acc-r-1',
        payableCategoryMappings: []
    });

    const authContext = useContext(AuthContext);
    const { showToast } = useToast();
    const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
    
    // Page Mappings for AI Commands
    const pageMappings: Record<string, Page> = {
        'Dashboard': Page.Dashboard,
        'Financeiro': Page.Finance,
        'Projetos': Page.Projects,
        'Cadastros': Page.Registrations,
    };

    const addAuditLog = (action: AuditLog['action'], entity: string, details: string, entityId?: string) => {
        const newLog: AuditLog = {
            id: uuidv4(),
            timestamp: new Date().toISOString(),
            userId: authContext?.user?.id || 'system',
            userName: authContext?.user?.name || 'Sistema',
            action,
            entity,
            entityId,
            details,
        };
        setAuditLogs(prev => [newLog, ...prev]);
    }
    
    // Generic CRUD handlers
    const createCrudHandlers = <T extends { id: string }>(
        state: T[],
        setter: React.Dispatch<React.SetStateAction<T[]>>,
        entityName: string
    ) => {
        const handleSave = (item: T) => {
            const isNew = !state.some(i => i.id === item.id);
            if (isNew) {
                const newItem = { ...item, id: item.id || uuidv4() };
                setter(prev => [...prev, newItem]);
                addAuditLog('create', entityName, `Criou ${entityName}: ${ (newItem as any).name || newItem.id}`);
                showToast(`${entityName} salvo com sucesso!`, 'success');
            } else {
                setter(prev => prev.map(i => (i.id === item.id ? item : i)));
                addAuditLog('update', entityName, `Atualizou ${entityName}: ${(item as any).name || item.id}`, item.id);
                showToast(`${entityName} atualizado com sucesso!`, 'success');
            }
        };

        const handleDelete = (id: string) => {
            const item = state.find(i => i.id === id);
            setter(prev => prev.filter(i => i.id !== id));
            addAuditLog('delete', entityName, `Excluiu ${entityName}: ${(item as any)?.name || id}`, id);
            showToast(`${entityName} excluído com sucesso!`, 'success');
        };

        return { handleSave, handleDelete };
    };

    const handleSetActivePage = (page: Page, contextData?: any) => {
        setActivePage(page);
        setPageContext(contextData);
    };

    const handleUpdateRolePermissions = (role: UserRole, page: Page, hasAccess: boolean) => {
        if (role === 'admin') return; // Admin permissions cannot be changed

        setRolePermissions(prev => {
            const currentPermissions = prev[role] || [];
            let newPermissions;

            if (hasAccess) {
                if (!currentPermissions.includes(page)) {
                    newPermissions = [...currentPermissions, page];
                } else {
                    newPermissions = currentPermissions;
                }
            } else {
                newPermissions = currentPermissions.filter(p => p !== page);
            }
            return { ...prev, [role]: newPermissions };
        });
        showToast(`Permissões para ${role} atualizadas.`, 'success');
    };

    
    // Auth Check
    const userRole = authContext?.user?.role;
    const canAccess = userRole === 'admin' || (userRole && rolePermissions[userRole]?.includes(activePage));
    
    const { handleSave: handleSaveClient, handleDelete: handleDeleteClient } = createCrudHandlers(clients, setClients, 'Cliente');
    const { handleSave: handleSaveProduct, handleDelete: handleDeleteProduct } = createCrudHandlers(products, setProducts, 'Produto');
    const { handleSave: handleSaveService, handleDelete: handleDeleteService } = createCrudHandlers(services, setServices, 'Serviço');
    const { handleSave: handleSaveSupplier, handleDelete: handleDeleteSupplier } = createCrudHandlers(suppliers, setSuppliers, 'Fornecedor');
    const { handleSave: handleSaveTransporter, handleDelete: handleDeleteTransporter } = createCrudHandlers(transporters, setTransporters, 'Transportadora');
    const { handleSave: handleSaveSeller, handleDelete: handleDeleteSeller } = createCrudHandlers(sellers, setSellers, 'Vendedor');
    const { handleSave: handleSaveFundingSource, handleDelete: handleDeleteFundingSource } = createCrudHandlers(fundingSources, setFundingSources, 'Fonte de Recurso');
    const { handleSave: handleSaveBudgetItem, handleDelete: handleDeleteBudgetItem } = createCrudHandlers(budgetItems, setBudgetItems, 'Rubrica Orçamentária');
    const { handleSave: handleSaveChartOfAccount, handleDelete: handleDeleteChartOfAccount } = createCrudHandlers(chartOfAccounts, setChartOfAccounts, 'Plano de Contas');
    const { handleSave: handleSaveContract, handleDelete: handleDeleteContract } = createCrudHandlers(contracts, setContracts, 'Contrato');
    const { handleSave: handleSaveProject, handleDelete: handleDeleteProject } = createCrudHandlers(projects, setProjects, 'Projeto');
    const { handleSave: handleSaveProjectTask, handleDelete: handleDeleteProjectTask } = createCrudHandlers(projectTasks, setProjectTasks, 'Tarefa de Projeto');
    const { handleSave: handleSaveProjectDeliverable, handleDelete: handleDeleteProjectDeliverable } = createCrudHandlers(projectDeliverables, setProjectDeliverables, 'Entrega de Projeto');
    const { handleSave: handleSaveDocument, handleDelete: handleDeleteDocument } = createCrudHandlers(documents, setDocuments, 'Documento');
    const { handleSave: handleSaveUser, handleDelete: handleDeleteUser } = createCrudHandlers(authContext.users, authContext.setUsers, 'Usuário');
    const { handleSave: handleSavePersonnel, handleDelete: handleDeletePersonnel } = createCrudHandlers(personnel, setPersonnel, 'Membro da Equipe');
    const { handleSave: handleSaveTimesheetEntry, handleDelete: handleDeleteTimesheetEntry } = createCrudHandlers(timesheetEntries, setTimesheetEntries, 'Apontamento de Horas');
    const { handleSave: handleSaveBatch, handleDelete: handleDeleteBatch } = createCrudHandlers(batches, setBatches, 'Lote');
    const { handleSave: handleSaveShipment, handleDelete: handleDeleteShipment } = createCrudHandlers(shipments, setShipments, 'Remessa');
    const { handleSave: handleSavePurchaseOrder, handleDelete: handleDeletePurchaseOrder } = createCrudHandlers(purchaseOrders, setPurchaseOrders, 'Ordem de Compra');
    const { handleSave: handleSaveSalesOrder, handleDelete: handleDeleteSalesOrder } = createCrudHandlers(salesOrders, setSalesOrders, 'Ordem de Venda');
    const { handleSave: handleSaveWorkflow, handleDelete: handleDeleteWorkflow } = createCrudHandlers(approvalWorkflows, setApprovalWorkflows, 'Workflow de Aprovação');
    const { handleSave: handleSaveHolidayRequest, handleDelete: handleDeleteHolidayRequest } = createCrudHandlers(holidayRequests, setHolidayRequests, 'Solicitação de Férias');
    const { handleSave: handleSaveTravelRequest, handleDelete: handleDeleteTravelRequest } = createCrudHandlers(travelRequests, setTravelRequests, 'Solicitação de Viagem');
    const { handleSave: handleSaveOnboardingProcess, handleDelete: handleDeleteOnboardingProcess } = createCrudHandlers(onboardingProcesses, setOnboardingProcesses, 'Processo de On/Offboarding');
    const { handleSave: handleSavePerformanceReview, handleDelete: handleDeletePerformanceReview } = createCrudHandlers(performanceReviews, setPerformanceReviews, 'Avaliação de Desempenho');
    const { handleSave: handleSaveCustomReport, handleDelete: handleDeleteCustomReport } = createCrudHandlers(customReports, setCustomReports, 'Relatório Personalizado');
    const { handleSave: handleSaveMaterialRequest, handleDelete: handleDeleteMaterialRequest } = createCrudHandlers(materialRequests, setMaterialRequests, 'Requisição de Material');
    const { handleSave: handleSavePurchaseRequisition, handleDelete: handleDeletePurchaseRequisition } = createCrudHandlers(purchaseRequisitions, setPurchaseRequisitions, 'Solicitação de Compra');
    const { handleSave: handleSaveBudget, handleDelete: handleDeleteBudget } = createCrudHandlers(budgets, setBudgets, 'Orçamento');
    const { handleSave: handleSaveAsset, handleDelete: handleDeleteAsset } = createCrudHandlers(assets, setAssets, 'Ativo');
    const { handleSave: handleSaveGrant, handleDelete: handleDeleteGrant } = createCrudHandlers(grants, setGrants, 'Convênio');
    const { handleSave: handleSaveComplianceObligation, handleDelete: handleDeleteComplianceObligation } = createCrudHandlers(complianceObligations, setComplianceObligations, 'Obrigação de Compliance');
    const { handleSave: handleSaveAccountingBatch, handleDelete: handleDeleteAccountingBatch } = createCrudHandlers(accountingBatches, setAccountingBatches, 'Lote Contábil');
    

    const handleSaveAccountPayable = (account: AccountPayable, paymentDate: string) => {
        const updatedAccount = { ...account, paymentDate: account.status === 'Pago' ? paymentDate : undefined };
        createCrudHandlers(accountsPayable, setAccountsPayable, 'Conta a Pagar').handleSave(updatedAccount);
    };

    const handleDeleteAccountPayable = (id: string) => createCrudHandlers(accountsPayable, setAccountsPayable, 'Conta a Pagar').handleDelete(id);

    const handleSaveAccountReceivable = (account: AccountReceivable, paymentDate: string) => {
        const updatedAccount = { ...account, paymentDate: account.status === 'Pago' ? paymentDate : undefined };
        createCrudHandlers(accountsReceivable, setAccountsReceivable, 'Conta a Receber').handleSave(updatedAccount);
    };

    const handleDeleteAccountReceivable = (id: string) => createCrudHandlers(accountsReceivable, setAccountsReceivable, 'Conta a Receber').handleDelete(id);
    
    const handleApproveTimesheetEntry = (id: string) => {
        setTimesheetEntries(prev => prev.map(e => e.id === id ? { ...e, status: 'Aprovado' } : e));
        addAuditLog('status_change', 'Apontamento de Horas', `Aprovou apontamento ${id}`, id);
    };

    const handleGenerateInvoiceFromSalesOrder = (orderId: string) => {
        const order = salesOrders.find(o => o.id === orderId);
        if (!order) {
            showToast('Ordem de venda não encontrada.', 'error');
            return;
        }

        const newInvoice: Invoice = {
            id: uuidv4(),
            invoiceNumber: new Date().getFullYear() * 10000 + (invoices.length + 1),
            clientId: order.clientId,
            clientName: order.clientName,
            issueDate: new Date().toISOString().split('T')[0],
            dueDate: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0], // 30 days default
            items: order.items.map(item => ({
                id: uuidv4(),
                description: item.itemName,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                total: item.quantity * item.unitPrice
            })),
            totalValue: order.totalValue,
            status: 'Pendente',
            sourceType: 'salesOrder',
            sourceId: order.id,
        };
        
        const newAccountReceivable: AccountReceivable = {
            id: uuidv4(),
            description: `Fatura #${newInvoice.invoiceNumber} - ${order.clientName}`,
            category: 'Receita de Venda',
            value: newInvoice.totalValue,
            dueDate: newInvoice.dueDate,
            status: 'Aberto',
            reconciled: false,
            invoiceId: newInvoice.id,
        };

        setInvoices(prev => [...prev, newInvoice]);
        setSalesOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'Faturado' } : o));
        setAccountsReceivable(prev => [...prev, newAccountReceivable]);

        addAuditLog('create', 'Fatura', `Gerou fatura #${newInvoice.invoiceNumber} da OV #${order.orderNumber}`, newInvoice.id);
        showToast(`Fatura #${newInvoice.invoiceNumber} gerada com sucesso!`, 'success');
    };

    const handleUpdateInvoiceStatus = (invoiceId: string, status: Invoice['status']) => {
        setInvoices(prev => prev.map(inv => {
            if (inv.id === invoiceId) {
                // Update corresponding Account Receivable
                setAccountsReceivable(ars => ars.map(ar => {
                    if (ar.invoiceId === invoiceId) {
                        return { 
                            ...ar, 
                            status: status === 'Paga' ? 'Pago' : (status === 'Cancelada' ? 'Vencido' : 'Aberto'), // simplified
                            paymentDate: status === 'Paga' ? new Date().toISOString().split('T')[0] : undefined
                        };
                    }
                    return ar;
                }));
                addAuditLog('status_change', 'Fatura', `Alterou status da fatura #${inv.invoiceNumber} para ${status}`, inv.id);
                return { ...inv, status };
            }
            return inv;
        }));
        showToast(`Status da fatura alterado para ${status}.`, 'success');
    };

    const handleAddTaskComment = (taskId: string, authorId: string, content: string) => {
        const author = authContext.users.find(u => u.id === authorId);
        if (!author) return;
        const newComment: TaskComment = {
            id: uuidv4(),
            taskId,
            authorId,
            authorName: author.name,
            content,
            createdAt: new Date().toISOString(),
        };
        setProjectTasks(prev => prev.map(task => 
            task.id === taskId ? { ...task, comments: [...(task.comments || []), newComment] } : task
        ));
    };

    const handleUpdatePermissions = (docId: string, permissions: DocumentPermission[]) => {
        setDocuments(prev => prev.map(doc => doc.id === docId ? { ...doc, permissions } : doc));
        addAuditLog('update', 'Documento', `Atualizou permissões do documento ${docId}`, docId);
    };

    const handleUploadNewVersion = (docId: string, uploader: User, changeNotes: string, newContent: string) => {
        setDocuments(prev => prev.map(doc => {
            if (doc.id === docId) {
                const newVersionNumber = doc.versions.length + 1;
                const newVersion: DocumentVersion = {
                    id: uuidv4(),
                    versionNumber: newVersionNumber,
                    uploaderId: uploader.id,
                    uploaderName: uploader.name,
                    uploadDate: new Date().toISOString(),
                    changeNotes,
                    content: newContent,
                };
                return { ...doc, content: newContent, versions: [...doc.versions, newVersion] };
            }
            return doc;
        }));
        addAuditLog('update', 'Documento', `Nova versão (${docId})`, docId);
    };
    
    const handleConnectBank = (bankName: string) => {
        const newIntegration: BankIntegration = { id: uuidv4(), bankName, status: 'connected', lastSync: new Date().toISOString() };
        setBankIntegrations(prev => [...prev, newIntegration]);
        addAuditLog('create', 'Integração Bancária', `Conectou ${bankName}`);
        showToast(`${bankName} conectado com sucesso!`, 'success');
    };

    const handleSyncBank = (integrationId: string) => {
        setBankIntegrations(prev => prev.map(i => i.id === integrationId ? { ...i, status: 'syncing' } : i));
        addAuditLog('update', 'Integração Bancária', `Iniciou sincronização para ${integrationId}`);
        setTimeout(() => {
            setBankIntegrations(prev => prev.map(i => i.id === integrationId ? { ...i, status: 'connected', lastSync: new Date().toISOString() } : i));
            showToast('Sincronização concluída!', 'success');
        }, 2000);
    };
    
    const handleReconcileTransactions = (statementLineIds: string[], systemTrans: { type: 'ap' | 'ar', id: string }[]) => {
        setBankStatementLines(prev => prev.map(l => statementLineIds.includes(l.id) ? { ...l, reconciled: true } : l));
        
        const apIds = systemTrans.filter(t => t.type === 'ap').map(t => t.id);
        const arIds = systemTrans.filter(t => t.type === 'ar').map(t => t.id);

        setAccountsPayable(prev => prev.map(t => apIds.includes(t.id) ? { ...t, reconciled: true } : t));
        setAccountsReceivable(prev => prev.map(t => arIds.includes(t.id) ? { ...t, reconciled: true } : t));
        
        addAuditLog('update', 'Conciliação Bancária', `Conciliou ${statementLineIds.length} transações.`);
        showToast('Transações reconciliadas!', 'success');
    };

    const handleProcessApproval = (instanceId: string, status: 'approved' | 'rejected', notes?: string) => {
        setApprovalInstances(prev => prev.map(instance => {
            if (instance.id === instanceId) {
                const newStepStates = [...instance.stepStates];
                newStepStates[instance.currentStep] = {
                    ...newStepStates[instance.currentStep],
                    status,
                    notes,
                    processedBy: authContext?.user?.name,
                    processedAt: new Date().toISOString(),
                };
                
                const isFinalStep = instance.currentStep === instance.stepStates.length - 1;
                const newInstanceStatus = status === 'rejected' ? 'rejected' : (isFinalStep ? 'approved' : 'pending');
                const newCurrentStep = status === 'approved' && !isFinalStep ? instance.currentStep + 1 : instance.currentStep;

                // Update original entity status
                if (newInstanceStatus === 'approved' || newInstanceStatus === 'rejected') {
                    if (instance.entity === 'MaterialRequest') {
                        setMaterialRequests(reqs => reqs.map(r => r.id === instance.entityId ? { ...r, status: newInstanceStatus === 'approved' ? 'Aprovada' : 'Rejeitada' } : r));
                    }
                }
                
                return { ...instance, status: newInstanceStatus, currentStep: newCurrentStep, stepStates: newStepStates };
            }
            return instance;
        }));
        showToast(`Item ${status === 'approved' ? 'aprovado' : 'rejeitado'}.`, 'success');
    };

    const handleUpdateHolidayRequestStatus = (id: string, newStatus: 'Aprovado' | 'Rejeitado', approver: User, notes?: string) => {
        setHolidayRequests(prev => prev.map(r => r.id === id ? { ...r, status: newStatus, approverId: approver.id, approverName: approver.name, approverNotes: notes } : r));
    };

    const handleUpdateMaterialRequestStatus = (id: string, newStatus: 'Aprovada' | 'Rejeitada' | 'Atendida') => {
        setMaterialRequests(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
    };

    // FIX: Add handler for Purchase Requisition status update, resolving 'Cannot find name' error.
    const handleUpdatePurchaseRequisitionStatus = (id: string, newStatus: 'Aprovada' | 'Rejeitada' | 'Concluída') => {
        setPurchaseRequisitions(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
    };

    // FIX: Add handler for Travel Request status update.
    const handleUpdateTravelRequestStatus = (id: string, newStatus: TravelRequest['status']) => {
        setTravelRequests(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
    };

    const handleRunDepreciation = (yearMonth: string) => {
        const [year, month] = yearMonth.split('-').map(Number);
        const upToDate = new Date(year, month, 0); // Last day of selected month
        let newEntries: DepreciationEntry[] = [];

        assets.filter(a => a.depreciationMethod === 'linear' && a.usefulLifeMonths > 0).forEach(asset => {
            const lastDepreciationDate = new Date(
                Math.max(
                    ...depreciationHistory
                        .filter(e => e.assetId === asset.id)
                        .map(e => new Date(e.date).getTime()),
                    new Date(asset.acquisitionDate).getTime()
                )
            );
            
            let currentDate = new Date(lastDepreciationDate.getFullYear(), lastDepreciationDate.getMonth() + 1, 1);
            let currentBookValue = depreciationHistory.find(e=>e.assetId === asset.id)?.bookValueAfter ?? asset.value;

            while (currentDate <= upToDate) {
                const monthlyDepreciation = (asset.value - asset.salvageValue) / asset.usefulLifeMonths;
                
                if (currentBookValue > asset.salvageValue) {
                    const depreciationAmount = Math.min(monthlyDepreciation, currentBookValue - asset.salvageValue);
                    currentBookValue -= depreciationAmount;

                    newEntries.push({
                        id: uuidv4(),
                        assetId: asset.id,
                        date: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).toISOString(),
                        amount: depreciationAmount,
                        bookValueAfter: currentBookValue,
                    });
                }
                currentDate.setMonth(currentDate.getMonth() + 1);
            }
        });

        if (newEntries.length > 0) {
            setDepreciationHistory(prev => [...prev, ...newEntries]);
            showToast(`${newEntries.length} lançamentos de depreciação foram gerados.`, 'success');
        } else {
            showToast('Nenhum novo lançamento de depreciação a ser gerado.', 'info');
        }
    };
    
    const handleNotificationClick = (notificationId: string, link?: { page: Page; context?: any }) => {
        setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, read: true } : n));
        if (link) {
            setActivePage(link.page, link.context);
        }
    };

    const handleProcessAccountingBatch = (id: string) => {
        setAccountingBatches(prev => prev.map(b => b.id === id ? { ...b, status: 'Contabilizado' } : b));
        addAuditLog('processed', 'Lote Contábil', `Contabilizou lote ${id}`, id);
    };

    const handleReverseAccountingBatch = (id: string) => {
        setAccountingBatches(prev => prev.map(b => b.id === id ? { ...b, status: 'Revertido' } : b));
        addAuditLog('status_change', 'Lote Contábil', `Reverteu lote ${id}`, id);
    };

    const handleExecuteFunctionCall = async (call: any): Promise<{success: boolean, message: string}> => {
        switch(call.name) {
            case 'navigateToPage':
                const pageName = call.args.pageName;
                if (pageName in pageMappings) {
                    setActivePage(pageMappings[pageName]);
                    return { success: true, message: `Navegando para ${pageName}.`};
                }
                return { success: false, message: `Página ${pageName} não encontrada.` };
            case 'createTask':
                 const project = projects.find(p => p.name.toLowerCase() === call.args.projectName.toLowerCase());
                if (project) {
                    const newTask: ProjectTask = {
                        id: uuidv4(),
                        projectId: project.id,
                        title: call.args.title,
                        description: `Criado por IA em ${new Date().toLocaleDateString()}`,
                        status: 'A Fazer',
                        dueDate: call.args.dueDate,
                        attachments: [],
                        comments: [],
                    };
                    handleSaveProjectTask(newTask);
                    return { success: true, message: `Tarefa "${call.args.title}" criada no projeto ${project.name}.` };
                }
                return { success: false, message: `Projeto ${call.args.projectName} não encontrado.` };
             case 'findProject':
                 const foundProject = projects.find(p => p.name.toLowerCase() === call.args.projectName.toLowerCase());
                 if (foundProject) {
                     setActivePage(Page.ProjectBoard, { projectId: foundProject.id });
                     return { success: true, message: `Abrindo detalhes do projeto ${foundProject.name}.` };
                 }
                return { success: false, message: `Projeto ${call.args.projectName} não encontrado.` };
            default:
                return { success: false, message: `Função ${call.name} não reconhecida.` };
        }
    };


    const pageMap: Record<Page, React.FC> = {
        [Page.Login]: LoginPage, // Should not be rendered here, handled separately
        [Page.Dashboard]: DashboardPage,
        [Page.Finance]: FinancePage,
        [Page.Projects]: ProjectsPage,
        [Page.ProjectBoard]: ProjectBoardPage,
        [Page.Registrations]: RegistrationsPage,
        [Page.Configuration]: ConfigurationPage,
        [Page.Reports]: ReportsPage,
        [Page.Unauthorized]: UnauthorizedPage,
        [Page.Contracts]: ContractsPage,
        [Page.Sales]: SalesPage,
        [Page.Purchases]: PurchasesPage,
        [Page.Warehouse]: WarehousePage,
        [Page.HumanResources]: HumanResourcesPage,
        [Page.Documents]: DocumentsPage,
        [Page.Logistics]: LogisticsPage,
        [Page.Assets]: AssetsPage,
        [Page.Accounting]: AccountingPage,
        [Page.Budgeting]: BudgetingPage,
        [Page.GrantManagement]: GrantManagementPage,
        [Page.Approvals]: ApprovalsPage,
        [Page.OKRs]: OKRsPage,
        [Page.Security]: SecurityPage,
        [Page.AccountsPayable]: AccountsPayablePage,
        [Page.AccountsReceivable]: AccountsReceivablePage,
        [Page.Billing]: BillingPage,
        [Page.CashFlowReport]: CashFlowReportPage,
        [Page.DREReport]: DREReportPage,
        [Page.CostCenterReport]: CostCenterReportPage,
        [Page.ContractsReport]: ContractsReportPage,
        [Page.AccountabilityReport]: AccountabilityReportPage,
        [Page.ComparativeAnalysisReport]: ComparativeAnalysisReportPage,
        [Page.BalanceSheetReport]: BalanceSheetReportPage,
        [Page.CustomReportBuilder]: CustomReportBuilderPage,
        [Page.CustomReportEditor]: CustomReportEditorPage,
        [Page.CustomReportViewer]: CustomReportViewerPage,
        [Page.ProjectDetail]: ProjectBoardPage, // Alias for ProjectBoard
        [Page.BudgetDetail]: BudgetDetailPage,
        [Page.GrantDetail]: GrantDetailPage,
        [Page.AccountingConfiguration]: AccountingConfigurationPage,
        [Page.FunderPortal]: FunderPortalPage,
        // Legacy/Unused - map to prevent crashes
        [Page.Clients]: RegistrationsPage,
        // FIX: Add missing pages to the pageMap to resolve routing errors.
        [Page.Products]: RegistrationsPage,
        [Page.Services]: RegistrationsPage,
        [Page.Suppliers]: RegistrationsPage,
        [Page.Personnel]: HumanResourcesPage,
    };
    
    const PageToRender = canAccess ? (pageMap[activePage] || DashboardPage) : UnauthorizedPage;
    
    const contextValue: AppContextType = {
        activePage, pageContext, clients, products, services, suppliers, transporters, sellers, fundingSources, budgetItems, chartOfAccounts,
        accountsPayable, accountsReceivable, contracts, projects, projectTasks, projectDeliverables, documents, users: authContext.users,
        personnel, timesheetEntries, batches, shipments, purchaseOrders, salesOrders, invoices, auditLogs, bankIntegrations, bankStatementLines,
        approvalWorkflows, approvalInstances, holidayRequests, travelRequests, onboardingProcesses, performanceReviews, customReports,
        materialRequests, purchaseRequisitions, budgets, assets, depreciationHistory, grants, complianceObligations, notifications, accountingBatches,
        companyConfig, fiscalConfig, financialConfig, otherConfig, accountingConfig, pageMappings, rolePermissions,
        
        setActivePage: handleSetActivePage,
        handleSaveClient, handleDeleteClient, handleSaveProduct, handleDeleteProduct, handleSaveService, handleDeleteService,
        handleSaveSupplier, handleDeleteSupplier, handleSaveTransporter, handleDeleteTransporter, handleSaveSeller, handleDeleteSeller,
        handleSaveFundingSource, handleDeleteFundingSource, handleSaveBudgetItem, handleDeleteBudgetItem, handleSaveChartOfAccount, handleDeleteChartOfAccount,
        handleSaveAccountPayable, handleDeleteAccountPayable, handleSaveAccountReceivable, handleDeleteAccountReceivable,
        handleSaveContract, handleDeleteContract, handleSaveProject, handleDeleteProject,
        handleSaveProjectTask, handleDeleteProjectTask, handleSaveProjectDeliverable, handleDeleteProjectDeliverable,
        handleSaveDocument, handleDeleteDocument, handleSaveUser, handleDeleteUser,
        handleSavePersonnel, handleDeletePersonnel, handleSaveTimesheetEntry, handleDeleteTimesheetEntry, handleApproveTimesheetEntry,
        handleSaveBatch, handleDeleteBatch, handleSaveShipment, handleDeleteShipment,
        handleSavePurchaseOrder, handleDeletePurchaseOrder, handleSaveSalesOrder, handleDeleteSalesOrder,
        handleGenerateInvoiceFromSalesOrder, handleUpdateInvoiceStatus,
        handleAddTaskComment, handleUpdatePermissions, handleUploadNewVersion,
        handleConnectBank, handleSyncBank, handleReconcileTransactions,
        handleSaveWorkflow, handleDeleteWorkflow, handleProcessApproval,
        handleSaveHolidayRequest, handleDeleteHolidayRequest, handleUpdateHolidayRequestStatus,
        handleSaveTravelRequest, handleDeleteTravelRequest, handleUpdateTravelRequestStatus,
        handleSaveOnboardingProcess, handleDeleteOnboardingProcess, handleSavePerformanceReview, handleDeletePerformanceReview,
        handleSaveCustomReport, handleDeleteCustomReport,
        handleSaveMaterialRequest, handleDeleteMaterialRequest, handleUpdateMaterialRequestStatus,
        handleSavePurchaseRequisition, handleDeletePurchaseRequisition, handleUpdatePurchaseRequisitionStatus,
        handleSaveBudget, handleDeleteBudget,
        handleSaveAsset, handleDeleteAsset, handleRunDepreciation,
        handleSaveGrant, handleDeleteGrant,
        handleSaveComplianceObligation, handleDeleteComplianceObligation,
        handleNotificationClick,
        handleSaveAccountingBatch, handleDeleteAccountingBatch, handleProcessAccountingBatch, handleReverseAccountingBatch,
        handleSaveCompanyConfig: setCompanyConfig,
        handleSaveFiscalConfig: setFiscalConfig,
        handleSaveFinancialConfig: setFinancialConfig,
        handleSaveOtherConfig: setOtherConfig,
        handleSaveAccountingConfig: setAccountingConfig,
        handleUpdateRolePermissions,
        handleExecuteFunctionCall
    };

    if (!authContext.user) {
        return <LoginPage />;
    }
    
    if (authContext.user.role === 'funder') {
        return (
            <AppContext.Provider value={contextValue}>
                <FunderPortalPage />
            </AppContext.Provider>
        );
    }

    return (
        <AppContext.Provider value={contextValue}>
            <div className="flex flex-col h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200">
                <PrimaryNavbar onSearchClick={() => setIsSearchModalOpen(true)} />
                <main className="flex-1 overflow-y-auto">
                    <PageToRender />
                </main>
                <AISearchFab onSearchClick={() => setIsSearchModalOpen(true)} />
                {isSearchModalOpen && <AISearchModal onClose={() => setIsSearchModalOpen(false)} />}
            </div>
        </AppContext.Provider>
    );
};


const App: React.FC = () => {
    const [users, setUsers] = useLocalStorage<User[]>('users', INITIAL_USERS);
    const [currentUser, setCurrentUser] = useLocalStorage<User | null>('currentUser', null);
    
    const login = (email: string, pass: string): 'success' | 'invalid' | 'blocked' => {
        const user = users.find(u => u.email === email && u.password === pass);
        if (user) {
            if (user.status === 'blocked') {
                return 'blocked';
            }
            setCurrentUser(user);
            return 'success';
        }
        return 'invalid';
    };
    
    const logout = () => {
        setCurrentUser(null);
    };

    return (
        <ToastProvider>
            <AuthContext.Provider value={{ user: currentUser, login, logout, users, setUsers }}>
                <AppContent />
            </AuthContext.Provider>
        </ToastProvider>
    );
};

export default App;