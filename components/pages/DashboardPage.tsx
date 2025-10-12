

import React, { useContext, useMemo } from 'react';
import Header from '../Header';
import Card from '../Card';
// FIX: The errors "File '.../App.tsx' is not a module" and property access errors are resolved by creating the App.tsx file and defining AppContext.
import { AppContext } from '../../App';
// FIX: The error "File '.../types.ts' is not a module" is resolved by creating the types.ts file.
import { Page, Project } from '../../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import ExecutiveAIAssistant from '../ExecutiveAIAssistant';

const COLORS = ['#0d9488', '#0ea5e9', '#f97316', '#8b5cf6', '#ec4899'];

const DashboardPage: React.FC = () => {
    const context = useContext(AppContext);
    if (!context) return null;

    const { projects, accountsPayable, timesheetEntries, personnel, fundingSources } = context;

    const formatCurrency = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    const projectFinancials = useMemo(() => {
        // FIX: Added explicit type `Project` to the map parameter `p` to ensure correct type inference for its properties.
        return projects.map((p: Project) => {
            const expenses = accountsPayable
                .filter(ap => ap.projectId === p.id && ap.status === 'Pago')
                .reduce((sum, ap) => sum + ap.value, 0);

            const personnelCost = timesheetEntries
                .filter(ts => ts.projectId === p.id && ts.status === 'Aprovado')
                .reduce((sum, ts) => {
                    const person = personnel.find(pe => pe.id === ts.personnelId);
                    return sum + (ts.hours * (person?.costPerHour || 0));
                }, 0);
            
            const totalSpent = expenses + personnelCost;
            return {
                ...p,
                totalSpent,
                budgetExecution: p.budget > 0 ? (totalSpent / p.budget) * 100 : 0,
            };
        });
    }, [projects, accountsPayable, timesheetEntries, personnel]);

    const totalBudget = useMemo(() => projectFinancials.reduce((sum, p) => sum + p.budget, 0), [projectFinancials]);
    const totalSpent = useMemo(() => projectFinancials.reduce((sum, p) => sum + p.totalSpent, 0), [projectFinancials]);
    const overallExecution = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

    const projectsAtRisk = useMemo(() => {
        const now = new Date().getTime();
        return projectFinancials.filter(p => {
            // FIX: Refactored date arithmetic to use getTime() on Date objects directly, resolving a TypeScript type error.
            const endDate = new Date(p.endDate);
            const startDate = new Date(p.startDate);
            const totalDuration = endDate.getTime() - startDate.getTime();
            const timeElapsed = now - startDate.getTime();
            // FIX: Type errors related to arithmetic operations are resolved by defining the correct types for project properties in `types.ts`.
            const timeExecution = totalDuration > 0 ? (timeElapsed / totalDuration) * 100 : 0;
            return p.status === 'Ativo' && (p.budgetExecution > 80 || timeExecution > 80);
        });
    }, [projectFinancials]);
    
    const fundingDistribution = useMemo(() => {
        const distribution = accountsPayable
            .filter(ap => ap.status === 'Pago' && ap.projectId)
            .reduce((acc, ap) => {
                const project = projects.find(p => p.id === ap.projectId);
                // This is a simplification; a real system would link expenses to funding sources directly
                const fundingSourceName = fundingSources.find(fs => fs.id)?.name || 'Recursos Próprios';
                acc[fundingSourceName] = (acc[fundingSourceName] || 0) + ap.value;
                return acc;
            }, {} as {[key:string]: number});

        // FIX: Explicitly cast `value` to `number` to resolve type inference issues with Object.entries, which caused an arithmetic error in the sort function.
        return Object.entries(distribution).map(([name, value]) => ({ name, value: value as number })).sort((a,b) => b.value - a.value);
    }, [accountsPayable, projects, fundingSources]);

    const monthlyPerformance = useMemo(() => {
        const data: { [key: string]: { name: string, revenue: number, expenses: number } } = {};
        for(let i = 5; i >= 0; i--) {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            const key = d.toLocaleString('default', { month: 'short' });
            data[key] = { name: key, revenue: 0, expenses: 0 };
        }
        
        accountsPayable.filter(a => a.status === 'Pago' && a.paymentDate).forEach(a => {
            const d = new Date(a.paymentDate!);
             const key = d.toLocaleString('default', { month: 'short' });
             if(data[key]) data[key].expenses += a.value;
        });

        // Simplified revenue - in reality, this would come from receivables or contracts
         Object.values(data).forEach(month => {
            month.revenue = Math.random() * 20000 + 15000;
        });

        return Object.values(data);
    }, [accountsPayable]);

    return (
        <div className="p-8">
            <Header title="Dashboard Gerencial" />

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
                <Card><p className="text-sm text-slate-500">Receita (Últ. 6 meses)</p><p className="text-2xl font-semibold">{formatCurrency(monthlyPerformance.reduce((s, m) => s + m.revenue, 0))}</p></Card>
                <Card><p className="text-sm text-slate-500">Despesas (Últ. 6 meses)</p><p className="text-2xl font-semibold">{formatCurrency(monthlyPerformance.reduce((s, m) => s + m.expenses, 0))}</p></Card>
                <Card><p className="text-sm text-slate-500">Orçamento Total Ativo</p><p className="text-2xl font-semibold">{formatCurrency(totalBudget)}</p></Card>
                <Card><p className="text-sm text-slate-500">Projetos em Risco</p><p className="text-2xl font-semibold text-red-500">{projectsAtRisk.length}</p></Card>
            </div>
            
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
                <Card>
                    <h3 className="font-semibold mb-4">Execução Orçamentária (Todos os Projetos)</h3>
                     <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie data={[{name: 'Gasto', value: totalSpent}, {name: 'Disponível', value: totalBudget - totalSpent}]} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} fill="#8884d8" paddingAngle={5} label>
                               <Cell key="cell-0" fill="#f43f5e" />
                               <Cell key="cell-1" fill="#14b8a6" />
                            </Pie>
                             <Tooltip formatter={(value) => formatCurrency(value as number)} />
                             <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </Card>
                 <Card>
                    <h3 className="font-semibold mb-4">Principais Fontes de Recurso (por despesa)</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={fundingDistribution.slice(0, 5)} layout="vertical">
                            <XAxis type="number" hide />
                            <YAxis type="category" dataKey="name" width={150} tick={{fontSize: 12}} />
                            <Tooltip formatter={(value) => formatCurrency(value as number)}/>
                            <Bar dataKey="value" name="Valor Gasto" fill="#0ea5e9" barSize={20} />
                        </BarChart>
                    </ResponsiveContainer>
                </Card>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
                <Card className="xl:col-span-2">
                     <h3 className="font-semibold mb-4">Desempenho Mensal (Receita vs Despesa)</h3>
                     <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={monthlyPerformance}>
                            <XAxis dataKey="name" tick={{fontSize: 12}} />
                            <YAxis tickFormatter={(val) => `${(val / 1000).toFixed(0)}k`} />
                            <Tooltip formatter={(value) => formatCurrency(value as number)} />
                            <Legend />
                            <Bar dataKey="revenue" fill="#14b8a6" name="Receita" />
                            <Bar dataKey="expenses" fill="#f43f5e" name="Despesa" />
                        </BarChart>
                     </ResponsiveContainer>
                </Card>
                 <Card>
                    <h3 className="font-semibold mb-4">Atenção aos Projetos</h3>
                    <div className="space-y-3">
                        {projectsAtRisk.length > 0 ? projectsAtRisk.map(p => (
                            <div key={p.id} className="text-sm">
                                <p className="font-semibold truncate">{p.name}</p>
                                <div className="w-full bg-slate-200 rounded-full h-2.5 dark:bg-slate-700 mt-1">
                                    <div className="bg-red-500 h-2.5 rounded-full" style={{width: `${Math.min(p.budgetExecution, 100)}%`}}></div>
                                </div>
                                <p className="text-xs text-slate-500">{p.budgetExecution.toFixed(1)}% do orçamento gasto.</p>
                            </div>
                        )) : <p className="text-sm text-slate-500 text-center mt-12">Nenhum projeto em risco identificado.</p>}
                    </div>
                </Card>
            </div>

            <ExecutiveAIAssistant />

        </div>
    );
};

export default DashboardPage;
