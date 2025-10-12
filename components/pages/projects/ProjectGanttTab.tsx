import React, { useContext, useMemo } from 'react';
import type { Project } from '../../../types';
import { AppContext } from '../../../App';

interface ProjectGanttTabProps {
  project: Project;
}

const ProjectGanttTab: React.FC<ProjectGanttTabProps> = ({ project }) => {
    const context = useContext(AppContext);
    if (!context) return null;

    const { projectTasks } = context;
    const tasks = useMemo(() => 
        projectTasks.filter(t => t.projectId === project.id && t.startDate && t.dueDate)
        .sort((a,b) => new Date(a.startDate!).getTime() - new Date(b.startDate!).getTime()),
    [projectTasks, project.id]);

    const projectStartDate = useMemo(() => new Date(project.startDate), [project.startDate]);
    const projectEndDate = useMemo(() => new Date(project.endDate), [project.endDate]);
    
    projectStartDate.setDate(projectStartDate.getDate() - 2);
    projectEndDate.setDate(projectEndDate.getDate() + 2);

    const totalDays = Math.ceil((projectEndDate.getTime() - projectStartDate.getTime()) / (1000 * 3600 * 24));

    const getDaysOffset = (dateStr: string) => {
        const date = new Date(dateStr);
        return Math.ceil((date.getTime() - projectStartDate.getTime()) / (1000 * 3600 * 24));
    };

    const getTaskDuration = (startStr: string, endStr: string) => {
        const start = new Date(startStr);
        const end = new Date(endStr);
        return Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24)) + 1;
    }

    const monthHeaders = useMemo(() => {
        const headers: { name: string, days: number }[] = [];
        let currentDate = new Date(projectStartDate);
        while(currentDate <= projectEndDate) {
            const monthName = currentDate.toLocaleString('default', { month: 'short' });
            const year = currentDate.getFullYear();
            headers.push({ name: `${monthName} '${String(year).slice(-2)}`, days: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate() });
            currentDate.setMonth(currentDate.getMonth() + 1);
        }
        return headers;
    }, [projectStartDate, projectEndDate]);

    const DAY_WIDTH = 30; // width of one day in pixels
    
    return (
        <div className="relative overflow-x-auto border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800">
            <div style={{ width: `${256 + totalDays * DAY_WIDTH}px`}}>
                {/* Header */}
                <div className="flex h-12 sticky top-0 z-10 bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700">
                    <div className="w-64 flex-shrink-0 p-2 border-r border-slate-200 dark:border-slate-700 font-semibold text-sm flex items-center">Tarefa</div>
                    <div className="flex">
                        {monthHeaders.map((month, index) => (
                             <div key={index} style={{ width: `${month.days * DAY_WIDTH}px` }} className="flex-shrink-0 p-2 border-r border-slate-200 dark:border-slate-700 text-center text-xs font-medium flex items-center justify-center">
                                {month.name}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Body */}
                <div className="relative">
                    {tasks.map((task, index) => {
                        const offset = getDaysOffset(task.startDate!);
                        const duration = getTaskDuration(task.startDate!, task.dueDate!);
                        const left = offset * DAY_WIDTH;
                        const width = duration * DAY_WIDTH - 2; // -2 for padding
                        
                        const statusColor = task.status === 'Concluído' ? 'bg-teal-500 hover:bg-teal-600' : task.status === 'Em Andamento' ? 'bg-sky-500 hover:bg-sky-600' : 'bg-slate-400 hover:bg-slate-500';

                        return (
                            <div key={task.id} className="flex h-12 items-center border-t border-slate-200 dark:border-slate-700">
                                <div className="w-64 flex-shrink-0 p-2 border-r border-slate-200 dark:border-slate-700 text-sm truncate" title={task.title}>{task.title}</div>
                                <div className="relative h-full flex-grow">
                                     <div title={`${task.title} - ${task.startDate} a ${task.dueDate}`}
                                          className={`absolute h-8 mt-2 rounded text-white text-xs px-2 flex items-center ${statusColor} transition-colors`}
                                          style={{ left: `${left}px`, width: `${width}px` }}
                                     >
                                         <span className="truncate">{task.assignedToName || ''}</span>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                     {tasks.length === 0 && <div className="text-center p-8 text-slate-500">Nenhuma tarefa com datas de início e fim para exibir no cronograma.</div>}
                </div>
            </div>
        </div>
    );
};
export default ProjectGanttTab;