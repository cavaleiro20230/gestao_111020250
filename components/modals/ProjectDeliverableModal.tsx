import React, { useState, useEffect } from 'react';
import type { ProjectDeliverable, Project } from '../../types';
import Modal from './Modal';
import { v4 as uuidv4 } from 'uuid';

interface ProjectDeliverableModalProps {
  deliverable: ProjectDeliverable | null;
  project: Project;
  onClose: () => void;
  onSave: (deliverable: ProjectDeliverable) => void;
}

const ProjectDeliverableModal: React.FC<ProjectDeliverableModalProps> = ({ deliverable, project, onClose, onSave }) => {
  const [formData, setFormData] = useState<ProjectDeliverable>(
    deliverable || {
      id: uuidv4(),
      projectId: project.id,
      name: '',
      description: '',
      dueDate: '',
    }
  );
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const { name, dueDate } = formData;
    setIsFormValid(!!name.trim() && !!dueDate);
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
    <Modal isOpen={true} onClose={onClose} title={deliverable ? 'Editar Entrega' : 'Nova Entrega do Projeto'}>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Nome da Entrega</label>
            <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md" />
          </div>
          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Data de Vencimento</label>
            <input type="date" name="dueDate" id="dueDate" value={formData.dueDate} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md" />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Descrição</label>
            <textarea name="description" id="description" value={formData.description} onChange={handleChange} rows={3} className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md" />
          </div>
        </div>
        <div className="mt-6 flex justify-end space-x-2">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 dark:bg-slate-600 rounded-lg">Cancelar</button>
          <button type="submit" disabled={!isFormValid} className="px-4 py-2 bg-teal-600 text-white rounded-lg disabled:bg-slate-400">Salvar</button>
        </div>
      </form>
    </Modal>
  );
};

export default ProjectDeliverableModal;