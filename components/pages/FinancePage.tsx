import React, { useContext } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Header from '../Header';
import Card from '../Card';
import { FINANCIAL_DASHBOARD_DATA } from '../../services/mockData';
import AIAssistant from '../AIAssistant';
import { Page } from '../../types';
import { AppContext } from '../../App';
import { ArrowDownIcon, ArrowUpIcon } from '../icons';

const COLORS = ['#0d9488', '#0ea5e9', '#14b8a6', '#67e8f9', '#a7f3d0'];

const FinancePage: React.FC = () => {
  const context = useContext(AppContext);
  if (!context) return null;

  const { accountsPayable, accountsReceivable, setActivePage } = context;

  const totalReceivable = accountsReceivable.filter(a => a.status === 'Aberto' || a.status === 'Vencido').reduce((sum, item) => sum + item.value, 0);
  const totalPayable = accountsPayable.filter(a => a.status === 'Aberto' || a.status === 'Vencido').reduce((sum, item) => sum + item.value, 0);

  const formatCurrency = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });


  return (
    <div className="p-8">
      <Header title="Resumo Financeiro" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActivePage(Page.AccountsReceivable)}>
              <div className="flex items-center">
                  <div className="p-3 bg-green-100 dark:bg-green-900/50 rounded-lg mr-4">
                      <ArrowDownIcon className="h-6 w-6 text-green-600 dark:text-green-300" />
                  </div>
                  <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Total a Receber</p>
                      <p className="text-2xl font-semibold text-slate-800 dark:text-white">{formatCurrency(totalReceivable)}</p>
                  </div>
              </div>
          </Card>
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActivePage(Page.AccountsPayable)}>
              <div className="flex items-center">
                   <div className="p-3 bg-red-100 dark:bg-red-900/50 rounded-lg mr-4">
                      <ArrowUpIcon className="h-6 w-6 text-red-600 dark:text-red-300" />
                  </div>
                  <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Total a Pagar</p>
                      <p className="text-2xl font-semibold text-slate-800 dark:text-white">{formatCurrency(totalPayable)}</p>
                  </div>
              </div>
          </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <Card>
            <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-white">Performance Mensal (Receita vs. Despesa)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={FINANCIAL_DASHBOARD_DATA.monthlyPerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.2)" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(30, 41, 59, 0.8)',
                    borderColor: 'rgba(255, 255, 255, 0.2)'
                  }} 
                />
                <Legend />
                <Bar dataKey="revenue" fill="#14b8a6" name="Receita" />
                <Bar dataKey="expenses" fill="#f43f5e" name="Despesa" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        <div className="lg:col-span-2">
            <Card>
                <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-white">Top Categorias de Despesa</h3>
                <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                    data={FINANCIAL_DASHBOARD_DATA.topExpenseCategories}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                    {FINANCIAL_DASHBOARD_DATA.topExpenseCategories.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(30, 41, 59, 0.8)',
                        borderColor: 'rgba(255, 255, 255, 0.2)'
                      }} 
                    />
                </PieChart>
                </ResponsiveContainer>
            </Card>
        </div>

        <div className="lg:col-span-5">
            <AIAssistant data={FINANCIAL_DASHBOARD_DATA} />
        </div>

      </div>
    </div>
  );
};

export default FinancePage;
