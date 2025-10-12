import React, { useState, useEffect, useContext } from 'react';
import type { ProjectTask, Project, Personnel, ProjectDeliverable } from '../../types';
import { AppContext, AuthContext } from '../../App';
import Modal from './Modal';
import { v4 as uuidv4 } from 'uuid';
import { PaperClipIcon } from '../icons';

interface ProjectTaskModalProps {
  task: ProjectTask | null;
  project: Project;
  personnel: Personnel[];
  deliverables: ProjectDeliverable[];
  onClose: () => void;
  onSave: (task: ProjectTask) => void;
  onDelete: (taskId: string) => void;
}

const ProjectTaskModal: React.FC<ProjectTaskModalProps> = ({ task, project, personnel, deliverables, onClose, onSave, onDelete }) => {
  const [formData, setFormData] = useState<ProjectTask>(
    task || {
      id: uuidv4(),
      projectId: project.id,
      title: '',
      description: '',
      status: 'A Fazer',
      startDate: '',
      dueDate: '',
      attachments: [],
      comments: [],
    }
  );
  const [newComment, setNewComment] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const appContext = useContext(AppContext);
  const authContext = useContext(AuthContext);

  useEffect(() => {
    setIsFormValid(!!formData.title.trim());
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddAttachment = () => {
      const fileName = prompt('Digite o nome do arquivo a ser anexado:');
      if (fileName) {
          setFormData(prev => ({...prev, attachments: [...(prev.attachments || []), fileName]}));
      }
  };

  const handleAddComment = () => {
      if (newComment.trim() && authContext?.user) {
          appContext?.handleAddTaskComment(formData.id, authContext.user.id, newComment);
          setNewComment('');
          // Optimistically update UI
          const tempComment = {
              id: uuidv4(),
              taskId: formData.id,
              authorId: authContext.user.id,
              authorName: authContext.user.name,
              content: newComment,
              createdAt: new Date().toISOString()
          };
          setFormData(prev => ({...prev, comments: [...(prev.comments || []), tempComment]}));
      }
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      const assignedTo = personnel.find(p => p.id === formData.assignedToId);
      onSave({
        ...formData,
        assignedToName: assignedTo?.name
      });
      onClose();
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} title={task ? 'Editar Tarefa' : 'Nova Tarefa'}>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Título da Tarefa</label>
            <input type="text" name="title" id="title" value={formData.title} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label htmlFor="status" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Status</label>
                <select name="status" id="status" value={formData.status} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md">
                    <option value="A Fazer">A Fazer</option>
                    <option value="Em Andamento">Em Andamento</option>
                    <option value="Concluído">Concluído</option>
                </select>
            </div>
             <div>
                <label htmlFor="assignedToId" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Responsável</label>
                <select name="assignedToId" id="assignedToId" value={formData.assignedToId} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md">
                    <option value="">Ninguém</option>
                    {personnel.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
            </div>
          </div>
          
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div>
                <label htmlFor="deliverableId" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Entrega (EAP)</label>
                <select name="deliverableId" id="deliverableId" value={formData.deliverableId} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md">
                    <option value="">Nenhuma</option>
                    {deliverables.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
            </div>
            <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Data de Início</label>
                <input type="date" name="startDate" id="startDate" value={formData.startDate || ''} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md" />
            </div>
           </div>
           <div>
                <label htmlFor="dueDate" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Data de Vencimento</label>
                <input type="date" name="dueDate" id="dueDate" value={formData.dueDate || ''} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md" />
            </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Descrição</label>
            <textarea name="description" id="description" value={formData.description} onChange={handleChange} rows={3} className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md" />
          </div>

          {/* Attachments */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">Anexos</h4>
            <div className="p-2 border border-dashed border-slate-300 dark:border-slate-600 rounded-md min-h-[50px]">
                {formData.attachments?.map((file, index) => (
                    <div key={index} className="flex items-center text-sm text-slate-600 dark:text-slate-300">
                        <PaperClipIcon className="w-4 h-4 mr-2" />
                        <span>{file}</span>
                    </div>
                ))}
                {(!formData.attachments || formData.attachments.length === 0) && <p className="text-xs text-slate-400">Nenhum anexo.</p>}
            </div>
            <button type="button" onClick={handleAddAttachment} className="text-sm text-teal-600 hover:text-teal-800">+ Adicionar Anexo</button>
          </div>
          
           {/* Comments */}
           <div className="space-y-2">
            <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">Comentários</h4>
            <div className="space-y-3 max-h-40 overflow-y-auto p-2 border border-slate-200 dark:border-slate-700 rounded-md">
                 {formData.comments?.sort((a,b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()).map(comment => (
                    <div key={comment.id}>
                        <p className="text-xs">
                            <span className="font-semibold">{comment.authorName}</span>
                            <span className="text-slate-400 ml-2">{new Date(comment.createdAt).toLocaleString('pt-BR')}</span>
                        </p>
                        <p className="text-sm bg-slate-100 dark:bg-slate-700/50 p-2 rounded-md mt-1">{comment.content}</p>
                    </div>
                 ))}
                 {(!formData.comments || formData.comments.length === 0) && <p className="text-xs text-slate-400">Nenhum comentário ainda.</p>}
            </div>
             <div className="flex items-start space-x-2">
                <textarea value={newComment} onChange={e => setNewComment(e.target.value)} placeholder="Adicionar um comentário..." rows={2} className="flex-1 mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md" />
                <button type="button" onClick={handleAddComment} className="mt-1 px-4 py-2 bg-slate-200 dark:bg-slate-600 rounded-lg">Enviar</button>
            </div>
           </div>


        </div>
        <div className="mt-6 flex justify-between items-center">
            <div>
                 {task && <button type="button" onClick={() => { onDelete(task.id); onClose(); }} className="px-4 py-2 bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300 rounded-lg">Excluir Tarefa</button>}
            </div>
            <div className="flex space-x-2">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 dark:bg-slate-600 rounded-lg">Cancelar</button>
                <button type="submit" disabled={!isFormValid} className="px-4 py-2 bg-teal-600 text-white rounded-lg disabled:bg-slate-400">Salvar</button>
            </div>
        </div>
      </form>
    </Modal>
  );
};

export default ProjectTaskModal;
