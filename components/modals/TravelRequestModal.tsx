import React, { useState, useEffect } from 'react';
import type { TravelRequest, Personnel, Project } from '../../types';
import Modal from './Modal';
import { v4 as uuidv4 } from 'uuid';
import { getExchangeRates } from '../../services/currencyService';

interface TravelRequestModalProps {
  request: TravelRequest | null;
  onClose: () => void;
  onSave: (request: TravelRequest) => void;
  personnel: Personnel[];
  projects: Project[];
}

const TravelRequestModal: React.FC<TravelRequestModalProps> = ({ request, onClose, onSave, personnel, projects }) => {
  const [formData, setFormData] = useState<Omit<TravelRequest, 'requesterName' | 'projectName'>>(
    request || {
      id: uuidv4(),
      requesterId: '',
      projectId: '',
      destination: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      originalDailyAllowance: 0,
      currency: 'BRL',
      exchangeRate: 1,
      totalValue: 0,
      reason: '',
      status: 'Solicitada',
    }
  );
  const [isFormValid, setIsFormValid] = useState(false);
  const [rates, setRates] = useState<{[key: string]: number} | null>(null);
  const [ratesError, setRatesError] = useState<string | null>(null);

  useEffect(() => {
    getExchangeRates('BRL').then(data => {
        setRates(data.rates);
    }).catch(err => {
        setRatesError('Não foi possível carregar as cotações. O valor será salvo em BRL.');
        setRates({ BRL: 1, USD: 1, EUR: 1 }); // Fallback
    });
  }, []);

  useEffect(() => {
    const { requesterId, projectId, startDate, endDate, originalDailyAllowance, currency } = formData;
    
    if (!rates) return;

    const sDate = new Date(startDate);
    const eDate = new Date(endDate);
    const days = (eDate.getTime() - sDate.getTime()) / (1000 * 3600 * 24) + 1;
    
    const rate = rates[currency] || 1;
    const total = days > 0 ? days * originalDailyAllowance / rate : 0;
    
    setFormData(prev => ({ ...prev, totalValue: total, exchangeRate: rate }));
    setIsFormValid(!!requesterId && !!projectId && days > 0 && originalDailyAllowance > 0);
  }, [formData.requesterId, formData.projectId, formData.startDate, formData.endDate, formData.originalDailyAllowance, formData.currency, rates]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      const selectedPersonnel = personnel.find(p => p.id === formData.requesterId);
      const selectedProject = projects.find(p => p.id === formData.projectId);
      
      const requestToSave: TravelRequest = {
        ...formData,
        requesterName: selectedPersonnel?.name || 'N/A',
        projectName: selectedProject?.name || 'N/A',
      };

      onSave(requestToSave);
      onClose();
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} title={request ? 'Editar Solicitação de Viagem' : 'Nova Solicitação de Viagem'}>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="requesterId" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Solicitante</label>
              <select name="requesterId" id="requesterId" value={formData.requesterId} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm bg-white dark:bg-slate-700">
                <option value="" disabled>Selecione...</option>
                {personnel.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="projectId" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Projeto</label>
              <select name="projectId" id="projectId" value={formData.projectId} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm bg-white dark:bg-slate-700">
                <option value="" disabled>Selecione...</option>
                {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
          </div>
          <div>
              <label htmlFor="destination" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Destino</label>
              <input type="text" name="destination" id="destination" value={formData.destination} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm bg-white dark:bg-slate-700" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-end gap-2">
              <div className="flex-grow">
                <label htmlFor="originalDailyAllowance" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Valor da Diária</label>
                <input type="number" name="originalDailyAllowance" id="originalDailyAllowance" value={formData.originalDailyAllowance} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm bg-white dark:bg-slate-700" />
              </div>
              <div>
                <label htmlFor="currency" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Moeda</label>
                <select name="currency" id="currency" value={formData.currency} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm bg-white dark:bg-slate-700">
                    <option value="BRL">BRL</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                </select>
              </div>
            </div>
            <div className="text-sm pt-6">
                {rates && formData.currency !== 'BRL' && (
                    <p className="text-slate-500 dark:text-slate-400">
                        Cotação: 1 {formData.currency} ≈ {(1 / (rates[formData.currency] || 1)).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}
                    </p>
                )}
                 {ratesError && <p className="text-red-500 text-xs">{ratesError}</p>}
            </div>
          </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Data de Início</label>
              <input type="date" name="startDate" id="startDate" value={formData.startDate} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm bg-white dark:bg-slate-700" />
            </div>
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Data de Retorno</label>
              <input type="date" name="endDate" id="endDate" value={formData.endDate} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm bg-white dark:bg-slate-700" />
            </div>
          </div>
          <div>
            <label htmlFor="reason" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Motivo</label>
            <textarea name="reason" id="reason" value={formData.reason} onChange={handleChange} rows={3} className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm bg-white dark:bg-slate-700" />
          </div>
          <div className="p-4 bg-slate-100 dark:bg-slate-700/50 rounded-lg text-right">
              <span className="font-semibold">Valor Total Estimado (em BRL): </span>
              <span className="text-lg font-bold text-teal-600 dark:text-teal-400">{formData.totalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
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

export default TravelRequestModal;