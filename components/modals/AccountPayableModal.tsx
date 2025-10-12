import React, { useState, useEffect } from 'react';
import type { AccountPayable, Document } from '../../types';
import Modal from './Modal';
import { v4 as uuidv4 } from 'uuid';

interface AccountPayableModalProps {
  account: AccountPayable | null;
  onClose: () => void;
  onSave: (account: AccountPayable, paymentDate: string) => void;
  costCenters: string[];
  documents: Document[];
}

const AccountPayableModal: React.FC<AccountPayableModalProps> = ({ account, onClose, onSave, costCenters, documents }) => {
  const [formData, setFormData] = useState<AccountPayable>(
    account || { 
        id: uuidv4(), 
        description: '', 
        category: '', 
        value: 0, 
        dueDate: new Date().toISOString().split('T')[0], 
        status: 'Aberto',
        costCenter: '',
        paymentDate: '',
        documentId: '',
        reconciled: false,
    }
  );
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const { description, value, status, paymentDate } = formData;
    const isPaymentDateValid = status === 'Pago' ? !!paymentDate : true;
    setIsFormValid(!!description.trim() && value > 0 && isPaymentDateValid);
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => {
        const newState = {
            ...prev,
            [name]: type === 'number' ? parseFloat(value) : value,
        };
        // Set payment date to today if status becomes 'Pago' and there's no date
        if (name === 'status' && value === 'Pago' && !newState.paymentDate) {
            newState.paymentDate = new Date().toISOString().split('T')[0];
        }
        return newState;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(isFormValid) {
        const dataToSave = {
            ...formData,
            id: formData.id || uuidv4() // Ensure new items get an ID
        };
        onSave(dataToSave, dataToSave.paymentDate || new Date().toISOString().split('T')[0]);
        onClose();
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} title={account ? 'Editar Conta a Pagar' : 'Nova Conta a Pagar'}>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Descrição</label>
            <input type="text" name="description" id="description" value={formData.description} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm bg-white dark:bg-slate-700" />
          </div>
           <div>
            <label htmlFor="documentId" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Anexar Documento (Opcional)</label>
            <select name="documentId" id="documentId" value={formData.documentId} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm bg-white dark:bg-slate-700">
                <option value="">Nenhum</option>
                {documents.map(doc => <option key={doc.id} value={doc.id}>{doc.name}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Categoria</label>
            <input type="text" name="category" id="category" value={formData.category} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm bg-white dark:bg-slate-700" />
          </div>
          <div>
            <label htmlFor="costCenter" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Centro de Custo</label>
            <select name="costCenter" id="costCenter" value={formData.costCenter} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm bg-white dark:bg-slate-700">
                <option value="">Nenhum</option>
                {costCenters.map(cc => <option key={cc} value={cc}>{cc}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="value" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Valor (R$)</label>
            <input type="number" name="value" id="value" value={formData.value} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm bg-white dark:bg-slate-700" />
          </div>
          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Data de Vencimento</label>
            <input type="date" name="dueDate" id="dueDate" value={formData.dueDate} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm bg-white dark:bg-slate-700" />
          </div>
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Status</label>
            <select name="status" id="status" value={formData.status} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm bg-white dark:bg-slate-700">
                <option value="Aberto">Aberto</option>
                <option value="Pago">Pago</option>
                <option value="Vencido">Vencido</option>
            </select>
          </div>
          {formData.status === 'Pago' && (
            <div>
              <label htmlFor="paymentDate" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Data de Pagamento</label>
              <input type="date" name="paymentDate" id="paymentDate" value={formData.paymentDate} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm bg-white dark:bg-slate-700" />
            </div>
          )}
        </div>
        <div className="mt-6 flex justify-end space-x-2">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-white rounded-lg hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors">Cancelar</button>
          <button type="submit" disabled={!isFormValid} className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors shadow-sm disabled:bg-slate-400 disabled:cursor-not-allowed">Salvar</button>
        </div>
      </form>
    </Modal>
  );
};

export default AccountPayableModal;