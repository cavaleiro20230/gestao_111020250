import React, { useState, useEffect } from 'react';
import type { MaterialRequest, MaterialRequestItem, User, Project, BudgetItem, FundingSource, Product } from '../../types';
import Modal from './Modal';
import { v4 as uuidv4 } from 'uuid';

interface MaterialRequestModalProps {
  request: MaterialRequest | null;
  onClose: () => void;
  onSave: (request: MaterialRequest) => void;
  user: User | null;
  projects: Project[];
  budgetItems: BudgetItem[];
  fundingSources: FundingSource[];
  products: Product[];
}

const MaterialRequestModal: React.FC<MaterialRequestModalProps> = ({ request, onClose, onSave, user, projects, budgetItems, fundingSources, products }) => {
  const [formData, setFormData] = useState<Omit<MaterialRequest, 'requesterName' | 'projectName'>>(
    request || {
      id: uuidv4(),
      requesterId: user?.id || '',
      projectId: '',
      budgetItemId: '',
      fundingSourceId: '',
      requestDate: new Date().toISOString().split('T')[0],
      items: [],
      status: 'Solicitada',
    }
  );
  const [isFormValid, setIsFormValid] = useState(false);

  const isReadOnly = request?.status === 'Atendida';

  useEffect(() => {
    const { projectId, budgetItemId, fundingSourceId, items } = formData;
    setIsFormValid(!!projectId && !!budgetItemId && !!fundingSourceId && items.length > 0 && items.every(item => item.quantity > 0));
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (itemId: string, field: 'productId' | 'quantity', value: string) => {
    setFormData(prev => ({
        ...prev,
        items: prev.items.map(item => {
            if (item.id === itemId) {
                if (field === 'productId') {
                    const product = products.find(p => p.id === value);
                    return { ...item, productId: value, name: product?.name || '', price: product?.price || 0 };
                }
                if (field === 'quantity') {
                    const product = products.find(p => p.id === item.productId);
                    const newQuantity = Math.max(0, Math.min(product?.stock || 0, Number(value)));
                    return { ...item, quantity: newQuantity };
                }
            }
            return item;
        })
    }));
  };

  const addItem = () => {
    setFormData(prev => ({
        ...prev,
        items: [...prev.items, { id: uuidv4(), productId: '', name: '', quantity: 1, price: 0 }]
    }));
  };

  const removeItem = (id: string) => {
    setFormData(prev => ({...prev, items: prev.items.filter(item => item.id !== id)}));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      const selectedProject = projects.find(p => p.id === formData.projectId);
      
      const requestToSave: MaterialRequest = {
        ...formData,
        requesterName: user?.name || 'N/A',
        projectName: selectedProject?.name || 'N/A',
      };
      onSave(requestToSave);
      onClose();
    }
  };
  
  const totalValue = formData.items.reduce((sum, item) => sum + item.quantity * item.price, 0);

  return (
    <Modal isOpen={true} onClose={onClose} title={request ? `Requisição #${request.id.substring(0,5)}` : 'Nova Requisição de Material'}>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Solicitante</label>
                    <input type="text" value={user?.name || ''} readOnly className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm sm:text-sm bg-slate-100 dark:bg-slate-800" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Data</label>
                    <input type="text" value={new Date(formData.requestDate).toLocaleDateString('pt-BR')} readOnly className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm sm:text-sm bg-slate-100 dark:bg-slate-800" />
                </div>
            </div>
            <fieldset className="p-4 border border-slate-200 dark:border-slate-600 rounded-lg">
                <legend className="px-2 font-semibold text-sm">Alocação de Custo</legend>
                <div className="space-y-4 mt-2">
                    <select name="projectId" value={formData.projectId} disabled={isReadOnly} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md sm:text-sm bg-white dark:bg-slate-700 disabled:bg-slate-100"><option value="" disabled>Selecione o Projeto</option>{projects.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select>
                    <select name="fundingSourceId" value={formData.fundingSourceId} disabled={isReadOnly} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md sm:text-sm bg-white dark:bg-slate-700 disabled:bg-slate-100"><option value="" disabled>Selecione a Fonte de Recurso</option>{fundingSources.map(f=><option key={f.id} value={f.id}>{f.name}</option>)}</select>
                    <select name="budgetItemId" value={formData.budgetItemId} disabled={isReadOnly} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md sm:text-sm bg-white dark:bg-slate-700 disabled:bg-slate-100"><option value="" disabled>Selecione a Rubrica Orçamentária</option>{budgetItems.map(b=><option key={b.id} value={b.id}>{b.code} - {b.name}</option>)}</select>
                </div>
            </fieldset>

             <fieldset className="p-4 border border-slate-200 dark:border-slate-600 rounded-lg">
                <legend className="px-2 font-semibold text-sm">Itens Solicitados</legend>
                <div className="space-y-2 mt-2">
                    {formData.items.map(item => {
                        const product = products.find(p => p.id === item.productId);
                        return (
                            <div key={item.id} className="grid grid-cols-12 gap-2 items-center">
                                <select value={item.productId} disabled={isReadOnly} onChange={e => handleItemChange(item.id, 'productId', e.target.value)} className="col-span-6 mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md sm:text-sm bg-white dark:bg-slate-700 disabled:bg-slate-100"><option value="" disabled>Selecione um item</option>{products.map(p=><option key={p.id} value={p.id}>{p.name}</option>)}</select>
                                <input type="number" value={item.quantity} disabled={isReadOnly} onChange={e => handleItemChange(item.id, 'quantity', e.target.value)} className="col-span-3 mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md sm:text-sm bg-white dark:bg-slate-700 disabled:bg-slate-100"/>
                                <span className="col-span-2 text-xs text-center text-slate-500">(Disp: {product?.stock || 0})</span>
                                {!isReadOnly && <button type="button" onClick={() => removeItem(item.id)} className="col-span-1 text-red-500 hover:text-red-700 text-lg">&times;</button>}
                            </div>
                        )
                    })}
                </div>
                {!isReadOnly && <button type="button" onClick={addItem} className="text-sm text-teal-600 hover:text-teal-800 dark:text-teal-400 dark:hover:text-teal-200 font-medium mt-2">+ Adicionar Item</button>}
             </fieldset>
            <div className="p-4 bg-slate-100 dark:bg-slate-700/50 rounded-lg text-right">
              <span className="font-semibold">Custo Total Estimado: </span>
              <span className="text-lg font-bold text-teal-600 dark:text-teal-400">{totalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
            </div>
        </div>
        <div className="mt-6 flex justify-end space-x-2">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 dark:bg-slate-600 rounded-lg">Fechar</button>
          {!isReadOnly && <button type="submit" disabled={!isFormValid} className="px-4 py-2 bg-teal-600 text-white rounded-lg disabled:bg-slate-400">Salvar</button>}
        </div>
      </form>
    </Modal>
  );
};

export default MaterialRequestModal;