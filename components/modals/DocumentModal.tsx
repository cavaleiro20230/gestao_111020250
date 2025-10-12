import React, { useState, useEffect, useContext } from 'react';
import type { Document, Project } from '../../types';
import Modal from './Modal';
import { v4 as uuidv4 } from 'uuid';
import { AuthContext } from '../../App';

interface DocumentModalProps {
  document: Document | null;
  onClose: () => void;
  onSave: (doc: Document) => void;
  projects: Project[];
}

const DocumentModal: React.FC<DocumentModalProps> = ({ document, onClose, onSave, projects }) => {
  const authContext = useContext(AuthContext);
  const user = authContext?.user;

  const [formData, setFormData] = useState<Document>(
    // FIX: Added missing properties (ownerId, content, versions, permissions, comments) to the initial state
    // to match the `Document` type, resolving the type error.
    document || {
      id: uuidv4(),
      name: '',
      type: '',
      projectId: '',
      projectName: '',
      uploadDate: new Date().toISOString().split('T')[0],
      description: '',
      ownerId: user?.id || '',
      content: '', // Initial content can be empty or derived from description
      versions: [],
      permissions: user ? [{ userId: user.id, userName: user.name, accessLevel: 'write' }] : [],
      comments: [],
    }
  );
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const { name, type } = formData;
    setIsFormValid(!!name.trim() && !!type.trim());
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    let updatedFormData = { ...formData, [name]: value };

    if (name === 'projectId') {
        const project = projects.find(p => p.id === value);
        updatedFormData.projectName = project ? project.name : '';
    }

    if(name === 'description' && !document) { // Only autofill content on creation
        updatedFormData.content = value;
    }

    setFormData(updatedFormData);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
        onSave(formData);
        onClose();
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} title={document ? 'Editar Documento' : 'Novo Documento'}>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Nome do Documento</label>
            <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm bg-white dark:bg-slate-700" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div>
                <label htmlFor="type" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Tipo de Documento</label>
                <input type="text" name="type" id="type" value={formData.type} onChange={handleChange} required placeholder="Ex: Contrato, Relatório" className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm bg-white dark:bg-slate-700" />
            </div>
            <div>
                <label htmlFor="uploadDate" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Data de Upload</label>
                <input type="date" name="uploadDate" id="uploadDate" value={formData.uploadDate} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm bg-white dark:bg-slate-700" />
            </div>
          </div>
          <div>
                <label htmlFor="projectId" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Associar ao Projeto (Opcional)</label>
                <select name="projectId" id="projectId" value={formData.projectId} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm bg-white dark:bg-slate-700">
                    <option value="">Nenhum</option>
                    {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
          </div>
           <div>
                <label htmlFor="description" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Descrição/Conteúdo</label>
                <textarea name="description" id="description" value={formData.description} onChange={handleChange} rows={3} className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm bg-white dark:bg-slate-700" />
                {!document && <p className="text-xs text-slate-500 mt-1">O conteúdo do documento para a IA será o mesmo da descrição inicial.</p>}
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

export default DocumentModal;