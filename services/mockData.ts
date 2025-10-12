import { FinancialData } from '../types';

export const FINANCIAL_DASHBOARD_DATA: FinancialData = {
  monthlyPerformance: [
    { name: 'Jan', revenue: 18000, expenses: 12000 },
    { name: 'Fev', revenue: 22000, expenses: 15000 },
    { name: 'Mar', revenue: 20000, expenses: 16000 },
    { name: 'Abr', revenue: 27000, expenses: 20000 },
    { name: 'Mai', revenue: 25000, expenses: 18000 },
    { name: 'Jun', revenue: 30000, expenses: 22000 },
  ],
  topExpenseCategories: [
    { name: 'Pessoal', value: 45 },
    { name: 'Marketing', value: 20 },
    { name: 'Infraestrutura', value: 15 },
    { name: 'Material', value: 10 },
    { name: 'Outros', value: 10 },
  ],
};
