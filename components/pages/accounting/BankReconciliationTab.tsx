// FIX: Create missing BankReconciliationTab.tsx component
import React, { useState, useContext, useMemo } from 'react';
import { AppContext } from '../../../App';
import type { BankStatementLine, AccountPayable, AccountReceivable } from '../../../types';
import { SparklesIcon } from '../../icons';
import { useToast } from '../../../contexts/ToastContext';

type SystemTransaction = (AccountPayable | AccountReceivable) & { transType: 'ap' | 'ar' };

const BankReconciliationTab: React.FC = () => {
    const [selectedStatementLines, setSelectedStatementLines] = useState<string[]>([]);
    const [selectedSystemTrans, setSelectedSystemTrans] = useState<string[]>([]);
    const [isLoadingAI, setIsLoadingAI] = useState(false);
    const { showToast } = useToast();

    const context = useContext(AppContext);
    if (!context) return null;

    const { bankStatementLines, accountsPayable, accountsReceivable, handleReconcileTransactions } = context;

    const unreconciledStatementLines = useMemo(() => bankStatementLines.filter(l => !l.reconciled), [bankStatementLines]);
    const unreconciledSystemTrans: SystemTransaction[] = useMemo(() => [
        ...accountsPayable.filter(t => t.status === 'Pago' && !t.reconciled).map(t => ({ ...t, transType: 'ap' as const })),
        ...accountsReceivable.filter(t => t.status === 'Pago' && !t.reconciled).map(t => ({ ...t, transType: 'ar' as const })),
    ], [accountsPayable, accountsReceivable]);

    const formatCurrency = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    const toggleSelection = (id: string, type: 'statement' | 'system') => {
        const [selection, setSelection] = type === 'statement'
            ? [selectedStatementLines, setSelectedStatementLines]
            : [selectedSystemTrans, setSelectedSystemTrans];
        setSelection(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };
    
    const handleReconcile = () => {
        const statementTotal = selectedStatementLines.reduce((sum, id) => sum + (unreconciledStatementLines.find(l=>l.id===id)?.amount || 0), 0);
        const systemTotal = selectedSystemTrans.reduce((sum, id) => {
            const trans = unreconciledSystemTrans.find(t => t.id === id);
            if (!trans) return sum;
            return sum + (trans.transType === 'ar' ? trans.value : -trans.value);
        }, 0);

        if (Math.abs(statementTotal - systemTotal) > 0.01) {
            showToast('Os valores selecionados não batem. Verifique sua seleção.', 'error');
            return;
        }

        const systemIds = selectedSystemTrans.map(id => {
            const trans = unreconciledSystemTrans.find(t => t.id === id)!;
            return { type: trans.transType, id: trans.id };
        });

        handleReconcileTransactions(selectedStatementLines, systemIds);
        setSelectedStatementLines([]);
        setSelectedSystemTrans([]);
    };
    
    // Simplified AI suggestion
    const handleAISuggest = () => {
        setIsLoadingAI(true);
        setTimeout(() => {
            const newStatementSels: string[] = [];
            const newSystemSels: string[] = [];
            unreconciledStatementLines.forEach(line => {
                const match = unreconciledSystemTrans.find(trans => 
                    !newSystemSels.includes(trans.id) && 
                    Math.abs(line.amount - (trans.transType === 'ar' ? trans.value : -trans.value)) < 0.01
                );
                if (match) {
                    newStatementSels.push(line.id);
                    newSystemSels.push(match.id);
                }
            });
            setSelectedStatementLines(newStatementSels);
            setSelectedSystemTrans(newSystemSels);
            setIsLoadingAI(false);
            showToast(`IA sugeriu ${newStatementSels.length} pare(s) para conciliação.`, 'info');
        }, 1000);
    };

    const statementTotal = selectedStatementLines.reduce((sum, id) => sum + (unreconciledStatementLines.find(l=>l.id===id)?.amount || 0), 0);
    const systemTotal = selectedSystemTrans.reduce((sum, id) => {
        const trans = unreconciledSystemTrans.find(t => t.id === id);
        if (!trans) return sum;
        return sum + (trans.transType === 'ar' ? trans.value : -trans.value);
    }, 0);


    const renderRow = (item: any, type: 'statement' | 'system') => {
        const id = item.id;
        const isSelected = type === 'statement' ? selectedStatementLines.includes(id) : selectedSystemTrans.includes(id);
        const amount = type === 'statement' ? item.amount : (item.transType === 'ar' ? item.value : -item.value);
        const date = type === 'statement' ? item.date : item.paymentDate;

        return (
            <tr key={id} onClick={() => toggleSelection(id, type)} className={`cursor-pointer ${isSelected ? 'bg-teal-100 dark:bg-teal-900/50' : 'hover:bg-slate-50 dark:hover:bg-slate-700/30'}`}>
                <td className="px-4 py-2 text-sm">{new Date(date).toLocaleDateString('pt-BR')}</td>
                <td className="px-4 py-2 text-sm">{item.description}</td>
                <td className={`px-4 py-2 text-sm text-right font-mono ${amount > 0 ? 'text-green-600' : 'text-red-500'}`}>{formatCurrency(amount)}</td>
            </tr>
        );
    }

    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Conciliação Bancária</h3>
             <button onClick={handleAISuggest} disabled={isLoadingAI} className="flex items-center px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors shadow-sm disabled:opacity-50">
                <SparklesIcon className="w-5 h-5 mr-2" />
                {isLoadingAI ? 'Analisando...' : 'Sugerir com IA'}
            </button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Bank Statement */}
            <div className="border rounded-lg"><h4 className="p-3 font-semibold bg-slate-50 dark:bg-slate-700/50 rounded-t-lg">Extrato Bancário</h4><div className="max-h-96 overflow-y-auto"><table className="w-full"><tbody>{unreconciledStatementLines.map(line => renderRow(line, 'statement'))}</tbody></table></div></div>
            {/* System Transactions */}
            <div className="border rounded-lg"><h4 className="p-3 font-semibold bg-slate-50 dark:bg-slate-700/50 rounded-t-lg">Lançamentos do Sistema</h4><div className="max-h-96 overflow-y-auto"><table className="w-full"><tbody>{unreconciledSystemTrans.map(trans => renderRow(trans, 'system'))}</tbody></table></div></div>
        </div>
        <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg flex justify-between items-center">
            <div className="flex gap-6 text-sm">
                <div><span className="font-semibold">Extrato: </span><span className="font-mono">{formatCurrency(statementTotal)}</span></div>
                <div><span className="font-semibold">Sistema: </span><span className="font-mono">{formatCurrency(systemTotal)}</span></div>
                <div><span className="font-semibold">Diferença: </span><span className={`font-mono font-bold ${Math.abs(statementTotal-systemTotal) > 0.01 ? 'text-red-500' : 'text-green-600'}`}>{formatCurrency(statementTotal - systemTotal)}</span></div>
            </div>
            <button onClick={handleReconcile} disabled={selectedStatementLines.length === 0 || selectedSystemTrans.length === 0 || Math.abs(statementTotal-systemTotal) > 0.01} className="px-6 py-2 bg-teal-600 text-white rounded-lg disabled:bg-slate-400">
                Reconciliar Selecionados
            </button>
        </div>
      </div>
    );
};

export default BankReconciliationTab;