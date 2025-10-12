// This file contains all the type definitions for the application.

// FIX: Create the types.ts file with all the necessary type definitions for the application.
// This resolves a large number of module and type errors across the project.

export interface FinancialData {
  monthlyPerformance: { name: string; revenue: number; expenses: number }[];
  topExpenseCategories: { name: string; value: number }[];
}

export interface AIExpenseData {
    description: string;
    category: string;
    value: number;
    dueDate: string;
}

export interface ProjectAnalysisData {
    project: Project;
    totalSpent: number;
    personnelCost: number;
    totalHours: number;
    spentByBudgetItem: { name: string; value: number }[];
    burnRate: number;
    projectedExhaustionDate: string;
    daysLeftInBudget: number;
}

export interface ExecutiveSummaryData {
    totalRevenue: number;
    totalExpenses: number;
    projectsAtRisk: { name: string; reason: string }[];
    fundingDistribution: { name: string; value: number }[];
    monthlyPerformance: { name: string; revenue: number; expenses: number }[];
}

export type UserRole = 'admin' | 'finance' | 'project_manager' | 'superintendent' | 'coordinator' | 'inspector' | 'employee' | 'funder';

export const USER_ROLES: UserRole[] = ['admin', 'finance', 'project_manager', 'superintendent', 'coordinator', 'inspector', 'employee', 'funder'];


export interface User {
    id: string;
    name: string;
    email: string;
    password?: string;
    role: UserRole;
    position: string;
    department: string;
    clientId?: string; // For funder users
    type?: 'internal' | 'external';
    status: 'active' | 'blocked';
}

export interface Personnel {
    id: string;
    name: string;
    email: string;
    position: string;
    linkType: 'CLT' | 'Bolsista' | 'Terceirizado';
    costPerHour: number;
    admissionDate: string;
    managerId?: string;
}

export interface Client {
    id: string;
    name: string;
    email: string;
    phone: string;
    cnpj: string;
}

export interface Supplier {
    id: string;
    name: string;
    contactPerson: string;
    email: string;
    phone: string;
}

export interface Product {
    id: string;
    name: string;
    category: string;
    price: number;
    stock: number;
}

export interface Service {
    id: string;
    name: string;
    category: string;
    price: number;
}

export interface Transporter {
    id: string;
    name: string;
    vehicle: string;
    licensePlate: string;
}

export interface Seller {
    id: string;
    name: string;
    email: string;
    commissionRate: number;
}

export interface FundingSource {
    id: string;
    name: string;
    description: string;
}

export interface BudgetItem {
    id: string;
    code: string;
    name: string;
    description: string;
}

export interface ChartOfAccount {
    id: string;
    code: string;
    name: string;
    type: 'Receita' | 'Despesa' | 'Ativo' | 'Passivo' | 'Patrimônio Líquido';
}

export interface AccountPayable {
    id: string;
    description: string;
    category: string;
    value: number;
    dueDate: string;
    status: 'Aberto' | 'Pago' | 'Vencido';
    paymentDate?: string;
    costCenter?: string;
    documentId?: string;
    projectId?: string;
    budgetItemId?: string;
    reconciled: boolean;
}

export interface AccountReceivable {
    id: string;
    description: string;
    category: string;
    value: number;
    dueDate: string;
    status: 'Aberto' | 'Pago' | 'Vencido';
    paymentDate?: string;
    costCenter?: string;
    reconciled: boolean;
}

export interface Contract {
    id: string;
    clientId: string;
    clientName: string;
    startDate: string;
    endDate: string;
    value: number;
    status: 'Ativo' | 'Encerrado' | 'Cancelado';
}

export interface Project {
    id: string;
    name: string;
    clientId: string;
    clientName: string;
    managerId: string;
    managerName: string;
    startDate: string;
    endDate: string;
    budget: number;
    status: 'Proposto' | 'Ativo' | 'Pausado' | 'Concluído' | 'Cancelado';
    scope: string;
}

export interface ProjectTask {
    id: string;
    projectId: string;
    title: string;
    description: string;
    status: 'A Fazer' | 'Em Andamento' | 'Concluído';
    assignedToId?: string;
    assignedToName?: string;
    deliverableId?: string;
    startDate?: string;
    dueDate?: string;
    attachments: string[];
    comments: TaskComment[];
}

