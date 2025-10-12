import React, { useState, useEffect } from 'react';
import type { ChartOfAccount } from '../../types';
import Modal from './Modal';
import { v4 as uuidv4 } from 'uuid';

interface ChartOfAccountModalProps {
  account: ChartOfAccount | null;
  onClose: () => void;
  onSave: (account: ChartOfAccount) => void;
}

const ChartOfAccountModal: React.FC<ChartOfAccountModalProps> = ({ account, onClose, onSave }) => {
  const [formData, setFormData] = useState<ChartOfAccount>(
    account || { id: uuidv4(), code: '', name: '', type: 'Despesa' }
  );
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const { name, code, type } = formData;
    setIsFormValid(!!name.trim() && !!code.trim() && !!type);
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
        onSave(formData);
        onClose();
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} title={account ? 'Editar Conta' : 'Nova Conta'}>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="code" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Código</label>
            <input type="text" name="code" id="code" value={formData.code} onChange={handleChange} required placeholder="Ex: 1.1.01" className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm bg-white dark:bg-slate-700" />
          </div>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Nome da Conta</label>
            <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm bg-white dark:bg-slate-700" />
          </div>
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Tipo</label>
            <select name="type" id="type" value={formData.type} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm bg-white dark:bg-slate-700">
                <option value="Receita">Receita</option>
                <option value="Despesa">Despesa</option>
                <option value="Ativo">Ativo</option>
                <option value="Passivo">Passivo</option>
                <option value="Patrimônio Líquido">Patrimônio Líquido</option>
            </select>
          </div>
        </div>
        <div className="mt-6 flex justify-end space-x-2">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-white rounded-lg hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors">Cancelar</button>
          <button type="submit" disabled={!isFormValid} className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors shadow-sm disabled:bg-slate-400 disabled:cursor-not-allowed">Salvar</button>
        </div>
      </form>
    </Modal>
  );
};

export default ChartOfAccountModal;
