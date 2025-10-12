import React, { useState, useEffect, useMemo } from 'react';
import type { PurchaseRequisition, User, Project } from '../../types';
import Modal from './Modal';
import { v4 as uuidv4 } from 'uuid';

interface PurchaseRequisitionModalProps {
  requisition: PurchaseRequisition | null;
  onClose: () => void;
  onSave: (requisition: PurchaseRequisition) => void;
  user: User | null;
  projects: Project[];
}

const PurchaseRequisitionModal: React.FC<PurchaseRequisitionModalProps> = ({ requisition, onClose, onSave, user, projects }) => {
  const [formData, setFormData] = useState<Omit<PurchaseRequisition, 'requesterName' | 'projectName' | 'requisitionNumber'>>(
    requisition || {
      id: uuidv4(),
      requesterId: user?.id || '',
      requestDate: new Date().toISOString().split('T')[0],
      projectId: '',
      items: [{ id: uuidv4(), description: '', quantity: 1, estimatedPrice: 0 }],
      status: 'Pendente',
    }
  );
  
  const isReadOnly = requisition && requisition.status !== 'Pendente';

  const totalValue = useMemo(() => {
    return formData.items.reduce((sum, item) => sum + (item.quantity * item.estimatedPrice), 0);
  }, [formData.items]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleItemChange = (itemId: string, field: 'description' | 'quantity' | 'estimatedPrice', value: string | number) => {
    setFormData(prev => ({
        ...prev,
        items: prev.items.map(item => item.id === itemId ? { ...item, [field]: value } : item)
    }));
  };

  const addItem = () => {
    setFormData(prev => ({ ...prev, items: [...prev.items, { id: uuidv4(), description: '', quantity: 1, estimatedPrice: 0 }]}));
  };
  
  const removeItem = (id: string) => {
    setFormData(prev => ({...prev, items: prev.items.filter(item => item.id !== id)}));
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const project = projects.find(p => p.id === formData.projectId);
    const finalReq: PurchaseRequisition = {
        ...(formData as PurchaseRequisition),
        requisitionNumber: requisition?.requisitionNumber || new Date().getTime(), // Simplified
        requesterName: user?.name || '',
        projectName: project?.name || '',
    };
    onSave(finalReq);
    onClose();
  };

  return (
    <Modal isOpen={true} onClose={onClose} title={requisition ? `Solicitação #${requisition.requisitionNumber}` : 'Nova Solicitação de Compra'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Projeto</label>
          <select name="projectId" value={formData.projectId} onChange={handleChange} disabled={isReadOnly} className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 disabled:bg-slate-200">
            <option value="">Selecione um projeto</option>
            {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        <fieldset className="p-4 border rounded-lg">
          <legend className="px-2 font-semibold text-sm">Itens</legend>
          <div className="space-y-2 mt-2 max-h-60 overflow-y-auto">
            {formData.items.map(item => (
              <div key={item.id} className="grid grid-cols-12 gap-2 items-center">
                <input type="text" placeholder="Descrição do item" value={item.description} onChange={e => handleItemChange(item.id, 'description', e.target.value)} disabled={isReadOnly} className="col-span-6 p-1 border rounded text-sm dark:bg-slate-600"/>
                <input type="number" placeholder="Qtd" value={item.quantity} onChange={e => handleItemChange(item.id, 'quantity', Number(e.target.value))} disabled={isReadOnly} className="col-span-2 p-1 border rounded text-sm text-right dark:bg-slate-600"/>
                <input type="number" placeholder="Preço Est." value={item.estimatedPrice} onChange={e => handleItemChange(item.id, 'estimatedPrice', Number(e.target.value))} disabled={isReadOnly} className="col-span-3 p-1 border rounded text-sm text-right dark:bg-slate-600"/>
                {!isReadOnly && <button type="button" onClick={() => removeItem(item.id)} className="col-span-1 text-red-500 text-lg">&times;</button>}
              </div>
            ))}
          </div>
          {!isReadOnly && <button type="button" onClick={addItem} className="text-sm text-teal-600 mt-2">+ Adicionar Item</button>}
        </fieldset>
        <div className="p-4 bg-slate-100 dark:bg-slate-700/50 rounded-lg text-right">
            <span className="font-semibold">Valor Total Estimado: </span>
            <span className="text-lg font-bold text-teal-600">{totalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
        </div>
        <div className="mt-6 flex justify-end space-x-2">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 dark:bg-slate-600 rounded-lg">Fechar</button>
          {!isReadOnly && <button type="submit" className="px-4 py-2 bg-teal-600 text-white rounded-lg">Salvar</button>}
        </div>
      </form>
    </Modal>
  );
};

export default PurchaseRequisitionModal;
