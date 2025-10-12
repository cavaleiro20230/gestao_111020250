import React, { useState, useEffect } from 'react';
import type { FundingSource } from '../../types';
import Modal from './Modal';
import { v4 as uuidv4 } from 'uuid';

interface FundingSourceModalProps {
  source: FundingSource | null;
  onClose: () => void;
  onSave: (source: FundingSource) => void;
}

const FundingSourceModal: React.FC<FundingSourceModalProps> = ({ source, onClose, onSave }) => {
  const [formData, setFormData] = useState<FundingSource>(
    source || { id: uuidv4(), name: '', description: '' }
  );
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const { name } = formData;
    setIsFormValid(!!name.trim());
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
    <Modal isOpen={true} onClose={onClose} title={source ? 'Editar Fonte de Recurso' : 'Nova Fonte de Recurso'}>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Nome</label>
            <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required placeholder="Ex: Convênio XYZ, Doação ABC" className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm bg-white dark:bg-slate-700" />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Descrição</label>
            <textarea name="description" id="description" value={formData.description} onChange={handleChange} rows={3} className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm bg-white dark:bg-slate-700" />
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

export default FundingSourceModal;
