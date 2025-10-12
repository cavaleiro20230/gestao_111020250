import React, { useState, useEffect } from 'react';
import type { Transporter } from '../../types';
import Modal from './Modal';
import { v4 as uuidv4 } from 'uuid';

interface TransporterModalProps {
  transporter: Transporter | null;
  onClose: () => void;
  onSave: (transporter: Transporter) => void;
}

const TransporterModal: React.FC<TransporterModalProps> = ({ transporter, onClose, onSave }) => {
  const [formData, setFormData] = useState<Transporter>(
    transporter || { id: uuidv4(), name: '', vehicle: '', licensePlate: '' }
  );
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const { name, vehicle, licensePlate } = formData;
    setIsFormValid(!!name.trim() && !!vehicle.trim() && !!licensePlate.trim());
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    <Modal isOpen={true} onClose={onClose} title={transporter ? 'Editar Transportadora' : 'Nova Transportadora'}>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Nome da Transportadora</label>
            <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm bg-white dark:bg-slate-700" />
          </div>
          <div>
            <label htmlFor="vehicle" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Veículo</label>
            <input type="text" name="vehicle" id="vehicle" value={formData.vehicle} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm bg-white dark:bg-slate-700" />
          </div>
          <div>
            <label htmlFor="licensePlate" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Placa</label>
            <input type="text" name="licensePlate" id="licensePlate" value={formData.licensePlate} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm bg-white dark:bg-slate-700" />
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

export default TransporterModal;
