import React, { useState } from 'react';
import Modal from './Modal';

interface RunDepreciationModalProps {
  onClose: () => void;
  onRun: (yearMonth: string) => void;
}

const RunDepreciationModal: React.FC<RunDepreciationModalProps> = ({ onClose, onRun }) => {
  const [yearMonth, setYearMonth] = useState(new Date().toISOString().slice(0, 7));
  const [isValid, setIsValid] = useState(true);

  const handleRun = () => {
    if (yearMonth) {
      onRun(yearMonth);
      onClose();
    } else {
        setIsValid(false);
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="Calcular Depreciação Mensal">
      <div className="space-y-4">
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Selecione o mês e o ano para calcular a depreciação. O sistema irá gerar os lançamentos para todos os meses desde a última depreciação calculada até o mês selecionado.
        </p>
        <div>
          <label htmlFor="yearMonth" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Calcular até o mês de:</label>
          <input
            type="month"
            id="yearMonth"
            value={yearMonth}
            onChange={(e) => {
                setYearMonth(e.target.value);
                setIsValid(!!e.target.value);
            }}
            className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm bg-white dark:bg-slate-700 ${!isValid ? 'border-red-500' : 'border-slate-300 dark:border-slate-600'}`}
          />
           {!isValid && <p className="text-xs text-red-500 mt-1">Por favor, selecione uma data válida.</p>}
        </div>
      </div>
      <div className="mt-6 flex justify-end space-x-2">
        <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-white rounded-lg hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors">
          Cancelar
        </button>
        <button onClick={handleRun} className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors shadow-sm">
          Executar Cálculo
        </button>
      </div>
    </Modal>
  );
};

export default RunDepreciationModal;