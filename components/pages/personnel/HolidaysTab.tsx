import React, { useState, useContext, useMemo } from 'react';
import type { HolidayRequest } from '../../../types';
import { AppContext, AuthContext } from '../../../App';
import HolidayRequestModal from '../../modals/HolidayRequestModal';
import ConfirmationModal from '../../modals/ConfirmationModal';
import TableControls from '../../TableControls';
// FIX: Import the Card component to resolve 'Cannot find name' errors.
import Card from '../../Card';

const CalendarDay: React.FC<{ day: number, events: HolidayRequest[] }> = ({ day, events }) => {
    return (
        <div className="h-24 border-t border-r border-slate-200 dark:border-slate-700 p-1">
            <div className="text-sm">{day}</div>
            <div className="space-y-1 mt-1">
                {events.map(event => (
                    <div key={event.id} className="text-xs bg-teal-100 dark:bg-teal-900/50 p-1 rounded-md truncate" title={event.requesterName}>
                        {event.requesterName}
                    </div>
                ))}
            </div>
        </div>
    );
};

const HolidaysTab: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<HolidayRequest | null>(null);
  const [requestToUpdate, setRequestToUpdate] = useState<{ request: HolidayRequest; newStatus: 'Aprovado' | 'Rejeitado' } | null>(null);
  const [managerNotes, setManagerNotes] = useState('');
  
  const [currentDate, setCurrentDate] = useState(new Date());

  const context = useContext(AppContext);
  const auth = useContext(AuthContext);
  if (!context || !auth) return null;

  const { user } = auth;
  const { holidayRequests, personnel, handleSaveHolidayRequest, handleDeleteHolidayRequest, handleUpdateHolidayRequestStatus } = context;
  
  const myRequests = holidayRequests.filter(r => r.requesterId === user?.id);
  const teamRequests = holidayRequests.filter(r => personnel.find(p => p.id === r.requesterId)?.managerId === user?.id);
  const isAdmin = user?.role === 'admin';


  const openModal = (request: HolidayRequest | null = null) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedRequest(null);
    setIsModalOpen(false);
  };

  const handleConfirmUpdate = () => {
    if (requestToUpdate && user) {
      handleUpdateHolidayRequestStatus(requestToUpdate.request.id, requestToUpdate.newStatus, user, managerNotes);
      setRequestToUpdate(null);
      setManagerNotes('');
    }
  };

  const { daysInMonth, firstDayOfMonth, monthName, year } = useMemo(() => {
    const d = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const days = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    return {
        daysInMonth: days,
        firstDayOfMonth: d.getDay(),
        monthName: d.toLocaleString('default', { month: 'long' }),
        year: d.getFullYear(),
    };
  }, [currentDate]);

  const approvedEvents = useMemo(() => {
      const events: { [key: number]: HolidayRequest[] } = {};
      holidayRequests.filter(r => r.status === 'Aprovado').forEach(req => {
          const start = new Date(req.startDate);
          const end = new Date(req.endDate);
          if (start.getMonth() === currentDate.getMonth() || end.getMonth() === currentDate.getMonth()) {
              for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
                  if (d.getMonth() === currentDate.getMonth()) {
                      const day = d.getDate();
                      if (!events[day]) events[day] = [];
                      events[day].push(req);
                  }
              }
          }
      });
      return events;
  }, [holidayRequests, currentDate]);
  
  const getStatusClass = (status: HolidayRequest['status']) => {
    switch(status) {
        case 'Aprovado': return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
        case 'Rejeitado': return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
        case 'Pendente': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
    }
  }

  return (
    <div className="space-y-6">
        <Card>
            <div className="flex justify-between items-center mb-4">
                <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}>&larr;</button>
                <h3 className="text-lg font-semibold capitalize">{monthName} {year}</h3>
                <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}>&rarr;</button>
            </div>
            <div className="grid grid-cols-7 border-l border-b border-slate-200 dark:border-slate-700">
                {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => <div key={day} className="text-center font-bold text-xs p-2 border-t border-r border-slate-200 dark:border-slate-700">{day}</div>)}
                {Array.from({ length: firstDayOfMonth }).map((_, i) => <div key={`empty-${i}`} className="border-t border-r border-slate-200 dark:border-slate-700"></div>)}
                {Array.from({ length: daysInMonth }).map((_, i) => <CalendarDay key={i + 1} day={i + 1} events={approvedEvents[i+1] || []} />)}
            </div>
        </Card>

        <div>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Minhas Solicitações</h3>
                 <button onClick={() => openModal()} className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700">
                    Solicitar Férias/Ausência
                </button>
            </div>
             <div className="overflow-x-auto">
                 <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                    {/* ... table for my requests */}
                    <thead className="bg-slate-50 dark:bg-slate-700/50"><tr><th className="px-6 py-3 text-left text-xs font-medium">Período</th><th className="px-6 py-3 text-left text-xs font-medium">Status</th><th className="px-6 py-3 text-left text-xs font-medium">Aprovador</th></tr></thead>
                    <tbody>
                        {myRequests.map(r => <tr key={r.id}><td className="px-6 py-4">{new Date(r.startDate).toLocaleDateString()} a {new Date(r.endDate).toLocaleDateString()}</td><td className="px-6 py-4"><span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(r.status)}`}>{r.status}</span></td><td className="px-6 py-4">{r.approverName || 'N/A'}</td></tr>)}
                    </tbody>
                </table>
            </div>
        </div>
        
        {(isAdmin || teamRequests.length > 0) && (
             <div>
                <h3 className="text-lg font-semibold mb-4">Solicitações da Equipe</h3>
                 <div className="overflow-x-auto">
                     <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                        <thead className="bg-slate-50 dark:bg-slate-700/50"><tr><th className="px-6 py-3 text-left text-xs font-medium">Solicitante</th><th className="px-6 py-3 text-left text-xs font-medium">Período</th><th className="px-6 py-3 text-left text-xs font-medium">Status</th><th className="px-6 py-3 text-right text-xs font-medium">Ações</th></tr></thead>
                        <tbody>
                            {(isAdmin ? holidayRequests : teamRequests).map(r => (
                                <tr key={r.id}>
                                    <td className="px-6 py-4 font-medium">{r.requesterName}</td>
                                    <td className="px-6 py-4">{new Date(r.startDate).toLocaleDateString()} a {new Date(r.endDate).toLocaleDateString()}</td>
                                    <td className="px-6 py-4"><span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(r.status)}`}>{r.status}</span></td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        {r.status === 'Pendente' && (
                                            <>
                                                <button onClick={() => setRequestToUpdate({request: r, newStatus: 'Aprovado'})} className="text-green-600 hover:text-green-800 font-medium">Aprovar</button>
                                                <button onClick={() => setRequestToUpdate({request: r, newStatus: 'Rejeitado'})} className="text-red-600 hover:text-red-800 font-medium">Rejeitar</button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

      {isModalOpen && <HolidayRequestModal request={selectedRequest} onClose={closeModal} onSave={handleSaveHolidayRequest} />}
      
       {requestToUpdate && (
        <ConfirmationModal
          isOpen={!!requestToUpdate}
          onClose={() => setRequestToUpdate(null)}
          onConfirm={handleConfirmUpdate}
          title={`${requestToUpdate.newStatus === 'Aprovado' ? 'Aprovar' : 'Rejeitar'} Solicitação`}
          message={`Tem certeza que deseja ${requestToUpdate.newStatus.toLowerCase()} a solicitação de ${requestToUpdate.request.requesterName}?`}
        >
             <div className="mt-4">
                <label htmlFor="managerNotes" className="block text-sm font-medium">Notas (Opcional)</label>
                <textarea id="managerNotes" value={managerNotes} onChange={e => setManagerNotes(e.target.value)} rows={2} className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-slate-600" />
            </div>
        </ConfirmationModal>
      )}
    </div>
  );
};

export default HolidaysTab;