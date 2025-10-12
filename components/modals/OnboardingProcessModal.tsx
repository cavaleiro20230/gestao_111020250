import React, { useState, useEffect, useContext } from 'react';
import type { OnboardingProcess, ChecklistItem, Personnel, User } from '../../types';
import Modal from './Modal';
import { v4 as uuidv4 } from 'uuid';
import { AuthContext } from '../../App';

const ONBOARDING_TEMPLATE: ChecklistItem[] = [
    { id: uuidv4(), description: 'Criar conta de e-mail', completed: false },
    { id: uuidv4(), description: 'Solicitar equipamento (notebook, etc.)', completed: false },
    { id: uuidv4(), description: 'Agendar exame admissional', completed: false },
    { id: uuidv4(), description: 'Configurar acessos aos sistemas', completed: false },
    { id: uuidv4(), description: 'Agendar reunião de boas-vindas com a equipe', completed: false },
];

const OFFBOARDING_TEMPLATE: ChecklistItem[] = [
    { id: uuidv4(), description: 'Agendar exame demissional', completed: false },
    { id: uuidv4(), description: 'Recolher equipamento (notebook, crachá)', completed: false },
    { id: uuidv4(), description: 'Revogar acessos aos sistemas e e-mail', completed: false },
    { id: uuidv4(), description: 'Realizar entrevista de desligamento', completed: false },
];


interface OnboardingProcessModalProps {
  process: OnboardingProcess | null;
  onClose: () => void;
  onSave: (process: OnboardingProcess) => void;
  personnel: Personnel[];
  users: User[];
}

const OnboardingProcessModal: React.FC<OnboardingProcessModalProps> = ({ process, onClose, onSave, personnel, users }) => {
  const auth = useContext(AuthContext);
  const [formData, setFormData] = useState<OnboardingProcess>(
    process || {
      id: uuidv4(),
      employeeId: '',
      employeeName: '',
      type: 'onboarding',
      startDate: new Date().toISOString().split('T')[0],
      managerId: '',
      tasks: ONBOARDING_TEMPLATE,
    }
  );

  const handleTaskToggle = (taskId: string) => {
    setFormData(prev => ({
        ...prev,
        tasks: prev.tasks.map(task => 
            task.id === taskId 
            ? { ...task, completed: !task.completed, completedBy: auth?.user?.name, completionDate: new Date().toISOString() } 
            : task
        )
    }));
  };
  
  const handleTypeChange = (type: 'onboarding' | 'offboarding') => {
      setFormData(prev => ({
          ...prev,
          type,
          tasks: type === 'onboarding' ? ONBOARDING_TEMPLATE : OFFBOARDING_TEMPLATE,
      }));
  };
  
  const handleEmployeeChange = (employeeId: string) => {
      const employee = personnel.find(p => p.id === employeeId);
      if (employee) {
          setFormData(prev => ({
              ...prev,
              employeeId,
              employeeName: employee.name,
              managerId: employee.managerId || ''
          }));
      }
  }


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <Modal isOpen={true} onClose={onClose} title={process ? `Processo de ${formData.employeeName}` : 'Novo Processo de On/Offboarding'}>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
            {!process && (
                <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="block text-sm font-medium">Tipo de Processo</label>
                        <select onChange={e => handleTypeChange(e.target.value as any)} value={formData.type} className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700">
                            <option value="onboarding">Onboarding (Entrada)</option>
                            <option value="offboarding">Offboarding (Saída)</option>
                        </select>
                     </div>
                     <div>
                        <label className="block text-sm font-medium">Colaborador</label>
                        <select onChange={e => handleEmployeeChange(e.target.value)} value={formData.employeeId} className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700">
                             <option value="" disabled>Selecione...</option>
                            {personnel.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                     </div>
                </div>
            )}
            <div>
                 <label className="block text-sm font-medium">Checklist de Tarefas</label>
                 <div className="mt-2 space-y-2 p-3 border rounded-md max-h-80 overflow-y-auto">
                    {formData.tasks.map(task => (
                        <div key={task.id} className="flex items-center">
                            <input 
                                type="checkbox"
                                id={task.id}
                                checked={task.completed}
                                onChange={() => handleTaskToggle(task.id)}
                                className="h-4 w-4 rounded"
                            />
                            <label htmlFor={task.id} className={`ml-3 text-sm ${task.completed ? 'line-through text-slate-500' : ''}`}>{task.description}</label>
                        </div>
                    ))}
                 </div>
            </div>
        </div>
        <div className="mt-6 flex justify-end space-x-2">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 dark:bg-slate-600 rounded-lg">Fechar</button>
          <button type="submit" className="px-4 py-2 bg-teal-600 text-white rounded-lg">Salvar</button>
        </div>
      </form>
    </Modal>
  );
};

export default OnboardingProcessModal;