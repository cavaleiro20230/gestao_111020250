import React, { useState, useEffect } from 'react';
import type { TimesheetEntry, Personnel, Project } from '../../types';
import Modal from './Modal';
import { v4 as uuidv4 } from 'uuid';

interface TimesheetEntryModalProps {
  entry: TimesheetEntry | null;
  onClose: () => void;
  onSave: (entry: TimesheetEntry) => void;
  personnel: Personnel[];
  projects: Project[];
}

const TimesheetEntryModal: React.FC<TimesheetEntryModalProps> = ({ entry, onClose, onSave, personnel, projects }) => {
  const [formData, setFormData] = useState<Omit<TimesheetEntry, 'personnelName' | 'projectName'>>(
    entry || {
      id: uuidv4(),
      personnelId: '',
      projectId: '',
      date: new Date().toISOString().split('T')[0],
      hours: 0,
      description: '',
      status: 'Pendente',
    }
  );
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const { personnelId, projectId, date, hours } = formData;
    setIsFormValid(!!personnelId && !!projectId && !!date && hours > 0);
  }, [formData]);

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
      const selectedPersonnel = personnel.find(p => p.id === formData.personnelId);
      const selectedProject = projects.find(p => p.id === formData.projectId);
      
      const entryToSave: TimesheetEntry = {
        ...formData,
        personnelName: selectedPersonnel?.name || 'N/A',
        projectName: selectedProject?.name || 'N/A',
      };

      onSave(entryToSave);
      onClose();
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} title={entry ? 'Editar Apontamento' : 'Novo Apontamento de Horas'}>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="personnelId" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Pessoa</label>
              <select name="personnelId" id="personnelId" value={formData.personnelId} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm bg-white dark:bg-slate-700">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Data</label>
              <input type="date" name="date" id="date" value={formData.date} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm bg-white dark:bg-slate-700" />
            </div>
            <div>
              <label htmlFor="hours" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Horas Trabalhadas</label>
              <input type="number" name="hours" id="hours" step="0.5" value={formData.hours} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm bg-white dark:bg-slate-700" />
            </div>
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Descrição da Atividade</label>
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

export default TimesheetEntryModal;