export interface TaskComment {
    id: string;
    taskId: string;
    authorId: string;
    authorName: string;
    content: string;
    createdAt: string;
}

export interface ProjectDeliverable {
    id: string;
    projectId: string;
    name: string;
    description: string;
    dueDate: string;
}


export interface DocumentPermission {
    userId: string;
    userName: string;
    accessLevel: 'read' | 'write';
}

export interface DocumentVersion {
    id: string;
    versionNumber: number;
    uploaderId: string;
    uploaderName: string;
    uploadDate: string;
    changeNotes: string;
    content: string;
}

export interface Document {
    id: string;
    name: string;
    type: string;
    projectId?: string;
    projectName?: string;
    uploadDate: string;
    description: string;
    ownerId: string;
    content: string;
    versions: DocumentVersion[];
    permissions: DocumentPermission[];
    comments: TaskComment[];
}

export interface CompanyConfig {
    name: string;
    cnpj: string;
    address: string;
    phone: string;
    email: string;
}

export interface FiscalConfig {
    taxRegime: 'Simples Nacional' | 'Lucro Presumido' | 'Lucro Real';
    icmsRate: number;
    pisCofinsRate: number;
    enableNfse: boolean;
}

export interface FinancialConfig {
    lateFeeInterest: number;
    lateFeeFine: number;
    dueNotificationDays: number;
    contractAdjustmentIndex: 'Nenhum' | 'IGP-M' | 'IPCA';
    allowPartialPayment: boolean;
}

export interface OtherConfig {
    paymentConditions: string[];
    costCenters: string[];
    enableAutomaticBackup: boolean;
}

export interface AccountingConfig {
    closingDate: string;
    payableDebitAccountId: string; // Default expense
    payableCreditAccountId: string; // Default cash/bank
    receivableDebitAccountId: string; // Default cash/bank
    receivableCreditAccountId: string; // Default revenue
    payableCategoryMappings: { id: string; category: string; debitAccountId: string }[];
}


export interface TimesheetEntry {
    id: string;
    personnelId: string;
    personnelName: string;
    projectId: string;
    projectName: string;
    date: string;
    hours: number;
    description: string;
    status: 'Pendente' | 'Aprovado';
}

export interface Batch {
    id: string;
    identifier: string;
    projectId: string;
    projectName: string;
    collectionDate: string;
    collectorName: string;
    storageLocation: string;
    description: string;
    status: 'Em análise' | 'Armazenado' | 'Descartado';
}

export interface Shipment {
    id: string;
    trackingCode: string;
    origin: string;
    destination: string;
    carrier: string;
    dispatchDate: string;
    expectedArrivalDate: string;
    status: 'Em trânsito' | 'Entregue' | 'Atrasado';
    batchIds: string[];
}

