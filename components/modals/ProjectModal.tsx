import React, { useState, useEffect } from 'react';
import type { Project, Client, User } from '../../types';
import Modal from './Modal';
import { v4 as uuidv4 } from 'uuid';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
  onSave: (project: Project) => void;
  clients: Client[];
  users: User[];
}

const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose, onSave, clients, users }) => {
  const [formData, setFormData] = useState<Omit<Project, 'clientName' | 'managerName'>>(
    project || {
      id: uuidv4(),
      name: '',
      clientId: '',
      managerId: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      budget: 0,
      status: 'Proposto',
      scope: '',
    }
  );
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const { name, clientId, managerId, startDate, endDate, budget } = formData;
    setIsFormValid(!!name && !!clientId && !!managerId && !!startDate && !!endDate && budget > 0);
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
        const client = clients.find(c => c.id === formData.clientId);
        const manager = users.find(u => u.id === formData.managerId);
        onSave({
            ...formData,
            clientName: client?.name || '',
            managerName: manager?.name || '',
        });
        onClose();
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} title={project ? 'Editar Projeto' : 'Novo Projeto'}>
        <form onSubmit={handleSubmit} className="space-y-4">
            <input name="name" value={formData.name} onChange={handleChange} placeholder="Project Name" required className="w-full p-2 border rounded" />
            <select name="clientId" value={formData.clientId} onChange={handleChange} required className="w-full p-2 border rounded">
                <option value="">Select Client</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
             <select name="managerId" value={formData.managerId} onChange={handleChange} required className="w-full p-2 border rounded">
                <option value="">Select Manager</option>
                {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
            </select>
            <input name="startDate" type="date" value={formData.startDate} onChange={handleChange} required className="w-full p-2 border rounded" />
            <input name="endDate" type="date" value={formData.endDate} onChange={handleChange} required className="w-full p-2 border rounded" />
            <input name="budget" type="number" value={formData.budget} onChange={handleChange} placeholder="Budget" required className="w-full p-2 border rounded" />
            <textarea name="scope" value={formData.scope} onChange={handleChange} placeholder="Scope" className="w-full p-2 border rounded" />
            <div className="mt-6 flex justify-end space-x-2">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 rounded-lg">Cancel</button>
                <button type="submit" disabled={!isFormValid} className="px-4 py-2 bg-teal-600 text-white rounded-lg disabled:bg-slate-400">Save</button>
            </div>
        </form>
    </Modal>
  );
};

export default ProjectModal;
