import React, { useState, useContext, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { AccountingConfig, ChartOfAccount } from '../../../types';
import Header from '../../Header';
import Card from '../../Card';
import { AppContext } from '../../../App';
import { useToast } from '../../../contexts/ToastContext';
import { suggestChartOfAccount } from '../../../services/geminiService';
import { SparklesIcon, ExclamationTriangleIcon } from '../../icons';

interface AccountingConfigFormProps {
    config: AccountingConfig;
    onSave: (newConfig: AccountingConfig) => void;
    onBack: () => void;
    chartOfAccounts: ChartOfAccount[];
}

const AccountingConfigForm: React.FC<AccountingConfigFormProps> = ({ config, onSave, onBack, chartOfAccounts }) => {
    const [formData, setFormData] = useState<AccountingConfig>({
        ...config,
        payableCategoryMappings: config.payableCategoryMappings || []
    });
    const [isLoadingAI, setIsLoadingAI] = useState<string | null>(null); // Store mapping ID being loaded
    const context = useContext(AppContext);
    const { showToast } = useToast();

    const uniqueCategories = useMemo(() => {
        const categories = new Set(context?.accountsPayable.map(ap => ap.category) || []);
        return Array.from(categories).sort();
    }, [context?.accountsPayable]);

    const expenseAccounts = useMemo(() => {
        return chartOfAccounts.filter(c => c.type === 'Despesa').sort((a,b) => a.code.localeCompare(b.code));
    }, [chartOfAccounts]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({...prev, [name]: value }));
    };

    const handleMappingChange = (id: string, field: 'category' | 'debitAccountId', value: string) => {
        setFormData(prev => ({
            ...prev,
            payableCategoryMappings: prev.payableCategoryMappings.map(m => m.id === id ? { ...m, [field]: value } : m)
        }));
    };

    const addMapping = () => {
        setFormData(prev => ({
            ...prev,
            payableCategoryMappings: [
                ...(prev.payableCategoryMappings || []),
                { id: uuidv4(), category: '', debitAccountId: '' }
            ]
        }));
    };

    const removeMapping = (id: string) => {
        setFormData(prev => ({
            ...prev,
            payableCategoryMappings: prev.payableCategoryMappings.filter(m => m.id !== id)
        }));
    };

    const handleSuggest = async (mappingId: string, category: string) => {
        if (!category) {
            showToast('Selecione uma categoria primeiro.', 'info');
            return;
        }
        setIsLoadingAI(mappingId);
        try {
            const suggestedAccountId = await suggestChartOfAccount(category, expenseAccounts);
            handleMappingChange(mappingId, 'debitAccountId', suggestedAccountId);
            showToast('Sugestão da IA aplicada!', 'success');
        } catch (error: any) {
            showToast(error.message, 'error');
        } finally {
            setIsLoadingAI(null);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    const inputClass = "mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm bg-white dark:bg-slate-700";
    const labelClass = "block text-sm font-medium text-slate-700 dark:text-slate-300";

    return (
        <div>
            <Header title="Configurações Contábeis" />
            <Card>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-6">
                        <div>
                            <label htmlFor="closingDate" className={labelClass}>Data de Fechamento Contábil</label>
                            <input type="date" name="closingDate" id="closingDate" value={formData.closingDate} onChange={handleChange} required className={inputClass} />
                             <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Nenhum lançamento financeiro poderá ser alterado em data anterior ou igual à informada.</p>
                        </div>

                        <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                            <h4 className="text-md font-semibold">Parametrização de Contas Padrão (De/Para)</h4>
                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Defina as contas padrão para a integração automática. Elas serão usadas caso nenhuma regra específica por categoria seja encontrada.</p>
                        </div>
                        
                        <fieldset className="p-4 border border-slate-200 dark:border-slate-600 rounded-lg">
                            <legend className="px-2 font-semibold text-sm">Contas a Pagar</legend>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                                <div>
                                    <label htmlFor="payableDebitAccountId" className={labelClass}>Conta de Débito Padrão (Despesa)</label>
                                    <select name="payableDebitAccountId" id="payableDebitAccountId" value={formData.payableDebitAccountId} onChange={handleChange} className={inputClass}>
                                        {chartOfAccounts.filter(c => c.type === 'Despesa').map(c => <option key={c.id} value={c.id}>{c.code} - {c.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="payableCreditAccountId" className={labelClass}>Conta de Crédito Padrão (Caixa/Banco)</label>
                                     <select name="payableCreditAccountId" id="payableCreditAccountId" value={formData.payableCreditAccountId} onChange={handleChange} className={inputClass}>
                                        {chartOfAccounts.filter(c => c.type === 'Ativo').map(c => <option key={c.id} value={c.id}>{c.code} - {c.name}</option>)}
                                    </select>
                                </div>
                            </div>
                        </fieldset>

                        <fieldset className="p-4 border border-slate-200 dark:border-slate-600 rounded-lg">
                            <legend className="px-2 font-semibold text-sm">Contas a Receber</legend>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                                <div>
                                    <label htmlFor="receivableDebitAccountId" className={labelClass}>Conta de Débito Padrão (Caixa/Banco)</label>
                                    <select name="receivableDebitAccountId" id="receivableDebitAccountId" value={formData.receivableDebitAccountId} onChange={handleChange} className={inputClass}>
                                        {chartOfAccounts.filter(c => c.type === 'Ativo').map(c => <option key={c.id} value={c.id}>{c.code} - {c.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="receivableCreditAccountId" className={labelClass}>Conta de Crédito Padrão (Receita)</label>
                                     <select name="receivableCreditAccountId" id="receivableCreditAccountId" value={formData.receivableCreditAccountId} onChange={handleChange} className={inputClass}>
                                        {chartOfAccounts.filter(c => c.type === 'Receita').map(c => <option key={c.id} value={c.id}>{c.code} - {c.name}</option>)}
                                    </select>
                                </div>
                            </div>
                        </fieldset>
                        
                        <fieldset className="p-4 border border-teal-500/50 dark:border-teal-500/50 rounded-lg bg-teal-50/20 dark:bg-teal-900/10">
                            <legend className="px-2 font-semibold text-sm flex items-center gap-2"><SparklesIcon className="w-5 h-5 text-teal-500"/>Mapeamento de Despesas por Categoria</legend>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-4">
                                Crie regras específicas para debitar despesas em contas contábeis diferentes com base na categoria do lançamento.
                            </p>
                            <div className="space-y-3">
                                {(formData.payableCategoryMappings || []).map((mapping) => {
                                    const selectedAccount = chartOfAccounts.find(c => c.id === mapping.debitAccountId);
                                    return (
                                        <div key={mapping.id} className="grid grid-cols-12 gap-2 items-center">
                                            <div className="col-span-12 md:col-span-4">
                                                <label className="text-xs font-medium text-slate-500">Se a Categoria da Despesa for</label>
                                                <select
                                                    value={mapping.category}
                                                    onChange={(e) => handleMappingChange(mapping.id, 'category', e.target.value)}
                                                    className={inputClass}
                                                >
                                                    <option value="" disabled>Selecione a categoria</option>
                                                    {/* FIX: Explicitly type `cat` as `string` to resolve TypeScript inference error. */}
                                                    {uniqueCategories.map((cat: string) => <option key={cat} value={cat}>{cat}</option>)}
                                                </select>
                                            </div>
                                            <div className="col-span-12 md:col-span-7 flex items-center gap-2">
                                                <div className="flex-grow">
                                                <label className="text-xs font-medium text-slate-500">Debitar na Conta Contábil</label>
                                                <select
                                                        value={mapping.debitAccountId}
                                                        onChange={(e) => handleMappingChange(mapping.id, 'debitAccountId', e.target.value)}
                                                        className={inputClass}
                                                    >
                                                        <option value="" disabled>Selecione a conta de despesa</option>
                                                        {expenseAccounts.map(c => <option key={c.id} value={c.id}>{c.code} - {c.name}</option>)}
                                                    </select>
                                                </div>
                                                <div className="pt-5">
                                                    <button
                                                        type="button"
                                                        title="Sugerir com IA"
                                                        disabled={isLoadingAI === mapping.id}
                                                        onClick={() => handleSuggest(mapping.id, mapping.category)}
                                                        className="p-2 bg-sky-100 text-sky-600 dark:bg-sky-900/50 dark:text-sky-300 rounded-md hover:bg-sky-200 disabled:opacity-50"
                                                    >
                                                        {isLoadingAI === mapping.id ? <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500"></div> : <SparklesIcon className="w-5 h-5" />}
                                                    </button>
                                                </div>
                                                {selectedAccount && selectedAccount.type !== 'Despesa' && (
                                                    <div className="pt-5" title={`Atenção: '${selectedAccount.name}' é uma conta do tipo '${selectedAccount.type}', não 'Despesa'.`}>
                                                        <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="col-span-12 md:col-span-1 pt-5 text-right md:text-center">
                                                <button
                                                    type="button"
                                                    title="Remover Mapeamento"
                                                    onClick={() => removeMapping(mapping.id)}
                                                    className="p-2 text-red-500 hover:text-red-700 font-bold"
                                                >
                                                    &times;
                                                </button>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                            <button
                                type="button"
                                onClick={addMapping}
                                className="mt-4 text-sm text-teal-600 hover:text-teal-800 dark:text-teal-400 dark:hover:text-teal-200 font-medium"
                            >
                                + Adicionar Mapeamento
                            </button>
                        </fieldset>

                    </div>
                    <div className="mt-6 flex justify-end space-x-2">
                        <button type="button" onClick={onBack} className="px-4 py-2 bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-white rounded-lg hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors">Voltar</button>
                        <button type="submit" className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors shadow-sm">Salvar</button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default AccountingConfigForm;