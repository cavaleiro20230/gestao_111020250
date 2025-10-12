// FIX: Create ProjectOverviewTab.tsx component to display project overview details.
import React, { useContext, useMemo } from 'react';
import type { Project } from '../../../types';
import { AppContext } from '../../../App';
import Card from '../../Card';
import ProjectAIAssistant from '../../ProjectAIAssistant';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface ProjectOverviewTabProps {
  project: Project;
}

const ProjectOverviewTab: React.FC<ProjectOverviewTabProps> = ({ project }) => {
    const context = useContext(AppContext);
    if (!context) return null;

    const { accountsPayable, timesheetEntries, personnel } = context;

    const formatCurrency = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    const projectFinancials = useMemo(() => {
        const expenses = accountsPayable
            .filter(ap => ap.projectId === project.id && ap.status === 'Pago')
            .reduce((sum, ap) => sum + ap.value, 0);

        const personnelCost = timesheetEntries
            .filter(ts => ts.projectId === project.id && ts.status === 'Aprovado')
            .reduce((sum, ts) => {
                const person = personnel.find(pe => pe.id === ts.personnelId);
                return sum + (ts.hours * (person?.costPerHour || 0));
            }, 0);
        
        const totalSpent = expenses + personnelCost;
        return {
            totalSpent,
            budgetExecution: project.budget > 0 ? (totalSpent / project.budget) * 100 : 0,
            remainingBudget: project.budget - totalSpent,
            expenses,
            personnelCost
        };
    }, [project, accountsPayable, timesheetEntries, personnel]);

    const timeExecution = useMemo(() => {
        const now = new Date().getTime();
        const endDate = new Date(project.endDate).getTime();
        const startDate = new Date(project.startDate).getTime();
        if (now > endDate) return 100;
        if (now < startDate) return 0;
        const totalDuration = endDate - startDate;
        const timeElapsed = now - startDate;
        return totalDuration > 0 ? (timeElapsed / totalDuration) * 100 : 0;
    }, [project.startDate, project.endDate]);

    const executionData = [
        { name: 'Orçamento', value: projectFinancials.budgetExecution, fill: '#14b8a6' },
        { name: 'Cronograma', value: timeExecution, fill: '#38bdf8' }
    ];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card><p className="text-sm text-slate-500">Orçamento Total</p><p className="text-xl font-semibold">{formatCurrency(project.budget)}</p></Card>
                <Card><p className="text-sm text-slate-500">Total Gasto</p><p className="text-xl font-semibold text-red-500">{formatCurrency(projectFinancials.totalSpent)}</p></Card>
                <Card><p className="text-sm text-slate-500">Saldo Disponível</p><p className="text-xl font-semibold text-green-600">{formatCurrency(projectFinancials.remainingBudget)}</p></Card>
                <Card><p className="text-sm text-slate-500">Gerente</p><p className="text-xl font-semibold">{project.managerName}</p></Card>
            </div>
            
            <Card>
                <h3 className="font-semibold mb-4">Execução (Orçamento vs. Cronograma)</h3>
                 <ResponsiveContainer width="100%" height={150}>
                    <BarChart data={executionData} layout="vertical" barSize={30}>
                        <XAxis type="number" domain={[0, 100]} unit="%" />
                        <YAxis type="category" dataKey="name" width={80} />
                        <Tooltip formatter={(value) => `${(value as number).toFixed(1)}%`} />
                        <Bar dataKey="value" background={{ fill: '#eee' }} />
                    </BarChart>
                </ResponsiveContainer>
            </Card>

            <ProjectAIAssistant project={project} />
        </div>
    );
};

export default ProjectOverviewTab;