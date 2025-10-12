import React, { useState, useEffect } from 'react';
import type { Personnel } from '../../types';
import Modal from './Modal';
import { v4 as uuidv4 } from 'uuid';

interface PersonnelModalProps {
  personnel: Personnel | null;
  onClose: () => void;
  onSave: (personnel: Personnel) => void;
}

const PersonnelModal: React.FC<PersonnelModalProps> = ({ personnel, onClose, onSave }) => {
  const [formData, setFormData] = useState<Personnel>(
    personnel || {
      id: uuidv4(),
      name: '',
      email: '',
      position: '',
      linkType: 'CLT',
      costPerHour: 0,
      admissionDate: new Date().toISOString().split('T')[0],
    }
  );
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const { name, email, position, costPerHour } = formData;
    setIsFormValid(!!name.trim() && !!email.trim() && !!position.trim() && costPerHour >= 0);
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      onSave(formData);
      onClose();
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} title={personnel ? 'Editar Membro da Equipe' : 'Novo Membro da Equipe'}>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Nome Completo</label>
              <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm bg-white dark:bg-slate-700" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
              <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm bg-white dark:bg-slate-700" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="position" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Cargo / Posição</label>
              <input type="text" name="position" id="position" value={formData.position} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm bg-white dark:bg-slate-700" />
            </div>
             <div>
              <label htmlFor="linkType" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Tipo de Vínculo</label>
              <select name="linkType" id="linkType" value={formData.linkType} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm bg-white dark:bg-slate-700">
                <option value="CLT">CLT</option>
                <option value="Bolsista">Bolsista</option>
                <option value="Terceirizado">Terceirizado</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="costPerHour" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Custo por Hora (R$)</label>
              <input type="number" name="costPerHour" id="costPerHour" value={formData.costPerHour} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm bg-white dark:bg-slate-700" />
            </div>
             <div>
              <label htmlFor="admissionDate" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Data de Admissão</label>
              <input type="date" name="admissionDate" id="admissionDate" value={formData.admissionDate} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm bg-white dark:bg-slate-700" />
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

export default PersonnelModal;