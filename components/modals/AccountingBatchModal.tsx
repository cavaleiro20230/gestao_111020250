import React, { useState, useEffect, useMemo } from 'react';
import type { AccountingBatch, AccountingEntry, ChartOfAccount } from '../../types';
import Modal from './Modal';
import { v4 as uuidv4 } from 'uuid';

interface AccountingBatchModalProps {
  batch: AccountingBatch | null;
  onClose: () => void;
  onSave: (batch: AccountingBatch) => void;
  chartOfAccounts: ChartOfAccount[];
}

const AccountingBatchModal: React.FC<AccountingBatchModalProps> = ({ batch, onClose, onSave, chartOfAccounts }) => {
  const [formData, setFormData] = useState<AccountingBatch>(
    batch || { 
        id: uuidv4(),
        batchNumber: 0, // Will be set on save if new
        referenceDate: new Date().toISOString().split('T')[0],
        description: '',
        status: 'Em Digitação',
        entries: [],
    }
  );

  const isReadOnly = batch?.status === 'Contabilizado' || !!batch?.sourceDocumentId;
  
  const { totalDebit, totalCredit, isBalanced } = useMemo(() => {
    const totals = formData.entries.reduce((acc, entry) => {
        acc.debit += Number(entry.debit) || 0;
        acc.credit += Number(entry.credit) || 0;
        return acc;
    }, { debit: 0, credit: 0 });
    return {
        totalDebit: totals.debit,
        totalCredit: totals.credit,
        isBalanced: totals.debit === totals.credit && totals.debit > 0
    };
  }, [formData.entries]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEntryChange = (id: string, field: keyof AccountingEntry, value: string | number) => {
    setFormData(prev => ({
        ...prev,
        entries: prev.entries.map(entry => {
            if (entry.id === id) {
                if(field === 'debit') return { ...entry, debit: Number(value), credit: 0 };
                if(field === 'credit') return { ...entry, credit: Number(value), debit: 0 };
                return { ...entry, [field]: value };
            }
            return entry;
        })
    }));
  };
  
  const addEntry = () => {
      setFormData(prev => ({
          ...prev,
          entries: [...prev.entries, { id: uuidv4(), chartOfAccountId: '', description: '', debit: 0, credit: 0 }]
      }));
  };

  const removeEntry = (id: string) => {
    setFormData(prev => ({ ...prev, entries: prev.entries.filter(entry => entry.id !== id) }));
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isBalanced && formData.status !== 'Em Digitação') {
        alert("O lote não pode ser salvo pois os débitos e créditos não batem.");
        return;
    }
    onSave(formData);
    onClose();
  };

  const formatCurrency = (value: number) => value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <Modal isOpen={true} onClose={onClose} title={batch ? `Detalhes do Lote #${String(batch.batchNumber).padStart(5, '0')}` : 'Novo Lote Manual'}>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="referenceDate" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Data de Referência</label>
                    <input type="date" name="referenceDate" id="referenceDate" value={formData.referenceDate} onChange={handleChange} required disabled={isReadOnly} className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm bg-white dark:bg-slate-700 disabled:bg-slate-100 dark:disabled:bg-slate-800" />
                </div>
                <div>
                     <label htmlFor="status" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Status</label>
                     <input type="text" name="status" id="status" value={formData.status} readOnly className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm sm:text-sm bg-slate-100 dark:bg-slate-800" />
                </div>
            </div>
             <div>
                <label htmlFor="description" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Descrição</label>
                <input type="text" name="description" id="description" value={formData.description} onChange={handleChange} required disabled={isReadOnly} className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm bg-white dark:bg-slate-700 disabled:bg-slate-100 dark:disabled:bg-slate-800" />
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-semibold">Lançamentos</h3>
                <div className="mt-2 space-y-2">
                    {formData.entries.map((entry) => (
                        <div key={entry.id} className="grid grid-cols-12 gap-2 items-center">
                            <select value={entry.chartOfAccountId} disabled={isReadOnly} onChange={(e) => handleEntryChange(entry.id, 'chartOfAccountId', e.target.value)} className="col-span-4 mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm bg-white dark:bg-slate-700 disabled:bg-slate-100 dark:disabled:bg-slate-800">
                                <option value="" disabled>Selecione a conta</option>
                                {chartOfAccounts.map(c => <option key={c.id} value={c.id}>{c.code} - {c.name}</option>)}
                            </select>
                            <input type="number" placeholder="Débito" value={entry.debit > 0 ? entry.debit : ''} disabled={isReadOnly} onChange={(e) => handleEntryChange(entry.id, 'debit', e.target.value)} className="col-span-3 mt-1 text-right block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm sm:text-sm bg-white dark:bg-slate-700 disabled:bg-slate-100 dark:disabled:bg-slate-800" />
                            <input type="number" placeholder="Crédito" value={entry.credit > 0 ? entry.credit : ''} disabled={isReadOnly} onChange={(e) => handleEntryChange(entry.id, 'credit', e.target.value)} className="col-span-3 mt-1 text-right block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm sm:text-sm bg-white dark:bg-slate-700 disabled:bg-slate-100 dark:disabled:bg-slate-800" />
                            {!isReadOnly && <button type="button" onClick={() => removeEntry(entry.id)} className="col-span-2 text-red-500 hover:text-red-700">Remover</button>}
                        </div>
                    ))}
                    {!isReadOnly && <button type="button" onClick={addEntry} className="text-sm text-teal-600 hover:text-teal-800 dark:text-teal-400 dark:hover:text-teal-200 font-medium mt-2">+ Adicionar Lançamento</button>}
                </div>
                 <div className="mt-4 pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-end space-x-4 font-mono">
                     <span className="font-semibold">Débito: {formatCurrency(totalDebit)}</span>
                     <span className="font-semibold">Crédito: {formatCurrency(totalCredit)}</span>
                     <span className={`font-bold ${isBalanced ? 'text-green-500' : 'text-red-500'}`}>Diferença: {formatCurrency(totalDebit - totalCredit)}</span>
                 </div>
            </div>
        </div>
        <div className="mt-6 flex justify-end space-x-2">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-white rounded-lg hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors">Fechar</button>
          {!isReadOnly && <button type="submit" className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors shadow-sm">Salvar</button>}
        </div>
      </form>
    </Modal>
  );
};

export default AccountingBatchModal;
