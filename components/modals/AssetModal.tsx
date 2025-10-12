import React, { useState, useEffect } from 'react';
import type { Asset, Project } from '../../types';
import Modal from './Modal';
import { v4 as uuidv4 } from 'uuid';

interface AssetModalProps {
  asset: Asset | null;
  onClose: () => void;
  onSave: (asset: Asset) => void;
  projects: Project[];
}

const AssetModal: React.FC<AssetModalProps> = ({ asset, onClose, onSave, projects }) => {
  const [formData, setFormData] = useState<Asset>(
    asset || { 
        id: uuidv4(), 
        name: '',
        serialNumber: '',
        projectId: '',
        projectName: '',
        acquisitionDate: new Date().toISOString().split('T')[0],
        value: 0,
        status: 'Disponível',
        depreciationMethod: 'none',
        usefulLifeMonths: 0,
        salvageValue: 0,
    }
  );
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const { name, projectId, acquisitionDate, value, depreciationMethod, usefulLifeMonths } = formData;
    let isValid = !!name.trim() && !!projectId && !!acquisitionDate && value > 0;
    if (depreciationMethod === 'linear') {
      isValid = isValid && usefulLifeMonths > 0;
    }
    setIsFormValid(isValid);
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    let updatedFormData = { ...formData };

    if (type === 'number') {
        updatedFormData = { ...updatedFormData, [name]: parseFloat(value) || 0 };
    } else {
        updatedFormData = { ...updatedFormData, [name]: value as any };
    }

    if (name === 'projectId') {
        const project = projects.find(p => p.id === value);
        updatedFormData.projectName = project ? project.name : '';
    }

    setFormData(updatedFormData);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
        onSave(formData);
        onClose();
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} title={asset ? 'Editar Ativo' : 'Novo Ativo'}>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Nome do Ativo</label>
            <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm bg-white dark:bg-slate-700" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label htmlFor="serialNumber" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Número de Série</label>
                <input type="text" name="serialNumber" id="serialNumber" value={formData.serialNumber} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm bg-white dark:bg-slate-700" />
            </div>
            <div>
                <label htmlFor="acquisitionDate" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Data de Aquisição</label>
                <input type="date" name="acquisitionDate" id="acquisitionDate" value={formData.acquisitionDate} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm bg-white dark:bg-slate-700" />
            </div>
          </div>
          <div>
            <label htmlFor="projectId" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Projeto de Origem do Recurso</label>
            <select name="projectId" id="projectId" value={formData.projectId} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm bg-white dark:bg-slate-700">
            <option value="" disabled>Selecione...</option>
            {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label htmlFor="value" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Valor de Aquisição (R$)</label>
                <input type="number" name="value" id="value" value={formData.value} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm bg-white dark:bg-slate-700" />
            </div>
            <div>
                <label htmlFor="status" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Status</label>
                <select name="status" id="status" value={formData.status} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm bg-white dark:bg-slate-700">
                    <option value="Disponível">Disponível</option>
                    <option value="Em Uso">Em Uso</option>
                    <option value="Em Manutenção">Em Manutenção</option>
                    <option value="Baixado">Baixado</option>
                </select>
            </div>
          </div>
           <fieldset className="p-4 border border-slate-200 dark:border-slate-600 rounded-lg">
              <legend className="px-2 font-semibold text-sm">Dados de Depreciação</legend>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                 <div>
                    <label htmlFor="depreciationMethod" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Método</label>
                    <select name="depreciationMethod" id="depreciationMethod" value={formData.depreciationMethod} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm bg-white dark:bg-slate-700">
                        <option value="none">Nenhum</option>
                        <option value="linear">Linear</option>
                    </select>
                 </div>
                 <div>
                    <label htmlFor="usefulLifeMonths" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Vida Útil (meses)</label>
                    <input type="number" name="usefulLifeMonths" id="usefulLifeMonths" value={formData.usefulLifeMonths} onChange={handleChange} disabled={formData.depreciationMethod !== 'linear'} className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm disabled:bg-slate-100 dark:disabled:bg-slate-800 sm:text-sm bg-white dark:bg-slate-700" />
                </div>
                <div>
                    <label htmlFor="salvageValue" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Valor Residual (R$)</label>
                    <input type="number" name="salvageValue" id="salvageValue" value={formData.salvageValue} onChange={handleChange} disabled={formData.depreciationMethod !== 'linear'} className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm disabled:bg-slate-100 dark:disabled:bg-slate-800 sm:text-sm bg-white dark:bg-slate-700" />
                </div>
              </div>
           </fieldset>
        </div>
        <div className="mt-6 flex justify-end space-x-2">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-white rounded-lg hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors">Cancelar</button>
          <button type="submit" disabled={!isFormValid} className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors shadow-sm disabled:bg-slate-400 disabled:cursor-not-allowed">Salvar</button>
        </div>
      </form>
    </Modal>
  );
};

export default AssetModal;