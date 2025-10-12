import { useMemo, useContext } from 'react';
import { AppContext } from '../App';
import type { Project } from '../types';

const useAccountabilityData = (project: Project | null) => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("useAccountabilityData must be used within an AppProvider");
    }

    const { accountsPayable, timesheetEntries, personnel, budgetItems, projectDeliverables } = context;

    const data = useMemo(() => {
        if (!project) {
            return {
                totalSpent: 0,
                personnelCost: 0,
                otherExpenses: 0,
                budgetExecution: 0,
                timeExecution: 0,
                nextDeliverable: null,
                expensesByCategory: [],
                detailedExpenses: [],
                detailedPersonnelCosts: [],
            };
        }

        const projectPayables = accountsPayable.filter(ap => ap.projectId === project.id && ap.status === 'Pago');
        const projectTimesheets = timesheetEntries.filter(ts => ts.projectId === project.id && ts.status === 'Aprovado');

        const otherExpenses = projectPayables.reduce((sum, ap) => sum + ap.value, 0);

        const detailedPersonnelCosts = projectTimesheets.map(ts => {
            const person = personnel.find(p => p.id === ts.personnelId);
            const cost = (person?.costPerHour || 0) * ts.hours;
            return {
                date: ts.date,
                description: `Horas: ${ts.personnelName} (${ts.hours}h)`,
                value: cost,
                budgetItemName: 'Custos com Pessoal'
            };
        });

        const personnelCost = detailedPersonnelCosts.reduce((sum, item) => sum + item.value, 0);
        const totalSpent = otherExpenses + personnelCost;
        const budgetExecution = project.budget > 0 ? (totalSpent / project.budget) * 100 : 0;

        const now = new Date().getTime();
        const endDate = new Date(project.endDate).getTime();
        const startDate = new Date(project.startDate).getTime();
        let timeExecution = 0;
        if (now > endDate) timeExecution = 100;
        else if (now > startDate) {
            const totalDuration = endDate - startDate;
            const timeElapsed = now - startDate;
            timeExecution = totalDuration > 0 ? (timeElapsed / totalDuration) * 100 : 0;
        }

        const upcomingDeliverables = projectDeliverables
            .filter(d => d.projectId === project.id && new Date(d.dueDate).getTime() >= now)
            .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

        const expensesByCategory = projectPayables.reduce((acc, ap) => {
            const budgetItemName = budgetItems.find(bi => bi.id === ap.budgetItemId)?.name || 'Outros';
            const existing = acc.find(item => item.name === budgetItemName);
            if (existing) {
                existing.value += ap.value;
            } else {
                acc.push({ name: budgetItemName, value: ap.value });
            }
            return acc;
        }, [] as { name: string, value: number }[]);
        
        if (personnelCost > 0) {
            expensesByCategory.push({ name: 'Custos com Pessoal', value: personnelCost });
        }
        
        const detailedExpenses = projectPayables.map(ap => ({
            date: ap.paymentDate || ap.dueDate,
            description: ap.description,
            value: ap.value,
            budgetItemName: budgetItems.find(bi => bi.id === ap.budgetItemId)?.name || 'Outros'
        }));


        return {
            totalSpent,
            personnelCost,
            otherExpenses,
            budgetExecution,
            timeExecution,
            nextDeliverable: upcomingDeliverables[0] || null,
            expensesByCategory: expensesByCategory.sort((a,b) => b.value - a.value),
            detailedExpenses,
            detailedPersonnelCosts,
        };

    }, [project, accountsPayable, timesheetEntries, personnel, budgetItems, projectDeliverables]);

    return data;
};

export default useAccountabilityData;
