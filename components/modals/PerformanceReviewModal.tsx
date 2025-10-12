import React, { useState, useEffect } from 'react';
import type { PerformanceReview, Personnel, User } from '../../types';
import Modal from './Modal';
import { v4 as uuidv4 } from 'uuid';

interface PerformanceReviewModalProps {
  review: PerformanceReview | null;
  onClose: () => void;
  onSave: (review: PerformanceReview) => void;
  personnel: Personnel[];
  managers: User[];
}

const PerformanceReviewModal: React.FC<PerformanceReviewModalProps> = ({ review, onClose, onSave, personnel, managers }) => {
  const [formData, setFormData] = useState<Omit<PerformanceReview, 'employeeName' | 'managerName'>>(
    review || {
      id: uuidv4(),
      employeeId: '',
      managerId: '',
      reviewDate: new Date().toISOString().split('T')[0],
      cycleName: '',
      status: 'Pendente',
      strengths: '',
      areasForImprovement: '',
      feedback: '',
    }
  );
  
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const { employeeId, managerId, cycleName } = formData;
    setIsFormValid(!!employeeId && !!managerId && !!cycleName.trim());
  }, [formData]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
        const employee = personnel.find(p => p.id === formData.employeeId);
        const manager = managers.find(m => m.id === formData.managerId);
        onSave({
            ...formData,
            employeeName: employee?.name || '',
            managerName: manager?.name || '',
        });
        onClose();
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} title={review ? 'Detalhes da Avaliação' : 'Nova Avaliação de Desempenho'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium">Ciclo de Avaliação</label>
                <input type="text" name="cycleName" value={formData.cycleName} onChange={handleChange} placeholder="Ex: Q2 2024" className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700" required/>
            </div>
             <div>
                <label className="block text-sm font-medium">Data da Avaliação</label>
                <input type="date" name="reviewDate" value={formData.reviewDate} onChange={handleChange} className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700" required/>
            </div>
        </div>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium">Avaliado(a)</label>
                <select name="employeeId" value={formData.employeeId} onChange={handleChange} className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700" required>
                    <option value="">Selecione...</option>
                    {personnel.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
            </div>
             <div>
                <label className="block text-sm font-medium">Avaliador(a)</label>
                <select name="managerId" value={formData.managerId} onChange={handleChange} className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700" required>
                    <option value="">Selecione...</option>
                    {managers.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
            </div>
        </div>
        <div>
            <label className="block text-sm font-medium">Pontos Fortes</label>
            <textarea name="strengths" value={formData.strengths} onChange={handleChange} rows={3} className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700"/>
        </div>
        <div>
            <label className="block text-sm font-medium">Pontos a Melhorar</label>
            <textarea name="areasForImprovement" value={formData.areasForImprovement} onChange={handleChange} rows={3} className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700"/>
        </div>
         <div>
            <label className="block text-sm font-medium">Feedback Geral</label>
            <textarea name="feedback" value={formData.feedback} onChange={handleChange} rows={3} className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700"/>
        </div>
         <div>
            <label className="block text-sm font-medium">Status</label>
            <select name="status" value={formData.status} onChange={handleChange} className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700">
                <option value="Pendente">Pendente</option>
                <option value="Em Andamento">Em Andamento</option>
                <option value="Concluída">Concluída</option>
            </select>
        </div>
        <div className="mt-6 flex justify-end space-x-2">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 dark:bg-slate-600 rounded-lg">Cancelar</button>
          <button type="submit" disabled={!isFormValid} className="px-4 py-2 bg-teal-600 text-white rounded-lg disabled:bg-slate-400">Salvar</button>
        </div>
      </form>
    </Modal>
  );
};

export default PerformanceReviewModal;
