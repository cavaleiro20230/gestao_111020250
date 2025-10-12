import React, { useState, useContext, useMemo } from 'react';
import type { TimesheetEntry } from '../../../types';
import { AppContext, AuthContext } from '../../../App';
import TimesheetEntryModal from '../../modals/TimesheetEntryModal';
import ConfirmationModal from '../../modals/ConfirmationModal';
import TableControls from '../../TableControls';

const TimesheetsTab: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<TimesheetEntry | null>(null);
  const [entryToDelete, setEntryToDelete] = useState<TimesheetEntry | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [projectFilter, setProjectFilter] = useState('all');
  const [personnelFilter, setPersonnelFilter] = useState('all');

  const context = useContext(AppContext);
  const auth = useContext(AuthContext);
  if (!context || !auth) return null;

  const {
    timesheetEntries,
    personnel,
    projects,
    handleSaveTimesheetEntry,
    handleDeleteTimesheetEntry,
    handleApproveTimesheetEntry
  } = context;
  
  const { user } = auth;

  const openModal = (entry: TimesheetEntry | null = null) => {
    setSelectedEntry(entry);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedEntry(null);
    setIsModalOpen(false);
  };

  const filteredEntries = useMemo(() => {
    return timesheetEntries
      .filter(entry => projectFilter === 'all' || entry.projectId === projectFilter)
      .filter(entry => personnelFilter === 'all' || entry.personnelId === personnelFilter)
      .filter(entry => entry.description.toLowerCase().includes(searchTerm.toLowerCase()) || entry.personnelName.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [timesheetEntries, projectFilter, personnelFilter, searchTerm]);

  const getStatusClass = (status: TimesheetEntry['status']) => {
    switch (status) {
      case 'Aprovado': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'Pendente': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      default: return '';
    }
  };

  return (
    <div>
      <TableControls
        onAdd={() => openModal()}
        addLabel="Novo Apontamento"
        onSearch={setSearchTerm}
      />
      
      <div className="flex flex-col md:flex-row gap-4 my-4">
        <div className="w-full">
            <label htmlFor="projectFilter" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Filtrar por Projeto</label>
            <select id="projectFilter" value={projectFilter} onChange={e => setProjectFilter(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm bg-white dark:bg-slate-700">
                <option value="all">Todos os Projetos</option>
                {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
        </div>
        <div className="w-full">
            <label htmlFor="personnelFilter" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Filtrar por Pessoa</label>
            <select id="personnelFilter" value={personnelFilter} onChange={e => setPersonnelFilter(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm bg-white dark:bg-slate-700">
                <option value="all">Toda a Equipe</option>
                {personnel.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
        </div>
      </div>

      <div className="overflow-x-auto mt-4">
        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
          <thead className="bg-slate-50 dark:bg-slate-700/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Data</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Pessoa</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Projeto</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Horas</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
            {filteredEntries.map(entry => (
              <tr key={entry.id}>
                <td className="px-6 py-4 whitespace-nowrap">{new Date(entry.date).toLocaleDateString('pt-BR')}</td>
                <td className="px-6 py-4 whitespace-nowrap font-medium">{entry.personnelName}</td>
                <td className="px-6 py-4 whitespace-nowrap">{entry.projectName}</td>
                <td className="px-6 py-4 whitespace-nowrap">{entry.hours}h</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(entry.status)}`}>
                    {entry.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {entry.status === 'Pendente' && (user?.role === 'admin' || user?.role === 'project_manager') && (
                     <button onClick={() => handleApproveTimesheetEntry(entry.id)} className="text-green-600 hover:text-green-900">Aprovar</button>
                  )}
                  <button onClick={() => openModal(entry)} className="ml-4 text-teal-600 hover:text-teal-900 dark:text-teal-400 dark:hover:text-teal-200">Editar</button>
                  <button onClick={() => setEntryToDelete(entry)} className="ml-4 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200">Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && <TimesheetEntryModal entry={selectedEntry} onClose={closeModal} onSave={handleSaveTimesheetEntry} personnel={personnel} projects={projects} />}
      {entryToDelete && (
        <ConfirmationModal
          isOpen={!!entryToDelete}
          onClose={() => setEntryToDelete(null)}
          onConfirm={() => {
            handleDeleteTimesheetEntry(entryToDelete.id);
            setEntryToDelete(null);
          }}
          title="Excluir Apontamento"
          message={`Tem certeza que deseja excluir este apontamento de ${entryToDelete.hours}h?`}
        />
      )}
    </div>
  );
};

export default TimesheetsTab;