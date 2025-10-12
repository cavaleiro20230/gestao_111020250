
import React, { useState, useEffect } from 'react';
import type { Shipment, Batch } from '../../types';
import Modal from './Modal';
import { v4 as uuidv4 } from 'uuid';

interface ShipmentModalProps {
  shipment: Shipment | null;
  onClose: () => void;
  onSave: (shipment: Shipment) => void;
  batches: Batch[];
}

const ShipmentModal: React.FC<ShipmentModalProps> = ({ shipment, onClose, onSave, batches }) => {
  const [formData, setFormData] = useState<Shipment>(
    shipment || {
        id: uuidv4(),
        trackingCode: '',
        origin: 'Sede FEMAR',
        destination: '',
        carrier: '',
        dispatchDate: new Date().toISOString().split('T')[0],
        expectedArrivalDate: '',
        status: 'Em trânsito',
        batchIds: []
    }
  );
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const { trackingCode, destination, carrier, dispatchDate } = formData;
    setIsFormValid(!!trackingCode.trim() && !!destination.trim() && !!carrier.trim() && !!dispatchDate);
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBatchToggle = (batchId: string) => {
    setFormData(prev => {
        const batchIds = prev.batchIds.includes(batchId)
            ? prev.batchIds.filter(id => id !== batchId)
            : [...prev.batchIds, batchId];
        return { ...prev, batchIds };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
        onSave(formData);
        onClose();
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} title={shipment ? 'Editar Remessa' : 'Nova Remessa'}>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="trackingCode" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Código de Rastreio</label>
                    <input type="text" name="trackingCode" id="trackingCode" value={formData.trackingCode} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm bg-white dark:bg-slate-700" />
                </div>
                <div>
                    <label htmlFor="carrier" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Transportadora</label>
                    <input type="text" name="carrier" id="carrier" value={formData.carrier} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm bg-white dark:bg-slate-700" />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="origin" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Origem</label>
                    <input type="text" name="origin" id="origin" value={formData.origin} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm bg-white dark:bg-slate-700" />
                </div>
                <div>
                    <label htmlFor="destination" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Destino</label>
                    <input type="text" name="destination" id="destination" value={formData.destination} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm bg-white dark:bg-slate-700" />
                </div>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="dispatchDate" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Data de Envio</label>
                    <input type="date" name="dispatchDate" id="dispatchDate" value={formData.dispatchDate} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm bg-white dark:bg-slate-700" />
                </div>
                <div>
                    <label htmlFor="expectedArrivalDate" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Previsão de Chegada</label>
                    <input type="date" name="expectedArrivalDate" id="expectedArrivalDate" value={formData.expectedArrivalDate} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm bg-white dark:bg-slate-700" />
                </div>
            </div>
            <div>
                <label htmlFor="status" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Status</label>
                <select name="status" id="status" value={formData.status} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm bg-white dark:bg-slate-700">
                    <option value="Em trânsito">Em trânsito</option>
                    <option value="Entregue">Entregue</option>
                    <option value="Atrasado">Atrasado</option>
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Lotes Inclusos</label>
                <div className="mt-2 p-2 border border-slate-300 dark:border-slate-600 rounded-md max-h-40 overflow-y-auto">
                    {batches.map(batch => (
                        <div key={batch.id} className="flex items-center">
                            <input
                                type="checkbox"
                                id={`batch-${batch.id}`}
                                checked={formData.batchIds.includes(batch.id)}
                                onChange={() => handleBatchToggle(batch.id)}
                                className="h-4 w-4 text-teal-600 border-slate-300 rounded focus:ring-teal-500"
                            />
                            <label htmlFor={`batch-${batch.id}`} className="ml-3 text-sm text-slate-600 dark:text-slate-300">
                                {batch.identifier} ({batch.projectName})
                            </label>
                        </div>
                    ))}
                    {batches.length === 0 && <p className="text-xs text-slate-400 dark:text-slate-500">Nenhum lote disponível.</p>}
                </div>
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

export default ShipmentModal;
