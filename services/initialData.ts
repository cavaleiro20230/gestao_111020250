// FIX: Create initialData.ts to provide mock data for the application.
import { v4 as uuidv4 } from 'uuid';
import {
    User, Client, Product, Service, Supplier, Project, AccountPayable,
    AccountReceivable, Contract, Document, Personnel, TimesheetEntry,
    FundingSource, BudgetItem, ChartOfAccount, Batch, Shipment,
    PurchaseOrder, SalesOrder, AuditLog, BankIntegration, BankStatementLine,
    ApprovalWorkflow, HolidayRequest, OnboardingProcess, PerformanceReview,
    CustomReport, MaterialRequest, Budget, Asset, Grant, ComplianceObligation, Notification,
    AccountingBatch, Invoice,
    // FIX: Import the new types to be used in initial data arrays.
    TravelRequest, PurchaseRequisition,
    UserRole, Page, USER_ROLES
} from '../types';
import { pageAccess } from '../config/pageAccess';


export const INITIAL_USERS: User[] = [
    { id: 'user-1', name: 'Alice Admin', email: 'admin@femar.com', password: 'password', role: 'admin', position: 'Administradora', department: 'Administrativo', type: 'internal', status: 'active' },
    { id: 'user-2', name: 'Beatriz Finanças', email: 'finance@femar.com', password: 'password', role: 'finance', position: 'Analista Financeira', department: 'Financeiro', type: 'internal', status: 'active' },
    { id: 'user-3', name: 'Carlos Gerente', email: 'project@femar.com', password: 'password', role: 'project_manager', position: 'Gerente de Projetos', department: 'Projetos', type: 'internal', status: 'active' },
    { id: 'user-4', name: 'Daniel Superintendente', email: 'super@femar.com', password: 'password', role: 'superintendent', position: 'Superintendente', department: 'Diretoria', type: 'internal', status: 'active' },
    { id: 'user-5', name: 'Eduarda Coordenadora', email: 'coord@femar.com', password: 'password', role: 'coordinator', position: 'Coordenadora de Ensino', department: 'Ensino', type: 'internal', status: 'active' },
    { id: 'user-6', name: 'Fábio Fiscal', email: 'fiscal@femar.com', password: 'password', role: 'inspector', position: 'Fiscal de Contrato', department: 'Projetos', type: 'internal', status: 'active' },
    { id: 'user-7', name: 'Gabriel Colaborador', email: 'colab@femar.com', password: 'password', role: 'employee', position: 'Pesquisador', department: 'Técnica', type: 'internal', status: 'active' },
    { id: 'user-8', name: 'Helena FAP', email: 'helena@fap.org.br', password: 'fap', role: 'funder', position: 'Analista de Fomento', department: 'FAP', clientId: 'client-2', type: 'external', status: 'active' },
];

export const INITIAL_CLIENTS: Client[] = [
    { id: 'client-1', name: 'Petrobras', email: 'contato@petrobras.com.br', phone: '(21) 3224-4477', cnpj: '33.000.167/0001-01' },
    { id: 'client-2', name: 'Fundação de Amparo à Pesquisa (FAP)', email: 'fomento@fap.org.br', phone: '(92) 1234-5678', cnpj: '04.389.897/0001-57' },
];

export const INITIAL_PRODUCTS: Product[] = [
    { id: 'prod-1', name: 'Reagente Químico Alfa', category: 'Químicos', price: 150.75, stock: 100 },
    { id: 'prod-2', name: 'Placa de Petri (100 un.)', category: 'Laboratório', price: 80.00, stock: 50 },
    { id: 'prod-3', name: 'Notebook Dell Vostro', category: 'Equipamentos', price: 4500.00, stock: 5 },
];

export const INITIAL_SERVICES: Service[] = [
    { id: 'serv-1', name: 'Análise de Amostra de Água', category: 'Análises', price: 500.00 },
    { id: 'serv-2', name: 'Consultoria Ambiental', category: 'Consultoria', price: 2000.00 },
];