export interface ToastMessage {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

export interface ToastContextType {
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

export interface PurchaseOrder {
    id: string;
    orderNumber: number;
    supplierId: string;
    supplierName: string;
    orderDate: string;
    expectedDeliveryDate: string;
    items: PurchaseOrderItem[];
    totalValue: number;
    status: 'Pendente' | 'Recebido Parcial' | 'Recebido Total' | 'Cancelado';
}

export interface PurchaseOrderItem {
    id: string;
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
}

export interface SalesOrder {
    id: string;
    orderNumber: number;
    clientId: string;
    clientName: string;
    orderDate: string;
    deliveryDate: string;
    items: SalesOrderItem[];
    totalValue: number;
    status: 'Orçamento' | 'Pedido' | 'Faturado' | 'Cancelado';
}

export interface SalesOrderItem {
    id: string;
    itemId: string;
    itemName: string;
    quantity: number;
    unitPrice: number;
}

export interface AuditLog {
    id: string;
    timestamp: string;
    userId: string;
    userName: string;
    action: 'create' | 'update' | 'delete' | 'status_change' | 'login' | 'logout' | 'processed';
    entity: string;
    entityId?: string;
    details: string;
}

export interface BankIntegration {
    id: string;
    bankName: string;
    status: 'connected' | 'disconnected' | 'syncing';
    lastSync: string;
}

export interface BankStatementLine {
    id: string;
    integrationId: string;
    date: string;
    description: string;
    amount: number;
    reconciled: boolean;
}

export interface ApprovalWorkflow {
    id: string;
    name: string;
    entity: 'MaterialRequest';
    conditionField: 'totalValue';
    conditionOperator: 'greater_than';
    conditionValue: number;
    steps: { id: string; approverRole: UserRole }[];
}

export interface ApprovalStepState {
    approverRole: UserRole;
    status: 'pending' | 'approved' | 'rejected';
    notes?: string;
    processedBy?: string;
    processedAt?: string;
}

export interface ApprovalInstance {
    id: string;
    workflowId: string;
    entity: 'MaterialRequest';
    entityId: string;
    status: 'pending' | 'approved' | 'rejected';
    currentStep: number;
    stepStates: ApprovalStepState[];
}

export interface HolidayRequest {
    id: string;
    requesterId: string;
    requesterName: string;
    startDate: string;
    endDate: string;
    status: 'Pendente' | 'Aprovado' | 'Rejeitado';
    requestDate: string;
    approverId?: string;
    approverName?: string;
    approverNotes?: string;
}

// FIX: Define and export the missing 'TravelRequest' type.
export interface TravelRequest {
    id: string;
    requesterId: string;
    requesterName: string;
    projectId: string;
    projectName: string;
    destination: string;
    startDate: string;
    endDate: string;
    originalDailyAllowance: number;
    currency: 'BRL' | 'USD' | 'EUR';
    exchangeRate: number;
    totalValue: number; // This is in BRL
    reason: string;
    status: 'Solicitada' | 'Aprovada' | 'Rejeitada' | 'Realizada' | 'Prestação de Contas' | 'Concluída';
}

export interface ChecklistItem {
    id: string;
    description: string;
    completed: boolean;
    completedBy?: string;
    completionDate?: string;
}

export interface OnboardingProcess {
    id: string;
    employeeId: string;
    employeeName: string;
    type: 'onboarding' | 'offboarding';
    startDate: string;
    managerId?: string;
    tasks: ChecklistItem[];
}

export interface PerformanceReview {
    id: string;
    employeeId: string;
    employeeName: string;
    managerId: string;
    managerName: string;
    reviewDate: string;
    cycleName: string;
    status: 'Pendente' | 'Em Andamento' | 'Concluída';
    strengths: string;
    areasForImprovement: string;
    feedback: string;
}

export interface CustomReport {
    id: string;
    name: string;
    description: string;
    config: CustomReportConfig;
}

export type CustomReportDataSource = 'accountsPayable' | 'projects' | 'timesheetEntries' | 'accountsReceivable';

export type CustomReportFilterOperator = 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than';

export interface CustomReportConfig {
    dataSource: CustomReportDataSource | '';
    columns: string[];
    filters: {
        id: string;
        column: string;
        operator: CustomReportFilterOperator;
        value: string;
    }[];
}

export interface MaterialRequestItem {
    id: string;
    productId: string;
    name: string;
    quantity: number;
    price: number;
}

export interface MaterialRequest {
    id: string;
    requesterId: string;
    requesterName: string;
    projectId: string;
    projectName: string;
    budgetItemId: string;
    fundingSourceId: string;
    requestDate: string;
    items: MaterialRequestItem[];
    status: 'Solicitada' | 'Pendente de Aprovação' | 'Aprovada' | 'Rejeitada' | 'Atendida';
}

// FIX: Define and export the missing 'PurchaseRequisitionItem' type.
export interface PurchaseRequisitionItem {
    id: string;
    description: string;
    quantity: number;
    estimatedPrice: number;
}

// FIX: Define and export the missing 'PurchaseRequisition' type.
export interface PurchaseRequisition {
    id: string;
    requisitionNumber: number;
    requesterId: string;
    requesterName: string;
    requestDate: string;
    projectId: string;
    projectName: string;
    items: PurchaseRequisitionItem[];
    status: 'Pendente' | 'Aprovada' | 'Rejeitada' | 'Concluída';
}

export interface BudgetLineItem {
    id: string;
    budgetItemId: string;
    budgetItemName: string;
    budgetItemCode: string;
    projectedValue: number;
}

export interface Budget {
    id: string;
    name: string;
    year: number;
    status: 'Planejamento' | 'Aprovado' | 'Encerrado';
    lineItems: BudgetLineItem[];
}

export interface DepreciationEntry {
    id: string;
    assetId: string;
    date: string;
    amount: number;
    bookValueAfter: number;
}

export interface Asset {
    id: string;
    name: string;
    serialNumber: string;
    projectId: string;
    projectName: string;
    acquisitionDate: string;
    value: number;
    status: 'Disponível' | 'Em Uso' | 'Em Manutenção' | 'Baixado';
    depreciationMethod: 'none' | 'linear';
    usefulLifeMonths: number;
    salvageValue: number;
}

export interface Grant {
    id: string;
    name: string;
    fundingSourceId: string;
    fundingSourceName: string;
    status: 'Proposta' | 'Em Análise' | 'Aprovado' | 'Rejeitado' | 'Ativo' | 'Encerrado';
    proposalDate: string;
    approvalDate?: string;
    startDate?: string;
    endDate?: string;
    totalValue: number;
    managerId: string;
    managerName: string;
    finalReportDueDate?: string;
}

export interface ComplianceObligation {
    id: string;
    grantId: string;
    description: string;
    dueDate: string;
    status: 'Pendente' | 'Concluída';
}

export interface Notification {
    id: string;
    userId: string;
    message: string;
    read: boolean;
    createdAt: string;
    link?: {
        page: Page;
        context?: any;
    };
}

export interface AccountingEntry {
    id: string;
    chartOfAccountId: string;
    description: string;
    debit: number;
    credit: number;
}

export interface AccountingBatch {
    id: string;
    batchNumber: number;
    referenceDate: string;
    description: string;
    status: 'Em Digitação' | 'A Contabilizar' | 'Contabilizado' | 'Revertido';
    sourceDocumentId?: string; // Link to AP/AR
    entries: AccountingEntry[];
}

export enum Page {
    Login,
    Dashboard,
    Finance,
    AccountsPayable,
    AccountsReceivable,
    Billing,
    Projects,
    ProjectBoard,
    Registrations,
    Clients,
    Products,
    Services,
    Suppliers,
    Configuration,
    Reports,
    Unauthorized,
    Contracts,
    Sales,
    Purchases,
    Warehouse,
    HumanResources,
    Personnel,
    Documents,
    Logistics,
    Assets,
    Accounting,
    Budgeting,
    GrantManagement,
    Approvals,
    OKRs,
    Security,
    // Report Sub-pages
    CashFlowReport,
    DREReport,
    CostCenterReport,
    ContractsReport,
    AccountabilityReport,
    ComparativeAnalysisReport,
    BalanceSheetReport,
    CustomReportBuilder,
    CustomReportEditor,
    CustomReportViewer,
    // Detail Pages
    ProjectDetail,
    BudgetDetail,
    GrantDetail,
    // Config sub-pages
    AccountingConfiguration,
    // Funder portal
    FunderPortal,
}

// FIX: A union of all data types that can be stored in the app's state.
export type AppData = {
    // This is not exhaustive but covers the main data types
    clients: Client[];
    projects: Project[];
    accountsPayable: AccountPayable[];
    accountsReceivable: AccountReceivable[];
    users: User[];
    personnel: Personnel[];
    [key: string]: any; // Allow for other data types
};

export type AppContextType = {
    // State
    activePage: Page;
    pageContext?: any;
    clients: Client[];
    products: Product[];
    services: Service[];
    suppliers: Supplier[];
    transporters: Transporter[];
    sellers: Seller[];
    fundingSources: FundingSource[];
    budgetItems: BudgetItem[];
    chartOfAccounts: ChartOfAccount[];
    accountsPayable: AccountPayable[];
    accountsReceivable: AccountReceivable[];
    contracts: Contract[];
    projects: Project[];
    projectTasks: ProjectTask[];
    projectDeliverables: ProjectDeliverable[];
    documents: Document[];
    users: User[];
    personnel: Personnel[];
    timesheetEntries: TimesheetEntry[];
    batches: Batch[];
    shipments: Shipment[];
    purchaseOrders: PurchaseOrder[];
    salesOrders: SalesOrder[];
    auditLogs: AuditLog[];
    bankIntegrations: BankIntegration[];
    bankStatementLines: BankStatementLine[];
    approvalWorkflows: ApprovalWorkflow[];
    approvalInstances: ApprovalInstance[];
    holidayRequests: HolidayRequest[];
    // FIX: Add 'travelRequests' to the AppContextType.
    travelRequests: TravelRequest[];
    onboardingProcesses: OnboardingProcess[];
    performanceReviews: PerformanceReview[];
    customReports: CustomReport[];
    materialRequests: MaterialRequest[];
    // FIX: Add 'purchaseRequisitions' to the AppContextType.
    purchaseRequisitions: PurchaseRequisition[];
    budgets: Budget[];
    assets: Asset[];
    depreciationHistory: DepreciationEntry[];
    grants: Grant[];
    complianceObligations: ComplianceObligation[];
    notifications: Notification[];
    accountingBatches: AccountingBatch[];
    companyConfig: CompanyConfig;
    fiscalConfig: FiscalConfig;
    financialConfig: FinancialConfig;
    otherConfig: OtherConfig;
    accountingConfig: AccountingConfig;
    pageMappings: Record<string, Page>;
    rolePermissions: Record<UserRole, Page[]>;

    // Setters & Handlers
    setActivePage: (page: Page, context?: any) => void;
    handleSaveClient: (client: Client) => void;
    handleDeleteClient: (id: string) => void;
    handleSaveProduct: (product: Product) => void;
    handleDeleteProduct: (id: string) => void;
    handleSaveService: (service: Service) => void;
    handleDeleteService: (id: string) => void;
    handleSaveSupplier: (supplier: Supplier) => void;
    handleDeleteSupplier: (id: string) => void;
    handleSaveTransporter: (transporter: Transporter) => void;
    handleDeleteTransporter: (id: string) => void;
    handleSaveSeller: (seller: Seller) => void;
    handleDeleteSeller: (id: string) => void;
    handleSaveFundingSource: (source: FundingSource) => void;
    handleDeleteFundingSource: (id: string) => void;
    handleSaveBudgetItem: (item: BudgetItem) => void;
    handleDeleteBudgetItem: (id: string) => void;
    handleSaveChartOfAccount: (account: ChartOfAccount) => void;
    handleDeleteChartOfAccount: (id: string) => void;
    handleSaveAccountPayable: (account: AccountPayable, paymentDate: string) => void;
    handleDeleteAccountPayable: (id: string) => void;
    handleSaveAccountReceivable: (account: AccountReceivable, paymentDate: string) => void;
    handleDeleteAccountReceivable: (id: string) => void;
    handleSaveContract: (contract: Contract) => void;
    handleDeleteContract: (id: string) => void;
    handleSaveProject: (project: Project) => void;
    handleDeleteProject: (id: string) => void;
    handleSaveProjectTask: (task: ProjectTask) => void;
    handleDeleteProjectTask: (id: string) => void;
    handleSaveProjectDeliverable: (deliverable: ProjectDeliverable) => void;
    handleDeleteProjectDeliverable: (id: string) => void;
    handleSaveDocument: (doc: Document) => void;
    handleDeleteDocument: (id: string) => void;
    handleSaveUser: (user: User) => void;
    handleDeleteUser: (id: string) => void;
    handleSavePersonnel: (p: Personnel) => void;
    handleDeletePersonnel: (id: string) => void;
    handleSaveTimesheetEntry: (entry: TimesheetEntry) => void;
    handleDeleteTimesheetEntry: (id: string) => void;
    handleApproveTimesheetEntry: (id: string) => void;
    handleSaveBatch: (batch: Batch) => void;
    handleDeleteBatch: (id: string) => void;
    handleSaveShipment: (shipment: Shipment) => void;
    handleDeleteShipment: (id: string) => void;
    handleSavePurchaseOrder: (order: PurchaseOrder) => void;
    handleDeletePurchaseOrder: (id: string) => void;
    handleSaveSalesOrder: (order: SalesOrder) => void;
    handleDeleteSalesOrder: (id: string) => void;
    handleAddTaskComment: (taskId: string, authorId: string, content: string) => void;
    handleUpdatePermissions: (docId: string, permissions: DocumentPermission[]) => void;
    handleUploadNewVersion: (docId: string, uploader: User, changeNotes: string, newContent: string) => void;
    handleConnectBank: (bankName: string) => void;
    handleSyncBank: (integrationId: string) => void;
    handleReconcileTransactions: (statementLineIds: string[], systemTrans: { type: 'ap' | 'ar', id: string }[]) => void;
    handleSaveWorkflow: (workflow: ApprovalWorkflow) => void;
    handleDeleteWorkflow: (id: string) => void;
    handleProcessApproval: (instanceId: string, status: 'approved' | 'rejected', notes?: string) => void;
    handleSaveHolidayRequest: (request: HolidayRequest) => void;
    handleDeleteHolidayRequest: (id: string) => void;
    handleUpdateHolidayRequestStatus: (id: string, newStatus: 'Aprovado' | 'Rejeitado', approver: User, notes?: string) => void;
    // FIX: Add 'travel request' handlers to the AppContextType.
    handleSaveTravelRequest: (req: TravelRequest) => void;
    handleDeleteTravelRequest: (id: string) => void;
    handleUpdateTravelRequestStatus: (id: string, newStatus: TravelRequest['status']) => void;
    handleSaveOnboardingProcess: (process: OnboardingProcess) => void;
    handleDeleteOnboardingProcess: (id: string) => void;
    handleSavePerformanceReview: (review: PerformanceReview) => void;
    handleDeletePerformanceReview: (id: string) => void;
    handleSaveCustomReport: (report: CustomReport) => void;
    handleDeleteCustomReport: (id: string) => void;
    handleSaveMaterialRequest: (request: MaterialRequest) => void;
    handleDeleteMaterialRequest: (id: string) => void;
    handleUpdateMaterialRequestStatus: (id: string, newStatus: 'Aprovada' | 'Rejeitada' | 'Atendida') => void;
    // FIX: Add 'purchase requisition' handlers to the AppContextType.
    handleSavePurchaseRequisition: (req: PurchaseRequisition) => void;
    handleDeletePurchaseRequisition: (id: string) => void;
    handleUpdatePurchaseRequisitionStatus: (id: string, newStatus: 'Aprovada' | 'Rejeitada' | 'Concluída') => void;
    handleSaveBudget: (budget: Budget) => void;
    handleDeleteBudget: (id: string) => void;
    handleSaveAsset: (asset: Asset) => void;
    handleDeleteAsset: (id: string) => void;
    handleRunDepreciation: (yearMonth: string) => void;
    handleSaveGrant: (grant: Grant) => void;
    handleDeleteGrant: (id: string) => void;
    handleSaveComplianceObligation: (obligation: ComplianceObligation) => void;
    handleDeleteComplianceObligation: (id: string) => void;
    handleNotificationClick: (notificationId: string, link?: { page: Page; context?: any }) => void;
    handleSaveAccountingBatch: (batch: AccountingBatch) => void;
    handleDeleteAccountingBatch: (id: string) => void;
    handleProcessAccountingBatch: (id: string) => void;
    handleReverseAccountingBatch: (id: string) => void;
    
    handleSaveCompanyConfig: (config: CompanyConfig) => void;
    handleSaveFiscalConfig: (config: FiscalConfig) => void;
    handleSaveFinancialConfig: (config: FinancialConfig) => void;
    handleSaveOtherConfig: (config: OtherConfig) => void;
    handleSaveAccountingConfig: (config: AccountingConfig) => void;
    handleUpdateRolePermissions: (role: UserRole, page: Page, hasAccess: boolean) => void;


    handleExecuteFunctionCall: (call: any) => Promise<{ success: boolean; message: string }>;
};


export interface AuthContextType {
  user: User | null;
  login: (email: string, pass: string) => 'success' | 'invalid' | 'blocked';
  logout: () => void;
}