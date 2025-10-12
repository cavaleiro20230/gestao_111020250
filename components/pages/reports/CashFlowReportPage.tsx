// FIX: Create missing CashFlowReportPage.tsx component
import React, { useContext, useMemo, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts';
import Header from '../../Header';
import Card from '../../Card';
import { AppContext } from '../../../App';
import { Page } from '../../../types';

const CashFlowReportPage: React.FC = () => {
    const context = useContext(AppContext);
    const [monthsToShow, setMonthsToShow] = useState(6);
    if (!context) return null;

    const { accountsReceivable, accountsPayable, setActivePage } = context;

    const reportData = useMemo(() => {
        const data: { [key: string]: { name: string, received: number, paid: number, balance: number } } = {};
        const today = new Date();

        for (let i = monthsToShow - 1; i >= 0; i--) {
            const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
            const key = `${d.getFullYear()}-${d.getMonth()}`;
            const monthName = d.toLocaleString('default', { month: 'short' });
            data[key] = { name: monthName, received: 0, paid: 0, balance: 0 };
        }

        accountsReceivable.filter(a => a.status === 'Pago' && a.paymentDate).forEach(a => {
            const d = new Date(a.paymentDate!);
            const key = `${d.getFullYear()}-${d.getMonth()}`;
            if (data[key]) {
                data[key].received += a.value;
            }
        });

        accountsPayable.filter(a => a.status === 'Pago' && a.paymentDate).forEach(a => {
            const d = new Date(a.paymentDate!);
            const key = `${d.getFullYear()}-${d.getMonth()}`;
            if (data[key]) {
                data[key].paid += a.value;
            }
        });
        
        let cumulativeBalance = 0;
        return Object.values(data).map(monthData => {
            cumulativeBalance += monthData.received - monthData.paid;
            monthData.balance = cumulativeBalance;
            return monthData;
        });

    }, [accountsReceivable, accountsPayable, monthsToShow]);
    
    const totals = useMemo(() => {
        return reportData.reduce((acc, item) => ({
            received: acc.received + item.received,
            paid: acc.paid + item.paid,
        }), { received: 0, paid: 0 });
    }, [reportData]);

    const formatCurrency = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    return (
        <div className="p-8">
            <Header title="Relatório de Fluxo de Caixa" />
            <div className="mb-4">
                <button onClick={() => setActivePage(Page.Reports)} className="text-sm text-teal-600 hover:text-teal-800 dark:text-teal-400 dark:hover:text-teal-200 font-medium">
                    &larr; Voltar para Relatórios
                </button>
            </div>
            
            <Card className="mb-6">
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                    <div><p className="text-sm text-slate-500">Total Recebido</p><p className="text-2xl font-semibold text-green-600">{formatCurrency(totals.received)}</p></div>
                    <div><p className="text-sm text-slate-500">Total Pago</p><p className="text-2xl font-semibold text-red-500">{formatCurrency(totals.paid)}</p></div>
                    <div><p className="text-sm text-slate-500">Saldo Final</p><p className="text-2xl font-semibold">{formatCurrency(totals.received - totals.paid)}</p></div>
                 </div>
            </Card>

            <Card>
                 <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-white">Fluxo de Caixa Mensal</h3>
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={reportData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.2)" />
                        <XAxis dataKey="name" />
                        <YAxis tickFormatter={(val) => `${(val / 1000).toFixed(0)}k`} />
                        <Tooltip formatter={(value) => formatCurrency(value as number)} />
                        <Legend />
                        <Bar dataKey="received" fill="#14b8a6" name="Recebido" />
                        <Bar dataKey="paid" fill="#f43f5e" name="Pago" />
                    </BarChart>
                </ResponsiveContainer>
            </Card>
        </div>
    );
};

export default CashFlowReportPage;
