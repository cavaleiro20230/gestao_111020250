

import React, { useState, useEffect } from 'react';
import type { User } from '../../types';
import Modal from './Modal';
import { v4 as uuidv4 } from 'uuid';

interface UserModalProps {
  user: User | null;
  onClose: () => void;
  onSave: (user: User) => void;
}

const UserModal: React.FC<UserModalProps> = ({ user, onClose, onSave }) => {
  const [formData, setFormData] = useState<User>(
    user || { id: uuidv4(), name: '', email: '', role: 'project_manager', position: '', department: 'Técnica', password: '', status: 'active' }
  );
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const { name, email, password } = formData;
    const isPasswordValid = user ? true : !!password && password.trim().length > 0;
    setIsFormValid(!!name.trim() && !!email.trim() && isPasswordValid);
  }, [formData, user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
        if (user && (!formData.password || formData.password.trim() === '')) {
            const { password, ...rest } = formData;
            onSave({ ...user, ...rest });
        } else {
            onSave(formData);
        }
        onClose();
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} title={user ? 'Editar Usuário' : 'Novo Usuário'}>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Nome</label>
            <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm bg-white dark:bg-slate-700" />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
            <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm bg-white dark:bg-slate-700" />
          </div>
           <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Senha</label>
            <input type="password" name="password" id="password" value={formData.password || ''} onChange={handleChange} required={!user} placeholder={user ? "Deixe em branco para não alterar" : ""} className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm bg-white dark:bg-slate-700" />
          </div>
          <div>
            <label htmlFor="position" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Cargo</label>
            <input type="text" name="position" id="position" value={formData.position} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm bg-white dark:bg-slate-700" />
          </div>
           <div>
            <label htmlFor="department" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Departamento</label>
            <select name="department" id="department" value={formData.department} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm bg-white dark:bg-slate-700">
                <option value="Contabilidade">Contabilidade</option>
                <option value="Financeiro">Financeiro</option>
                <option value="RH">RH</option>
                <option value="Técnica">Técnica</option>
                <option value="Ensino">Ensino</option>
                <option value="TI">TI</option>
                <option value="Projetos">Projetos</option>
            </select>
          </div>
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Perfil de Acesso</label>
            <select name="role" id="role" value={formData.role} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm bg-white dark:bg-slate-700">
                <option value="admin">Admin</option>
                <option value="superintendent">Superintendente</option>
                <option value="finance">Financeiro</option>
                <option value="project_manager">Gerente de Projetos</option>
                <option value="coordinator">Coordenador</option>
                <option value="inspector">Fiscal</option>
                <option value="employee">Colaborador</option>
            </select>
          </div>
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Status</label>
            <select name="status" id="status" value={formData.status} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm bg-white dark:bg-slate-700">
                <option value="active">Ativo</option>
                <option value="blocked">Bloqueado</option>
            </select>
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

export default UserModal;