export const INITIAL_SUPPLIERS: Supplier[] = [
    { id: 'sup-1', name: 'ABC Químicos Ltda.', contactPerson: 'Roberto', email: 'vendas@abcquimicos.com', phone: '(11) 5555-1234' },
    { id: 'sup-2', name: 'Info Equipamentos', contactPerson: 'Mariana', email: 'comercial@infoequip.com.br', phone: '(11) 5555-5678' },
];

export const INITIAL_PROJECTS: Project[] = [
    { id: 'proj-1', name: 'Monitoramento Ambiental Bacia Amazônica', clientId: 'client-1', clientName: 'Petrobras', managerId: 'user-3', managerName: 'Carlos Gerente', startDate: '2023-01-15', endDate: '2024-12-20', budget: 1500000, status: 'Ativo', scope: 'Realizar monitoramento contínuo...' },
    { id: 'proj-2', name: 'Desenvolvimento de Novo Biocomposto', clientId: 'client-2', clientName: 'Fundação de Amparo à Pesquisa (FAP)', managerId: 'user-3', managerName: 'Carlos Gerente', startDate: '2023-06-01', endDate: '2025-05-30', budget: 850000, status: 'Ativo', scope: 'Pesquisa e desenvolvimento de um novo...' },
];

export const INITIAL_ACCOUNTS_PAYABLE: AccountPayable[] = [
    { id: 'ap-1', description: 'Compra de Reagentes', category: 'Material de Consumo', value: 2500.00, dueDate: '2024-05-30', status: 'Pago', paymentDate: '2024-05-28', projectId: 'proj-1', budgetItemId: 'bi-1', reconciled: true },
    { id: 'ap-2', description: 'Serviço de Calibração', category: 'Serviços de Terceiros', value: 1200.00, dueDate: '2024-06-15', status: 'Aberto', projectId: 'proj-2', budgetItemId: 'bi-2', reconciled: false },
    { id: 'ap-3', description: 'Aluguel do Escritório', category: 'Despesas Administrativas', value: 5000.00, dueDate: '2024-06-05', status: 'Aberto', costCenter: 'Administrativo', reconciled: false },
];

export const INITIAL_ACCOUNTS_RECEIVABLE: AccountReceivable[] = [
    { id: 'ar-1', description: '1ª Parcela - Projeto Bacia Amazônica', category: 'Receita de Projeto', value: 125000.00, dueDate: '2024-04-30', status: 'Pago', paymentDate: '2024-04-28', reconciled: true },
    { id: 'ar-2', description: 'Análise de Amostra - Cliente X', category: 'Receita de Serviço', value: 500.00, dueDate: '2024-06-10', status: 'Aberto', reconciled: false },
];

export const INITIAL_CONTRACTS: Contract[] = [
    { id: 'cont-1', clientId: 'client-1', clientName: 'Petrobras', startDate: '2023-01-01', endDate: '2025-01-01', value: 1500000, status: 'Ativo' },
];

export const INITIAL_DOCUMENTS: Document[] = [
    { id: 'doc-1', name: 'Contrato Petrobras 2023', type: 'Contrato', projectId: 'proj-1', projectName: 'Monitoramento Ambiental Bacia Amazônica', uploadDate: '2023-01-10', description: 'Contrato assinado para o projeto de monitoramento.', ownerId: 'user-1', content: 'Conteúdo do contrato...', versions: [], permissions: [], comments: [] },
];

export const INITIAL_PERSONNEL: Personnel[] = [
    { id: 'pers-1', name: 'Carlos Gerente', email: 'carlos@femar.com', position: 'Gerente de Projetos', linkType: 'CLT', costPerHour: 120, admissionDate: '2020-01-15' },
    { id: 'pers-2', name: 'Gabriel Colaborador', email: 'gabriel@femar.com', position: 'Pesquisador Sênior', linkType: 'CLT', costPerHour: 90, admissionDate: '2021-03-20', managerId: 'pers-1' },
    { id: 'pers-3', name: 'Joana Bolsista', email: 'joana@femar.com', position: 'Bolsista de Iniciação Científica', linkType: 'Bolsista', costPerHour: 20, admissionDate: '2023-08-01', managerId: 'pers-2' },
];

