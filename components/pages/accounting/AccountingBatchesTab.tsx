import React, { useState, useContext, useMemo } from 'react';
import type { AccountingBatch } from '../../../types';
import { AppContext } from '../../../App';
import AccountingBatchModal from '../../modals/AccountingBatchModal';
import ConfirmationModal from '../../modals/ConfirmationModal';
import TableControls from '../../TableControls';

const AccountingBatchesTab: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<AccountingBatch | null>(null);
  const [batchToDelete, setBatchToDelete] = useState<AccountingBatch | null>(null);
  const [batchToProcess, setBatchToProcess] = useState<AccountingBatch | null>(null);
  const [batchToReverse, setBatchToReverse] = useState<AccountingBatch | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const context = useContext(AppContext);
  if (!context) return null;

  const { accountingBatches, chartOfAccounts, handleSaveAccountingBatch, handleDeleteAccountingBatch, handleProcessAccountingBatch, handleReverseAccountingBatch } = context;

  const openModal = (batch: AccountingBatch | null = null) => {
    setSelectedBatch(batch);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedBatch(null);
    setIsModalOpen(false);
  };
  
  const filteredBatches = accountingBatches.filter(b => 
    b.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
    String(b.batchNumber).includes(searchTerm)
  ).sort((a,b) => b.batchNumber - a.batchNumber);

  const formatCurrency = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const getStatusClass = (status: AccountingBatch['status']) => {
    switch (status) {
      case 'Contabilizado': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'Em Digitação': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'A Contabilizar': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'Revertido': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return '';
    }
  };

  const calculateTotals = (entries: AccountingBatch['entries']) => {
      return entries.reduce((acc, entry) => {
          acc.debit += entry.debit;
          acc.credit += entry.credit;
          return acc;
      }, { debit: 0, credit: 0 });
  };

  return (
    <div>
      <TableControls
        onAdd={() => openModal()}
        addLabel="Novo Lote Manual"
        onSearch={setSearchTerm}
      />
      
      <div className="overflow-x-auto mt-4">
        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
          <thead className="bg-slate-50 dark:bg-slate-700/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Lote</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Data</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Descrição</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Valor</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
            {filteredBatches.map(batch => {
              const totals = calculateTotals(batch.entries);
              return (
              <tr key={batch.id}>
                <td className="px-6 py-4 whitespace-nowrap font-semibold">{String(batch.batchNumber).padStart(5, '0')}</td>
                <td className="px-6 py-4 whitespace-nowrap">{new Date(batch.referenceDate).toLocaleDateString('pt-BR')}</td>
                <td className="px-6 py-4 whitespace-nowrap">{batch.description}{batch.sourceDocumentId && <span className="text-xs text-slate-400 ml-2">(Integrado)</span>}</td>
                <td className={`px-6 py-4 whitespace-nowrap ${totals.debit !== totals.credit ? 'text-red-500' : ''}`}>{formatCurrency(totals.debit)}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                   <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(batch.status)}`}>
                        {batch.status}
                    </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => openModal(batch)} className="text-teal-600 hover:text-teal-900 dark:text-teal-400 dark:hover:text-teal-200">Detalhes</button>
                  {batch.status === 'A Contabilizar' && <button onClick={() => setBatchToProcess(batch)} className="ml-4 text-green-600 hover:text-green-900">Contabilizar</button>}
                  {batch.status === 'Contabilizado' && <button onClick={() => setBatchToReverse(batch)} className="ml-4 text-yellow-600 hover:text-yellow-900">Reverter</button>}
                  {(batch.status === 'Em Digitação' || batch.status === 'Revertido') && !batch.sourceDocumentId && <button onClick={() => setBatchToDelete(batch)} className="ml-4 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200">Excluir</button>}
                </td>
              </tr>
            )})}
          </tbody>
        </table>
      </div>
      
      {isModalOpen && <AccountingBatchModal batch={selectedBatch} onClose={closeModal} onSave={handleSaveAccountingBatch} chartOfAccounts={chartOfAccounts} />}
      
      {batchToProcess && (
        <ConfirmationModal
          isOpen={!!batchToProcess}
          onClose={() => setBatchToProcess(null)}
          onConfirm={() => {
            handleProcessAccountingBatch(batchToProcess.id);
            setBatchToProcess(null);
          }}
          title="Contabilizar Lote"
          message={`Tem certeza que deseja contabilizar o lote #${batchToProcess.batchNumber}? Esta ação não poderá ser desfeita facilmente.`}
        />
      )}

       {batchToReverse && (
        <ConfirmationModal
          isOpen={!!batchToReverse}
          onClose={() => setBatchToReverse(null)}
          onConfirm={() => {
            handleReverseAccountingBatch(batchToReverse.id);
            setBatchToReverse(null);
          }}
          title="Reverter Lote"
          message={`Tem certeza que deseja reverter o lote #${batchToReverse.batchNumber}?`}
        />
      )}

      {batchToDelete && (
        <ConfirmationModal
          isOpen={!!batchToDelete}
          onClose={() => setBatchToDelete(null)}
          onConfirm={() => {
            handleDeleteAccountingBatch(batchToDelete.id);
            setBatchToDelete(null);
          }}
          title="Excluir Lote"
          message={`Tem certeza que deseja excluir o lote #${batchToDelete.batchNumber}? Esta ação é irreversível.`}
        />
      )}
    </div>
  );
};

export default AccountingBatchesTab;
