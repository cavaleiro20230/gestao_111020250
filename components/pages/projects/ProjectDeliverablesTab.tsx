import React, { useState, useContext } from 'react';
import type { Project, ProjectDeliverable } from '../../../types';
import { AppContext } from '../../../App';
import ConfirmationModal from '../../modals/ConfirmationModal';
import ProjectDeliverableModal from '../../modals/ProjectDeliverableModal';

interface ProjectDeliverablesTabProps {
  project: Project;
}

const ProjectDeliverablesTab: React.FC<ProjectDeliverablesTabProps> = ({ project }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDeliverable, setSelectedDeliverable] = useState<ProjectDeliverable | null>(null);
  const [deliverableToDelete, setDeliverableToDelete] = useState<ProjectDeliverable | null>(null);

  const context = useContext(AppContext);
  if (!context) return null;

  const { projectDeliverables, handleSaveProjectDeliverable, handleDeleteProjectDeliverable } = context;
  const projectDeliverablesForProject = projectDeliverables.filter(d => d.projectId === project.id);

  const openModal = (deliverable: ProjectDeliverable | null = null) => {
    setSelectedDeliverable(deliverable);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedDeliverable(null);
    setIsModalOpen(false);
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button onClick={() => openModal()} className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700">
          Nova Entrega
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
          <thead className="bg-slate-50 dark:bg-slate-700/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Nome da Entrega</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Data de Vencimento</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
            {projectDeliverablesForProject.map(deliverable => (
              <tr key={deliverable.id}>
                <td className="px-6 py-4 whitespace-nowrap">{deliverable.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{new Date(deliverable.dueDate).toLocaleDateString('pt-BR')}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => openModal(deliverable)} className="text-teal-600 hover:text-teal-900">Editar</button>
                  <button onClick={() => setDeliverableToDelete(deliverable)} className="ml-4 text-red-600 hover:text-red-900">Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {isModalOpen && <ProjectDeliverableModal deliverable={selectedDeliverable} project={project} onClose={closeModal} onSave={handleSaveProjectDeliverable} />}
      {deliverableToDelete && (
        <ConfirmationModal
          isOpen={!!deliverableToDelete}
          onClose={() => setDeliverableToDelete(null)}
          onConfirm={() => {
            handleDeleteProjectDeliverable(deliverableToDelete.id);
            setDeliverableToDelete(null);
          }}
          title="Excluir Entrega"
          message={`Tem certeza que deseja excluir a entrega: ${deliverableToDelete.name}?`}
        />
      )}
    </div>
  );
};

export default ProjectDeliverablesTab;