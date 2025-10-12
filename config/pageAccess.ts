// FIX: Create missing pageAccess.ts file to define role-based access for each page.
import { Page, UserRole } from '../types';

export const pageAccess: Record<Page, UserRole[]> = {
    [Page.Login]: ['admin', 'finance', 'project_manager', 'superintendent', 'coordinator', 'inspector', 'employee', 'funder'], // Public-ish
    [Page.Unauthorized]: ['admin', 'finance', 'project_manager', 'superintendent', 'coordinator', 'inspector', 'employee', 'funder'],
    [Page.FunderPortal]: ['funder'],
    
    [Page.Dashboard]: ['admin', 'finance', 'project_manager', 'superintendent', 'coordinator', 'inspector', 'employee'],
    [Page.Approvals]: ['admin', 'finance', 'project_manager', 'superintendent'],
    
    [Page.Finance]: ['admin', 'finance', 'superintendent'],
    [Page.AccountsPayable]: ['admin', 'finance', 'superintendent'],
    [Page.AccountsReceivable]: ['admin', 'finance', 'superintendent'],
    [Page.Billing]: ['admin', 'finance', 'superintendent'],
    
    [Page.Accounting]: ['admin', 'finance', 'superintendent'],
    [Page.Assets]: ['admin', 'finance', 'superintendent'],
    [Page.Budgeting]: ['admin', 'finance', 'superintendent'],
    [Page.BudgetDetail]: ['admin', 'finance', 'superintendent'],
    
    [Page.Projects]: ['admin', 'project_manager', 'superintendent', 'coordinator', 'inspector', 'employee'],
    [Page.ProjectBoard]: ['admin', 'project_manager', 'superintendent', 'coordinator', 'inspector', 'employee'],
    // FIX: Add missing 'ProjectDetail' page to the page access configuration.
    [Page.ProjectDetail]: ['admin', 'project_manager', 'superintendent', 'coordinator', 'inspector', 'employee'],
    
    [Page.GrantManagement]: ['admin', 'project_manager', 'superintendent', 'coordinator'],
    [Page.GrantDetail]: ['admin', 'project_manager', 'superintendent', 'coordinator'],

    [Page.Purchases]: ['admin', 'finance', 'project_manager', 'superintendent', 'coordinator', 'employee'],
    [Page.Warehouse]: ['admin', 'project_manager', 'coordinator', 'employee'],
    [Page.Logistics]: ['admin', 'project_manager', 'coordinator'],
    
    [Page.Sales]: ['admin', 'finance', 'superintendent'],
    [Page.Contracts]: ['admin', 'project_manager', 'superintendent', 'coordinator', 'inspector'],

    [Page.HumanResources]: ['admin', 'superintendent', 'coordinator', 'employee'],
    
    [Page.Documents]: ['admin', 'finance', 'project_manager', 'superintendent', 'coordinator', 'inspector', 'employee'],
    
    [Page.Reports]: ['admin', 'finance', 'project_manager', 'superintendent', 'coordinator', 'inspector'],
    [Page.CashFlowReport]: ['admin', 'finance', 'superintendent'],
    [Page.DREReport]: ['admin', 'finance', 'superintendent'],
    [Page.CostCenterReport]: ['admin', 'finance', 'superintendent'],
    [Page.ContractsReport]: ['admin', 'finance', 'project_manager', 'superintendent', 'coordinator'],
    [Page.AccountabilityReport]: ['admin', 'finance', 'project_manager', 'superintendent', 'coordinator', 'inspector'],
    [Page.ComparativeAnalysisReport]: ['admin', 'finance', 'project_manager', 'superintendent'],
    [Page.BalanceSheetReport]: ['admin', 'finance', 'superintendent'],
    [Page.CustomReportBuilder]: ['admin', 'finance', 'superintendent'],
    [Page.CustomReportEditor]: ['admin', 'finance', 'superintendent'],
    // FIX: Add missing 'CustomReportViewer' to page access configuration.
    [Page.CustomReportViewer]: ['admin', 'finance', 'superintendent'],
    
    [Page.Registrations]: ['admin', 'finance', 'project_manager', 'superintendent', 'coordinator'],
    [Page.Configuration]: ['admin'],
    [Page.Security]: ['admin'],
    [Page.AccountingConfiguration]: ['admin'],

    // Legacy/Unused
    [Page.OKRs]: ['admin'], 
    [Page.Clients]: ['admin'],
    // FIX: Add missing pages to the access configuration, mapping them to the appropriate roles.
    [Page.Products]: ['admin', 'finance', 'project_manager', 'superintendent', 'coordinator'],
    [Page.Services]: ['admin', 'finance', 'project_manager', 'superintendent', 'coordinator'],
    [Page.Suppliers]: ['admin', 'finance', 'project_manager', 'superintendent', 'coordinator'],
    [Page.Personnel]: ['admin'],
};