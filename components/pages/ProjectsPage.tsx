import React, { useState, useContext } from 'react';
import { AppContext } from '../../App';
import Header from '../Header';
import Card from '../Card';
import ProjectModal from '../modals/ProjectModal';
import ConfirmationModal from '../modals/ConfirmationModal';
import type { Project } from '../../types';
import { Page } from '../../types';

const ProjectsPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  
  const context = useContext(AppContext);
  if (!context) return null;

  const { projects, clients, users, handleSaveProject, handleDeleteProject, setActivePage } = context;

  const openModal = (project: Project | null = null) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedProject(null);
    setIsModalOpen(false);
  };
  
  const formatCurrency = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const getStatusClass = (status: Project['status']) => {
    switch (status) {
      case 'Ativo': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'Concluído': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'Proposto': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'Pausado': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      case 'Cancelado': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return '';
    }
  };

  return (
    <div className="p-8">
      <Header title="Projetos">
        <button onClick={() => openModal()} className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors shadow-sm">
          Novo Projeto
        </button>
      </Header>
      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
            <thead className="bg-slate-50 dark:bg-slate-700/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Nome do Projeto</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Cliente</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Gerente</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Orçamento</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
              {projects.map(project => (
                <tr key={project.id} onClick={() => setActivePage(Page.ProjectBoard, { projectId: project.id })} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer">
                  <td className="px-6 py-4 whitespace-nowrap font-medium">{project.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{project.clientName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{project.managerName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{formatCurrency(project.budget)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(project.status)}`}>
                        {project.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={(e) => { e.stopPropagation(); openModal(project); }} className="text-teal-600 hover:text-teal-900 dark:text-teal-400 dark:hover:text-teal-200">Editar</button>
                    <button onClick={(e) => { e.stopPropagation(); setProjectToDelete(project); }} className="ml-4 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200">Excluir</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      {isModalOpen && <ProjectModal project={selectedProject} onClose={closeModal} onSave={handleSaveProject} clients={clients} users={users} />}
      {projectToDelete && (
        <ConfirmationModal
          isOpen={!!projectToDelete}
          onClose={() => setProjectToDelete(null)}
          onConfirm={() => {
            handleDeleteProject(projectToDelete.id);
            setProjectToDelete(null);
          }}
          title="Excluir Projeto"
          message={`Tem certeza que deseja excluir o projeto "${projectToDelete.name}"?`}
        />
      )}
    </div>
  );
};

export default ProjectsPage;