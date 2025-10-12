import React, { useState, useEffect } from 'react';
import type { Grant, FundingSource, User } from '../../types';
import Modal from './Modal';
import { v4 as uuidv4 } from 'uuid';

interface GrantModalProps {
  grant: Grant | null;
  onClose: () => void;
  onSave: (grant: Grant) => void;
  fundingSources: FundingSource[];
  users: User[];
}

const GrantModal: React.FC<GrantModalProps> = ({ grant, onClose, onSave, fundingSources, users }) => {
  const [formData, setFormData] = useState<Omit<Grant, 'fundingSourceName' | 'managerName'>>(
    grant || {
      id: uuidv4(),
      name: '',
      fundingSourceId: '',
      status: 'Proposta',
      proposalDate: new Date().toISOString().split('T')[0],
      totalValue: 0,
      managerId: '',
    }
  );
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const { name, fundingSourceId, totalValue, managerId } = formData;
    setIsFormValid(!!name.trim() && !!fundingSourceId && totalValue > 0 && !!managerId);
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
      const manager = users.find(u => u.id === formData.managerId);
      const fundingSource = fundingSources.find(fs => fs.id === formData.fundingSourceId);
      
      onSave({
        ...formData,
        managerName: manager?.name || 'N/A',
        fundingSourceName: fundingSource?.name || 'N/A'
      });
      onClose();
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} title={grant ? 'Editar Convênio' : 'Nova Proposta/Convênio'}>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Nome da Proposta/Convênio</label>
            <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm bg-white dark:bg-slate-700" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="fundingSourceId" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Fonte de Recurso (Órgão de Fomento)</label>
              <select name="fundingSourceId" id="fundingSourceId" value={formData.fundingSourceId} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm bg-white dark:bg-slate-700">
                <option value="" disabled>Selecione...</option>
                {fundingSources.map(fs => <option key={fs.id} value={fs.id}>{fs.name}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="totalValue" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Valor Total (R$)</label>
              <input type="number" name="totalValue" id="totalValue" value={formData.totalValue} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm bg-white dark:bg-slate-700" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="managerId" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Responsável (Coordenador)</label>
              <select name="managerId" id="managerId" value={formData.managerId} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm bg-white dark:bg-slate-700">
                <option value="" disabled>Selecione...</option>
                {users.filter(u => u.role === 'project_manager' || u.role === 'admin').map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
              </select>
            </div>
             <div>
              <label htmlFor="status" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Status</label>
              <select name="status" id="status" value={formData.status} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm bg-white dark:bg-slate-700">
                <option value="Proposta">Proposta</option>
                <option value="Em Análise">Em Análise</option>
                <option value="Aprovado">Aprovado</option>
                <option value="Rejeitado">Rejeitado</option>
                <option value="Ativo">Ativo</option>
                <option value="Encerrado">Encerrado</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="proposalDate" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Data da Proposta</label>
              <input type="date" name="proposalDate" id="proposalDate" value={formData.proposalDate} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm bg-white dark:bg-slate-700" />
            </div>
            <div>
              <label htmlFor="approvalDate" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Data de Aprovação</label>
              <input type="date" name="approvalDate" id="approvalDate" value={formData.approvalDate || ''} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm bg-white dark:bg-slate-700" />
            </div>
            <div>
              <label htmlFor="finalReportDueDate" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Venc. Relatório Final</label>
              <input type="date" name="finalReportDueDate" id="finalReportDueDate" value={formData.finalReportDueDate || ''} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm bg-white dark:bg-slate-700" />
            </div>
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
export default GrantModal;