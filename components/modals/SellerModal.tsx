import React, { useState, useEffect } from 'react';
import type { Seller } from '../../types';
import Modal from './Modal';
import { v4 as uuidv4 } from 'uuid';

interface SellerModalProps {
  seller: Seller | null;
  onClose: () => void;
  onSave: (seller: Seller) => void;
}

const SellerModal: React.FC<SellerModalProps> = ({ seller, onClose, onSave }) => {
  const [formData, setFormData] = useState<Seller>(
    seller || { id: uuidv4(), name: '', email: '', commissionRate: 0 }
  );
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const { name, email, commissionRate } = formData;
    setIsFormValid(!!name.trim() && !!email.trim() && commissionRate >= 0);
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
        onSave(formData);
        onClose();
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} title={seller ? 'Editar Vendedor' : 'Novo Vendedor'}>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Nome do Vendedor</label>
            <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm bg-white dark:bg-slate-700" />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
            <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm bg-white dark:bg-slate-700" />
          </div>
          <div>
            <label htmlFor="commissionRate" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Taxa de Comissão (%)</label>
            <input type="number" name="commissionRate" id="commissionRate" value={formData.commissionRate} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm bg-white dark:bg-slate-700" />
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

export default SellerModal;
