import React, { useContext, useState } from 'react';
import { AuthContext } from '../App';
import { MagnifyingGlassIcon, ArrowLeftOnRectangleIcon } from './icons';
import NotificationsPanel from './NotificationsPanel';
import { AppContext } from '../App';

const TopNavbar: React.FC<{ onSearchClick: () => void }> = ({ onSearchClick }) => {
  const authContext = useContext(AuthContext);
  const appContext = useContext(AppContext);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);


  if (!authContext || !appContext) return null;

  const { user, logout } = authContext;
  const { notifications, handleNotificationClick } = appContext;
  
  const unreadCount = notifications.filter(n => n.userId === user?.id && !n.read).length;

  const handleNotificationPanelClick = (notificationId: string, link?: any) => {
      handleNotificationClick(notificationId, link);
      setIsNotificationsOpen(false);
  };

  return (
    <div className="flex justify-between items-center px-6 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 h-16 flex-shrink-0">
      {/* Search */}
      <div className="flex-1 flex items-center">
         <div className="text-2xl font-bold text-slate-800 dark:text-white mr-6">
            FEMAR
        </div>
        <button onClick={onSearchClick} className="flex items-center text-slate-400 dark:text-slate-500 text-sm w-full max-w-xs">
          <MagnifyingGlassIcon className="w-5 h-5 mr-3" />
          <span>Pergunte ou comande com IA...</span>
        </button>
      </div>

      {/* Right side */}
      <div className="flex items-center space-x-4">
         {/* Notifications */}
        <div className="relative">
            <button onClick={() => setIsNotificationsOpen(prev => !prev)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700">
                <svg className="w-6 h-6 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">{unreadCount}</span>
                )}
            </button>
            {isNotificationsOpen && <NotificationsPanel onClose={() => setIsNotificationsOpen(false)} onNotificationClick={handleNotificationPanelClick} />}
        </div>
        {/* User menu */}
        <div className="relative">
            <button onClick={() => setIsUserMenuOpen(prev => !prev)} className="flex items-center p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700">
                <div className="text-right mr-3 hidden sm:block">
                    <div className="font-semibold text-sm text-slate-800 dark:text-white">{user?.name}</div>
                    <div className="text-xs text-slate-500">{user?.position}</div>
                </div>
                <div className="w-10 h-10 rounded-full bg-teal-500 flex items-center justify-center text-white font-bold">
                    {user?.name?.charAt(0)}
                </div>
            </button>
             {isUserMenuOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg z-20">
                    <button
                        onClick={logout}
                        className="w-full flex items-center px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
                    >
                        <ArrowLeftOnRectangleIcon className="w-5 h-5 mr-3" />
                        Sair
                    </button>
                </div>
             )}
        </div>
      </div>
    </div>
  );
};

export default TopNavbar;