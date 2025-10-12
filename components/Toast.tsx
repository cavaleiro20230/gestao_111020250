import React from 'react';
import { ToastMessage } from '../types';
import { CheckCircleIcon, ExclamationTriangleIcon, InformationCircleIcon, XMarkIcon } from './icons';

interface ToastProps extends ToastMessage {
  onClose: () => void;
}

const icons = {
  success: <CheckCircleIcon className="h-6 w-6 text-green-500" />,
  error: <ExclamationTriangleIcon className="h-6 w-6 text-red-500" />,
  info: <InformationCircleIcon className="h-6 w-6 text-blue-500" />,
};

const bgColors = {
  success: 'bg-green-50 dark:bg-green-900/50 border-green-200 dark:border-green-700',
  error: 'bg-red-50 dark:bg-red-900/50 border-red-200 dark:border-red-700',
  info: 'bg-blue-50 dark:bg-blue-900/50 border-blue-200 dark:border-blue-700',
};

// FIX: Abstract dynamic text colors into a map to prevent Tailwind CSS purge issues and resolve a related TS error.
const textColors = {
  success: 'text-green-800 dark:text-green-200',
  error: 'text-red-800 dark:text-red-200',
  info: 'text-blue-800 dark:text-blue-200',
};

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  return (
    <div className={`max-w-sm w-full rounded-lg shadow-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden border ${bgColors[type]}`}>
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">{icons[type]}</div>
          <div className="ml-3 w-0 flex-1 pt-0.5">
            <p className={`text-sm font-medium ${textColors[type]}`}>
              {message}
            </p>
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              onClick={onClose}
              className="inline-flex rounded-md text-slate-400 hover:text-slate-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <span className="sr-only">Close</span>
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Toast;