export const INITIAL_TIMESHEET_ENTRIES: TimesheetEntry[] = [
    { id: 'ts-1', personnelId: 'pers-2', personnelName: 'Gabriel Colaborador', projectId: 'proj-1', projectName: 'Monitoramento Ambiental Bacia Amazônica', date: '2024-05-20', hours: 8, description: 'Análise de dados de campo', status: 'Aprovado' },
];

export const INITIAL_FUNDING_SOURCES: FundingSource[] = [
    { id: 'fs-1', name: 'FINEP', description: 'Financiadora de Estudos e Projetos' },
    { id: 'fs-2', name: 'CNPq', description: 'Conselho Nacional de Desenvolvimento Científico e Tecnológico' },
    { id: 'fs-3', name: 'Recursos Próprios', description: 'Recursos gerados pela própria fundação' },
];

export const INITIAL_BUDGET_ITEMS: BudgetItem[] = [
    { id: 'bi-1', code: '3390.30', name: 'Material de Consumo', description: '...' },
    { id: 'bi-2', code: '3390.39', name: 'Serviços de Terceiros - PJ', description: '...' },
    { id: 'bi-3', code: '3390.36', name: 'Serviços de Terceiros - PF', description: '...' },
];

export const INITIAL_CHART_OF_ACCOUNTS: ChartOfAccount[] = [
    { id: 'acc-a-1', code: '1.1.01', name: 'Caixa e Equivalentes', type: 'Ativo' },
    { id: 'acc-r-1', code: '4.1.01', name: 'Receita de Projetos', type: 'Receita' },
    { id: 'acc-d-1', code: '5.1.01', name: 'Despesas com Pessoal', type: 'Despesa' },
    { id: 'acc-d-2', code: '5.1.02', name: 'Material de Consumo', type: 'Despesa' },
];

export const INITIAL_BATCHES: Batch[] = [];
export const INITIAL_SHIPMENTS: Shipment[] = [];
export const INITIAL_PURCHASE_ORDERS: PurchaseOrder[] = [];
export const INITIAL_SALES_ORDERS: SalesOrder[] = [];
export const INITIAL_INVOICES: Invoice[] = [];
export const INITIAL_AUDIT_LOGS: AuditLog[] = [];
export const INITIAL_BANK_INTEGRATIONS: BankIntegration[] = [];
export const INITIAL_BANK_STATEMENT_LINES: BankStatementLine[] = [];
export const INITIAL_WORKFLOWS: ApprovalWorkflow[] = [];
export const INITIAL_HOLIDAY_REQUESTS: HolidayRequest[] = [];
// FIX: Add initial empty array for travel requests.
export const INITIAL_TRAVEL_REQUESTS: TravelRequest[] = [];
export const INITIAL_ONBOARDING: OnboardingProcess[] = [];
export const INITIAL_PERFORMANCE_REVIEWS: PerformanceReview[] = [];
export const INITIAL_REPORTS: CustomReport[] = [];
export const INITIAL_MATERIAL_REQUESTS: MaterialRequest[] = [];
// FIX: Add initial empty array for purchase requisitions.
export const INITIAL_PURCHASE_REQUISITIONS: PurchaseRequisition[] = [];
export const INITIAL_BUDGETS: Budget[] = [];
export const INITIAL_ASSETS: Asset[] = [];
export const INITIAL_GRANTS: Grant[] = [];
export const INITIAL_COMPLIANCE_OBLIGATIONS: ComplianceObligation[] = [];
export const INITIAL_NOTIFICATIONS: Notification[] = [];
export const INITIAL_ACCOUNTING_BATCHES: AccountingBatch[] = [];


function transformPageAccessToRolePermissions(): Record<UserRole, Page[]> {
    const rolePermissions: Record<UserRole, Page[]> = {} as Record<UserRole, Page[]>;

    for (const role of USER_ROLES) {
        rolePermissions[role] = [];
    }

    for (const pageStr in pageAccess) {
        const page = parseInt(pageStr) as Page;
        const allowedRoles = pageAccess[page];
        for (const role of allowedRoles) {
            if (rolePermissions[role]) {
                rolePermissions[role].push(page);
            }
        }
    }
    return rolePermissions;
}

export const INITIAL_ROLE_PERMISSIONS = transformPageAccessToRolePermissions();