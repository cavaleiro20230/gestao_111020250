import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { ApprovalWorkflow, UserRole } from '../../types';
import Modal from './Modal';

interface WorkflowModalProps {
  workflow: ApprovalWorkflow | null;
  onClose: () => void;
  onSave: (workflow: ApprovalWorkflow) => void;
}

const approverRoles: UserRole[] = ['project_manager', 'finance', 'superintendent', 'admin'];

const WorkflowModal: React.FC<WorkflowModalProps> = ({ workflow, onClose, onSave }) => {
  const [formData, setFormData] = useState<ApprovalWorkflow>(
    workflow || {
      id: uuidv4(),
      name: '',
      entity: 'MaterialRequest',
      conditionField: 'totalValue',
      conditionOperator: 'greater_than',
      conditionValue: 0,
      steps: [],
    }
  );

  const handleAddStep = () => {
    setFormData(prev => ({ ...prev, steps: [...prev.steps, { id: uuidv4(), approverRole: 'project_manager' }] }));
  };

  const handleRemoveStep = (id: string) => {
    setFormData(prev => ({ ...prev, steps: prev.steps.filter(s => s.id !== id) }));
  };

  const handleStepChange = (id: string, newRole: UserRole) => {
    setFormData(prev => ({
        ...prev,
        steps: prev.steps.map(s => s.id === id ? { ...s, approverRole: newRole } : s)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <Modal isOpen={true} onClose={onClose} title={workflow ? 'Editar Workflow' : 'Novo Workflow'}>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Nome do Workflow</label>
            <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700" required />
          </div>
          <div>
            <label className="block text-sm font-medium">Disparar quando uma "Requisição de Material" tiver o valor total maior que:</label>
            <input type="number" value={formData.conditionValue} onChange={e => setFormData({...formData, conditionValue: Number(e.target.value)})} className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700" required />
          </div>
          <div>
            <label className="block text-sm font-medium">Etapas de Aprovação (em ordem)</label>
            <div className="space-y-2 mt-2">
                {formData.steps.map((step, index) => (
                    <div key={step.id} className="flex items-center gap-2">
                        <span>{index + 1}.</span>
                        <select value={step.approverRole} onChange={e => handleStepChange(step.id, e.target.value as UserRole)} className="flex-grow p-2 border rounded-md dark:bg-slate-700">
                            {approverRoles.map(role => <option key={role} value={role}>{role}</option>)}
                        </select>
                        <button type="button" onClick={() => handleRemoveStep(step.id)} className="text-red-500 text-lg">&times;</button>
                    </div>
                ))}
            </div>
            <button type="button" onClick={handleAddStep} className="text-sm text-teal-600 mt-2">+ Adicionar Etapa</button>
          </div>
        </div>
        <div className="mt-6 flex justify-end space-x-2">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 dark:bg-slate-600 rounded-lg">Cancelar</button>
          <button type="submit" className="px-4 py-2 bg-teal-600 text-white rounded-lg">Salvar</button>
        </div>
      </form>
    </Modal>
  );
};

export default WorkflowModal;
