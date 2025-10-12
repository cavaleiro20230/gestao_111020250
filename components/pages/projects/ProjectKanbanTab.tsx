import React, { useState, useContext, useMemo } from 'react';
import type { Project, ProjectTask } from '../../../types';
import { AppContext } from '../../../App';
import ProjectTaskModal from '../../modals/ProjectTaskModal';

interface ProjectKanbanTabProps {
  project: Project;
}

const ProjectKanbanTab: React.FC<ProjectKanbanTabProps> = ({ project }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<ProjectTask | null>(null);
  const [draggedOverColumn, setDraggedOverColumn] = useState<ProjectTask['status'] | null>(null);


  const context = useContext(AppContext);
  if (!context) return null;

  const { projectTasks, personnel, projectDeliverables, handleSaveProjectTask, handleDeleteProjectTask } = context;
  const tasksForProject = projectTasks.filter(t => t.projectId === project.id);

  const openModal = (task: ProjectTask | null = null) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedTask(null);
    setIsModalOpen(false);
  };
  
  const columns: ProjectTask['status'][] = ['A Fazer', 'Em Andamento', 'Concluído'];

  const tasksByColumn = useMemo(() => {
    return columns.reduce((acc, status) => {
      acc[status] = tasksForProject.filter(task => task.status === status);
      return acc;
    }, {} as Record<ProjectTask['status'], ProjectTask[]>);
  }, [tasksForProject]);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, task: ProjectTask) => {
    e.dataTransfer.setData("taskId", task.id);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, newStatus: ProjectTask['status']) => {
    e.preventDefault();
    setDraggedOverColumn(null);
    const taskId = e.dataTransfer.getData("taskId");
    const taskToMove = projectTasks.find(t => t.id === taskId);
    
    if (taskToMove && taskToMove.status !== newStatus) {
      handleSaveProjectTask({ ...taskToMove, status: newStatus });
    }
  };

  const TaskCard: React.FC<{ task: ProjectTask }> = ({ task }) => (
    <div 
        draggable
        onDragStart={(e) => handleDragStart(e, task)}
        onClick={() => openModal(task)}
        className="p-3 mb-3 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 cursor-grab hover:shadow-md active:cursor-grabbing"
    >
      <p className="font-semibold text-sm">{task.title}</p>
      {task.assignedToName && <p className="text-xs text-slate-500 mt-2">Resp: {task.assignedToName}</p>}
    </div>
  );

  return (
    <div>
        <div className="flex justify-end mb-4">
            <button onClick={() => openModal()} className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700">
                Nova Tarefa
            </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {columns.map(status => (
                <div 
                    key={status} 
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, status)}
                    onDragEnter={() => setDraggedOverColumn(status)}
                    onDragLeave={() => setDraggedOverColumn(null)}
                    className={`bg-slate-100 dark:bg-slate-900/50 p-4 rounded-lg transition-colors duration-200 ${draggedOverColumn === status ? 'bg-teal-100 dark:bg-teal-900/50' : ''}`}
                >
                    <h3 className="font-semibold mb-4 text-center">{status} ({tasksByColumn[status]?.length || 0})</h3>
                    <div className="min-h-[200px]">
                        {tasksByColumn[status]?.map(task => <TaskCard key={task.id} task={task} />)}
                    </div>
                </div>
            ))}
        </div>
        
        {isModalOpen && <ProjectTaskModal task={selectedTask} project={project} personnel={personnel} deliverables={projectDeliverables.filter(d => d.projectId === project.id)} onClose={closeModal} onSave={handleSaveProjectTask} onDelete={handleDeleteProjectTask} />}
    </div>
  );
};

export default ProjectKanbanTab;