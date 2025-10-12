import React, { useState, useEffect, useMemo } from 'react';
import type { Budget, BudgetLineItem, BudgetItem } from '../../types';
import Modal from './Modal';
import { v4 as uuidv4 } from 'uuid';

interface BudgetModalProps {
  budget: Budget | null;
  onClose: () => void;
  onSave: (budget: Budget) => void;
  budgetItems: BudgetItem[];
}

const BudgetModal: React.FC<BudgetModalProps> = ({ budget, onClose, onSave, budgetItems }) => {
  const [formData, setFormData] = useState<Budget>(
    budget || {
      id: uuidv4(),
      name: `Orçamento Anual ${new Date().getFullYear()}`,
      year: new Date().getFullYear(),
      status: 'Planejamento',
      lineItems: [],
    }
  );
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const { name, year, lineItems } = formData;
    setIsFormValid(!!name.trim() && year > 2000 && lineItems.length > 0 && lineItems.every(item => item.projectedValue > 0));
  }, [formData]);
  
  const availableBudgetItems = useMemo(() => {
      return budgetItems.filter(bi => !formData.lineItems.some(li => li.budgetItemId === bi.id));
  }, [budgetItems, formData.lineItems]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) : value,
    }));
  };
  
  const handleLineItemChange = (id: string, field: 'budgetItemId' | 'projectedValue', value: string) => {
    setFormData(prev => ({
        ...prev,
        lineItems: prev.lineItems.map(item => {
            if (item.id === id) {
                if (field === 'budgetItemId') {
                    const budgetItem = budgetItems.find(bi => bi.id === value);
                    return { ...item, budgetItemId: value, budgetItemName: budgetItem?.name || '', budgetItemCode: budgetItem?.code || '' };
                }
                return { ...item, [field]: parseFloat(value) || 0 };
            }
            return item;
        })
    }));
  };

  const addLineItem = () => {
      if (availableBudgetItems.length === 0) return;
      const firstAvailable = availableBudgetItems[0];
      const newLineItem: BudgetLineItem = {
          id: uuidv4(),
          budgetItemId: firstAvailable.id,
          budgetItemName: firstAvailable.name,
          budgetItemCode: firstAvailable.code,
          projectedValue: 0,
      };
      setFormData(prev => ({ ...prev, lineItems: [...prev.lineItems, newLineItem] }));
  };
  
  const removeLineItem = (id: string) => {
      setFormData(prev => ({ ...prev, lineItems: prev.lineItems.filter(item => item.id !== id) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      onSave(formData);
      onClose();
    }
  };

  const totalProjected = useMemo(() => formData.lineItems.reduce((sum, item) => sum + item.projectedValue, 0), [formData.lineItems]);
  const formatCurrency = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });


  return (
    <Modal isOpen={true} onClose={onClose} title={budget ? 'Editar Orçamento' : 'Novo Orçamento'}>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Nome do Orçamento</label>
              <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm bg-white dark:bg-slate-700" />
            </div>
            <div>
              <label htmlFor="year" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Ano</label>
              <input type="number" name="year" id="year" value={formData.year} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm bg-white dark:bg-slate-700" />
            </div>
          </div>
          <fieldset className="p-4 border border-slate-200 dark:border-slate-600 rounded-lg">
                <legend className="px-2 font-semibold text-sm">Linhas Orçamentárias</legend>
                <div className="space-y-2 mt-2 max-h-60 overflow-y-auto">
                    {formData.lineItems.map(item => (
                        <div key={item.id} className="grid grid-cols-12 gap-2 items-center">
                            <select value={item.budgetItemId} onChange={e => handleLineItemChange(item.id, 'budgetItemId', e.target.value)} className="col-span-6 mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md sm:text-sm bg-white dark:bg-slate-700">
                                <option value={item.budgetItemId} disabled>{item.budgetItemCode} - {item.budgetItemName}</option>
                                {availableBudgetItems.map(bi => <option key={bi.id} value={bi.id}>{bi.code} - {bi.name}</option>)}
                            </select>
                             <input type="number" placeholder="Valor" value={item.projectedValue || ''} onChange={e => handleLineItemChange(item.id, 'projectedValue', e.target.value)} className="col-span-5 mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md sm:text-sm bg-white dark:bg-slate-700"/>
                             <button type="button" onClick={() => removeLineItem(item.id)} className="col-span-1 text-red-500 hover:text-red-700 text-lg">&times;</button>
                        </div>
                    ))}
                </div>
                 <button type="button" onClick={addLineItem} disabled={availableBudgetItems.length === 0} className="text-sm text-teal-600 hover:text-teal-800 dark:text-teal-400 dark:hover:text-teal-200 font-medium mt-2 disabled:text-slate-400 disabled:cursor-not-allowed">+ Adicionar Rubrica</button>
          </fieldset>
          <div className="p-4 bg-slate-100 dark:bg-slate-700/50 rounded-lg text-right">
              <span className="font-semibold">Valor Total Orçado: </span>
              <span className="text-lg font-bold text-teal-600 dark:text-teal-400">{formatCurrency(totalProjected)}</span>
          </div>
        </div>
        <div className="mt-6 flex justify-end space-x-2">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 dark:bg-slate-600 rounded-lg">Cancelar</button>
          <button type="submit" disabled={!isFormValid} className="px-4 py-2 bg-teal-600 text-white rounded-lg disabled:bg-slate-400">Salvar</button>
        </div>
      </form>
    </Modal>
  );
};

export default BudgetModal;
