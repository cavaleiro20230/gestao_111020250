import React, { useContext } from 'react';
import { AppContext, AuthContext } from '../App';
import type { Notification, Page } from '../types';

interface NotificationsPanelProps {
  onClose: () => void;
  onNotificationClick: (notificationId: string, link?: { page: Page; context?: any }) => void;
}

const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ onClose, onNotificationClick }) => {
  const appContext = useContext(AppContext);
  const authContext = useContext(AuthContext);

  if (!appContext || !authContext) return null;

  const { notifications } = appContext;
  const { user } = authContext;

  const userNotifications = notifications
    .filter(n => n.userId === user?.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="absolute top-14 right-0 w-80 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg z-20">
      <div className="p-3 border-b border-slate-200 dark:border-slate-700">
        <h3 className="font-semibold text-sm">Notificações</h3>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {userNotifications.length === 0 ? (
          <p className="text-center text-sm text-slate-500 py-6">Nenhuma notificação nova.</p>
        ) : (
          userNotifications.map(notification => (
            <div
              key={notification.id}
              onClick={() => onNotificationClick(notification.id, notification.link)}
              className={`p-3 border-b border-slate-100 dark:border-slate-700/50 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700 ${!notification.read ? 'bg-teal-50 dark:bg-teal-900/20' : ''}`}
            >
              <p className="text-sm">{notification.message}</p>
              <p className="text-xs text-slate-400 mt-1">
                {new Date(notification.createdAt).toLocaleString('pt-BR')}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationsPanel;