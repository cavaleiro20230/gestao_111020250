import React, { useState, useEffect, useMemo } from 'react';
import type { SalesOrder, SalesOrderItem, Client, Product, Service } from '../../types';
import Modal from './Modal';
import { v4 as uuidv4 } from 'uuid';

interface SalesOrderModalProps {
  order: SalesOrder | null;
  onClose: () => void;
  onSave: (order: SalesOrder) => void;
  clients: Client[];
  products: Product[];
  services: Service[];
}

const SalesOrderModal: React.FC<SalesOrderModalProps> = ({ order, onClose, onSave, clients, products, services }) => {
  const [formData, setFormData] = useState<Omit<SalesOrder, 'clientName' | 'totalValue' | 'orderNumber'>>(
    order || {
      id: uuidv4(),
      clientId: '',
      orderDate: new Date().toISOString().split('T')[0],
      deliveryDate: '',
      items: [],
      status: 'Orçamento',
    }
  );

  const [isFormValid, setIsFormValid] = useState(false);
  const availableItems = useMemo(() => [...products.map(p => ({...p, type: 'product'})), ...services.map(s => ({...s, type: 'service'}))], [products, services]);

  const totalValue = useMemo(() => {
      return formData.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  }, [formData.items]);

  useEffect(() => {
    const { clientId, orderDate, deliveryDate, items } = formData;
    const areItemsValid = items.length > 0 && items.every(i => i.itemId && i.quantity > 0 && i.unitPrice >= 0);
    setIsFormValid(!!clientId && !!orderDate && !!deliveryDate && areItemsValid);
  }, [formData]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (itemId: string, field: 'itemId' | 'quantity' | 'unitPrice', value: string) => {
    setFormData(prev => ({
        ...prev,
        items: prev.items.map(item => {
            if (item.id === itemId) {
                if (field === 'itemId') {
                    const selectedItem = availableItems.find(i => i.id === value);
                    return { ...item, itemId: value, itemName: selectedItem?.name || '', unitPrice: selectedItem?.price || 0 };
                }
                return { ...item, [field]: Number(value) };
            }
            return item;
        })
    }));
  };

  const addItem = () => {
    setFormData(prev => ({
        ...prev,
        items: [...prev.items, { id: uuidv4(), itemId: '', itemName: '', quantity: 1, unitPrice: 0 }]
    }));
  };

  const removeItem = (id: string) => {
      setFormData(prev => ({ ...prev, items: prev.items.filter(item => item.id !== id) }));
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
        const client = clients.find(c => c.id === formData.clientId);
        const finalOrder: SalesOrder = {
            ...(formData as SalesOrder),
            orderNumber: order?.orderNumber || new Date().getFullYear() * 1000 + Math.floor(Math.random() * 1000),
            clientName: client?.name || 'N/A',
            totalValue: totalValue,
        };
        onSave(finalOrder);
        onClose();
    }
  };
  
  const formatCurrency = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });


  return (
    <Modal isOpen={true} onClose={onClose} title={order ? `Editar Ordem #${order.orderNumber}` : 'Nova Ordem de Venda'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Cliente</label>
                <select name="clientId" value={formData.clientId} onChange={handleChange} className="mt-1 w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md dark:bg-slate-700" required>
                    <option value="" disabled>Selecione...</option>
                    {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
            </div>
             <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Status</label>
                <select name="status" value={formData.status} onChange={handleChange} className="mt-1 w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md dark:bg-slate-700">
                    <option value="Orçamento">Orçamento</option>
                    <option value="Pedido">Pedido</option>
                    <option value="Faturado">Faturado</option>
                    <option value="Cancelado">Cancelado</option>
                </select>
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Data da Ordem</label>
                <input type="date" name="orderDate" value={formData.orderDate} onChange={handleChange} className="mt-1 w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md dark:bg-slate-700" required/>
            </div>
             <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Data de Entrega</label>
                <input type="date" name="deliveryDate" value={formData.deliveryDate} onChange={handleChange} className="mt-1 w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md dark:bg-slate-700" required/>
            </div>
        </div>
        
        <fieldset className="p-4 border border-slate-200 dark:border-slate-600 rounded-lg">
            <legend className="px-2 font-semibold text-sm">Itens</legend>
            <div className="space-y-2 mt-2 max-h-60 overflow-y-auto">
                {formData.items.map(item => (
                    <div key={item.id} className="grid grid-cols-12 gap-2 items-center">
                        <select value={item.itemId} onChange={e => handleItemChange(item.id, 'itemId', e.target.value)} className="col-span-6 p-1 border border-slate-300 dark:border-slate-600 rounded text-sm dark:bg-slate-600">
                            <option value="">Selecione um item...</option>
                            {availableItems.map(i => <option key={i.id} value={i.id}>{i.name} ({i.type === 'product' ? 'Prod' : 'Serv'})</option>)}
                        </select>
                        <input type="number" placeholder="Qtd" value={item.quantity} onChange={e => handleItemChange(item.id, 'quantity', e.target.value)} className="col-span-2 p-1 border border-slate-300 dark:border-slate-600 rounded text-sm text-right dark:bg-slate-600" />
                        <input type="number" placeholder="Preço" value={item.unitPrice} onChange={e => handleItemChange(item.id, 'unitPrice', e.target.value)} className="col-span-3 p-1 border border-slate-300 dark:border-slate-600 rounded text-sm text-right dark:bg-slate-600" />
                        <button type="button" onClick={() => removeItem(item.id)} className="col-span-1 text-red-500 hover:text-red-700 text-lg">&times;</button>
                    </div>
                ))}
            </div>
             <button type="button" onClick={addItem} className="text-sm text-teal-600 hover:text-teal-800 dark:text-teal-400 dark:hover:text-teal-200 font-medium mt-2">+ Adicionar Item</button>
        </fieldset>

        <div className="p-4 bg-slate-100 dark:bg-slate-700/50 rounded-lg text-right">
              <span className="font-semibold">Valor Total: </span>
              <span className="text-lg font-bold text-teal-600 dark:text-teal-400">{formatCurrency(totalValue)}</span>
          </div>

        <div className="mt-6 flex justify-end space-x-2">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 dark:bg-slate-600 rounded-lg">Cancelar</button>
          <button type="submit" disabled={!isFormValid} className="px-4 py-2 bg-teal-600 text-white rounded-lg disabled:bg-slate-400">Salvar</button>
        </div>
      </form>
    </Modal>
  );
};

export default SalesOrderModal;