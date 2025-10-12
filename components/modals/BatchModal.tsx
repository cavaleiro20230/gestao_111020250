
import React, { useState, useEffect } from 'react';
import type { Batch, Project } from '../../types';
import Modal from './Modal';
import { v4 as uuidv4 } from 'uuid';

interface BatchModalProps {
  batch: Batch | null;
  onClose: () => void;
  onSave: (batch: Batch) => void;
  projects: Project[];
}

const BatchModal: React.FC<BatchModalProps> = ({ batch, onClose, onSave, projects }) => {
  const [formData, setFormData] = useState<Batch>(
    batch || { 
        id: uuidv4(),
        identifier: '',
        projectId: '',
        projectName: '',
        collectionDate: new Date().toISOString().split('T')[0],
        collectorName: '',
        storageLocation: '',
        description: '',
        status: 'Armazenado'
    }
  );
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const { identifier, projectId, collectionDate, collectorName } = formData;
    setIsFormValid(!!identifier.trim() && !!projectId && !!collectionDate && !!collectorName.trim());
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    let updatedFormData = { ...formData, [name]: value };

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
    <Modal isOpen={true} onClose={onClose} title={batch ? 'Editar Lote' : 'Novo Lote'}>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
            <div>
                <label htmlFor="identifier" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Identificador Único</label>
                <input type="text" name="identifier" id="identifier" value={formData.identifier} onChange={handleChange} required placeholder="Ex: AMOSTRA-XX-001" className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm bg-white dark:bg-slate-700" />
            </div>
            <div>
                <label htmlFor="projectId" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Projeto Associado</label>
                <select name="projectId" id="projectId" value={formData.projectId} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm bg-white dark:bg-slate-700">
                    <option value="" disabled>Selecione...</option>
                    {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="collectionDate" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Data de Coleta/Recebimento</label>
                    <input type="date" name="collectionDate" id="collectionDate" value={formData.collectionDate} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm bg-white dark:bg-slate-700" />
                </div>
                <div>
                    <label htmlFor="collectorName" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Coletor/Responsável</label>
                    <input type="text" name="collectorName" id="collectorName" value={formData.collectorName} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm bg-white dark:bg-slate-700" />
                </div>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="storageLocation" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Local de Armazenamento</label>
                    <input type="text" name="storageLocation" id="storageLocation" value={formData.storageLocation} onChange={handleChange} placeholder="Ex: Refrigerador B-01" className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm bg-white dark:bg-slate-700" />
                </div>
                <div>
                    <label htmlFor="status" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Status</label>
                    <select name="status" id="status" value={formData.status} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm bg-white dark:bg-slate-700">
                        <option value="Em análise">Em análise</option>
                        <option value="Armazenado">Armazenado</option>
                        <option value="Descartado">Descartado</option>
                    </select>
                </div>
            </div>
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Descrição</label>
                <textarea name="description" id="description" value={formData.description} onChange={handleChange} rows={2} className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm bg-white dark:bg-slate-700" />
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

export default BatchModal;
