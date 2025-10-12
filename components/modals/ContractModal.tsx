import React, { useState, useEffect } from 'react';
import type { Contract, Client } from '../../types';
import Modal from './Modal';
import { v4 as uuidv4 } from 'uuid';

interface ContractModalProps {
  contract: Contract | null;
  onClose: () => void;
  onSave: (contract: Contract) => void;
  clients: Client[];
}

const ContractModal: React.FC<ContractModalProps> = ({ contract, onClose, onSave, clients }) => {
  const [formData, setFormData] = useState<Contract>(
    // FIX: Added clientName to the initial state to match the Contract type.
    contract || { 
        id: uuidv4(), 
        clientId: '', 
        clientName: '',
        startDate: new Date().toISOString().split('T')[0], 
        endDate: '', 
        value: 0, 
        status: 'Ativo' 
    }
  );
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const { clientId, startDate, endDate, value } = formData;
    const isDatesValid = startDate && endDate && new Date(endDate) >= new Date(startDate);
    setIsFormValid(!!clientId && isDatesValid && value > 0);
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
        // FIX: Ensure clientName is correctly set based on clientId before saving.
        const client = clients.find(c => c.id === formData.clientId);
        onSave({
            ...formData,
            clientName: client ? client.name : ''
        });
        onClose();
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} title={contract ? 'Editar Contrato' : 'Novo Contrato'}>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="clientId" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Cliente</label>
            <select name="clientId" id="clientId" value={formData.clientId} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm bg-white dark:bg-slate-700">
              <option value="" disabled>Selecione um cliente</option>
              {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Data de Início</label>
            <input type="date" name="startDate" id="startDate" value={formData.startDate} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm bg-white dark:bg-slate-700" />
          </div>
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Data de Fim</label>
            <input type="date" name="endDate" id="endDate" value={formData.endDate} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm bg-white dark:bg-slate-700" />
          </div>
           <div>
            <label htmlFor="value" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Valor (R$)</label>
            <input type="number" name="value" id="value" value={formData.value} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm bg-white dark:bg-slate-700" />
          </div>
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Status</label>
            <select name="status" id="status" value={formData.status} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm bg-white dark:bg-slate-700">
                <option value="Ativo">Ativo</option>
                <option value="Encerrado">Encerrado</option>
                <option value="Cancelado">Cancelado</option>
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

export default ContractModal;