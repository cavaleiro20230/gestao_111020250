import React, { useState, useEffect } from 'react';
import type { Client } from '../../types';
import Modal from './Modal';
import { v4 as uuidv4 } from 'uuid';
import { MagnifyingGlassIcon, ArrowPathIcon } from '../icons';

interface ClientModalProps {
  client: Client | null;
  onClose: () => void;
  onSave: (client: Client) => void;
}

const isValidCnpj = (cnpj: string): boolean => {
    // Remove non-digit characters
    const cleanedCnpj = cnpj.replace(/[^\d]/g, '');

    // CNPJ must have 14 digits
    if (cleanedCnpj.length !== 14) {
        return false;
    }

    // CNPJs with all the same digits are invalid
    if (/^(\d)\1+$/.test(cleanedCnpj)) {
        return false;
    }
    
    // Validate check digits
    let size = cleanedCnpj.length - 2;
    let numbers = cleanedCnpj.substring(0, size);
    const digits = cleanedCnpj.substring(size);
    let sum = 0;
    let pos = size - 7;
    
    for (let i = size; i >= 1; i--) {
        sum += parseInt(numbers.charAt(size - i), 10) * pos--;
        if (pos < 2) {
            pos = 9;
        }
    }

    let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);

    if (result !== parseInt(digits.charAt(0), 10)) {
        return false;
    }

    size = size + 1;
    numbers = cleanedCnpj.substring(0, size);
    sum = 0;
    pos = size - 7;
    for (let i = size; i >= 1; i--) {
        sum += parseInt(numbers.charAt(size - i), 10) * pos--;
        if (pos < 2) {
            pos = 9;
        }
    }

    result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    
    if (result !== parseInt(digits.charAt(1), 10)) {
        return false;
    }

    return true;
};


const ClientModal: React.FC<ClientModalProps> = ({ client, onClose, onSave }) => {
  const [formData, setFormData] = useState<Client>(
    client || { id: uuidv4(), name: '', email: '', phone: '', cnpj: '' }
  );
  const [isFormValid, setIsFormValid] = useState(false);
  const [isFetchingCnpj, setIsFetchingCnpj] = useState(false);
  const [cnpjError, setCnpjError] = useState<string | null>(null);

  useEffect(() => {
    const { name, email, cnpj } = formData;
    setIsFormValid(!!name.trim() && !!email.trim() && isValidCnpj(cnpj));
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'cnpj') {
        setCnpjError(null);
    }
  };

  const handleFetchCnpj = async () => {
    if (!isValidCnpj(formData.cnpj)) {
        setCnpjError('CNPJ inválido. Verifique o número e tente novamente.');
        return;
    }
    
    const sanitizedCnpj = formData.cnpj.replace(/\D/g, '');
    setIsFetchingCnpj(true);
    setCnpjError(null);

    try {
        const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${sanitizedCnpj}`);
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('CNPJ não encontrado.');
            }
            throw new Error('Erro ao buscar dados do CNPJ.');
        }
        const data = await response.json();
        
        setFormData(prev => ({
            ...prev,
            name: data.razao_social || prev.name,
            phone: data.ddd_telefone_1 || prev.phone,
            email: data.email || prev.email, 
        }));

    } catch (error: any) {
        setCnpjError(error.message || 'Não foi possível consultar o CNPJ.');
    } finally {
        setIsFetchingCnpj(false);
    }
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidCnpj(formData.cnpj)) {
      setCnpjError('CNPJ inválido. Verifique o número e tente novamente.');
      return;
    }
    if (isFormValid) {
        onSave(formData);
        onClose();
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} title={client ? 'Editar Cliente' : 'Novo Cliente'}>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="cnpj" className="block text-sm font-medium text-slate-700 dark:text-slate-300">CNPJ</label>
            <div className="relative mt-1">
                <input 
                    type="text" 
                    name="cnpj" 
                    id="cnpj" 
                    value={formData.cnpj} 
                    onChange={handleChange} 
                    required
                    className="block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm bg-white dark:bg-slate-700 pr-10"
                    placeholder="Digite o CNPJ e clique na lupa"
                />
                <button
                    type="button"
                    onClick={handleFetchCnpj}
                    disabled={isFetchingCnpj}
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-500 hover:text-teal-600 disabled:cursor-not-allowed"
                    aria-label="Buscar dados do CNPJ"
                >
                    {isFetchingCnpj ? (
                        <ArrowPathIcon className="h-5 w-5 animate-spin" />
                    ) : (
                        <MagnifyingGlassIcon className="h-5 w-5" />
                    )}
                </button>
            </div>
            {cnpjError && <p className="mt-1 text-xs text-red-500">{cnpjError}</p>}
          </div>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Nome</label>
            <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm bg-white dark:bg-slate-700" />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
            <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm bg-white dark:bg-slate-700" />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Telefone</label>
            <input type="text" name="phone" id="phone" value={formData.phone} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm bg-white dark:bg-slate-700" />
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

export default ClientModal;