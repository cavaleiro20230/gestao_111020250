import React from 'react';

interface TableControlsProps {
  onAdd: () => void;
  addLabel: string;
  onSearch: (term: string) => void;
}

const TableControls: React.FC<TableControlsProps> = ({ onAdd, addLabel, onSearch }) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center mb-4">
      <div className="relative w-full md:w-1/3">
        <input
          type="text"
          placeholder="Pesquisar..."
          onChange={(e) => onSearch(e.target.value)}
          className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white dark:bg-slate-700"
        />
      </div>
      <button
        onClick={onAdd}
        className="mt-4 md:mt-0 w-full md:w-auto px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors shadow-sm"
      >
        {addLabel}
      </button>
    </div>
  );
};

export default TableControls;
