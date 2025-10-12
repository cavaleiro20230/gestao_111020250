import React, { useState, useEffect } from 'react';
import type { Supplier } from '../../types';
import Modal from './Modal';
import { v4 as uuidv4 } from 'uuid';

interface SupplierModalProps {
  supplier: Supplier | null;
  onClose: () => void;
  onSave: (supplier: Supplier) => void;
}

const SupplierModal: React.FC<SupplierModalProps> = ({ supplier, onClose, onSave }) => {
  const [formData, setFormData] = useState<Supplier>(
    supplier || { id: uuidv4(), name: '', contactPerson: '', email: '', phone: '' }
  );
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const { name, email } = formData;
    setIsFormValid(!!name.trim() && !!email.trim());
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(isFormValid) {
        onSave(formData);
        onClose();
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} title={supplier ? 'Editar Fornecedor' : 'Novo Fornecedor'}>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Nome do Fornecedor</label>
            <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm bg-white dark:bg-slate-700" />
          </div>
          <div>
            <label htmlFor="contactPerson" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Pessoa de Contato</label>
            <input type="text" name="contactPerson" id="contactPerson" value={formData.contactPerson} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm bg-white dark:bg-slate-700" />
          </div>
           <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
            <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm bg-white dark:bg-slate-700" />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Telefone</label>
            <input type="tel" name="phone" id="phone" value={formData.phone} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm bg-white dark:bg-slate-700" />
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

export default SupplierModal;
