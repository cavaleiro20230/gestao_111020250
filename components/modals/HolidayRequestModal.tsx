import React, { useState, useEffect, useContext } from 'react';
import type { HolidayRequest } from '../../types';
import Modal from './Modal';
import { v4 as uuidv4 } from 'uuid';
import { AuthContext } from '../../App';

interface HolidayRequestModalProps {
  request: HolidayRequest | null;
  onClose: () => void;
  onSave: (request: HolidayRequest) => void;
}

const HolidayRequestModal: React.FC<HolidayRequestModalProps> = ({ request, onClose, onSave }) => {
  const authContext = useContext(AuthContext);
  if (!authContext?.user) return null;

  const { user } = authContext;

  const [formData, setFormData] = useState<Omit<HolidayRequest, 'requesterName'>>(
    request || {
      id: uuidv4(),
      requesterId: user.id,
      startDate: '',
      endDate: '',
      status: 'Pendente',
      requestDate: new Date().toISOString(),
    }
  );
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const { startDate, endDate } = formData;
    if (startDate && endDate) {
      setIsFormValid(new Date(endDate) >= new Date(startDate));
    } else {
      setIsFormValid(false);
    }
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      onSave({ ...formData, requesterName: user.name });
      onClose();
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} title={request ? 'Editar Solicitação' : 'Nova Solicitação de Férias/Ausência'}>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Data de Início</label>
            <input type="date" name="startDate" id="startDate" value={formData.startDate} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md" />
          </div>
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Data de Fim</label>
            <input type="date" name="endDate" id="endDate" value={formData.endDate} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md" />
          </div>
          {!isFormValid && formData.startDate && formData.endDate && (
            <p className="text-xs text-red-500">A data de fim deve ser igual ou posterior à data de início.</p>
          )}
        </div>
        <div className="mt-6 flex justify-end space-x-2">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 dark:bg-slate-600 rounded-lg">Cancelar</button>
          <button type="submit" disabled={!isFormValid} className="px-4 py-2 bg-teal-600 text-white rounded-lg disabled:bg-slate-400">Enviar Solicitação</button>
        </div>
      </form>
    </Modal>
  );
};

export default HolidayRequestModal;