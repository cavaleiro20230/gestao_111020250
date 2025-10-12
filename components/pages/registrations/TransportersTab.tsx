import React, { useState } from 'react';
import type { Transporter } from '../../../types';
import TransporterModal from '../../modals/TransporterModal';
import ConfirmationModal from '../../modals/ConfirmationModal';
import TableControls from '../../TableControls';

interface TransportersTabProps {
  transporters: Transporter[];
  onSave: (transporter: Transporter) => void;
  onDelete: (transporterId: string) => void;
}

const TransportersTab: React.FC<TransportersTabProps> = ({ transporters, onSave, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTransporter, setSelectedTransporter] = useState<Transporter | null>(null);
  const [transporterToDelete, setTransporterToDelete] = useState<Transporter | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const openModal = (transporter: Transporter | null = null) => {
    setSelectedTransporter(transporter);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedTransporter(null);
    setIsModalOpen(false);
  };

  const filteredTransporters = transporters.filter(t => t.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div>
      <TableControls
        onAdd={() => openModal()}
        addLabel="Nova Transportadora"
        onSearch={setSearchTerm}
      />
      
      <div className="overflow-x-auto mt-4">
        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
          <thead className="bg-slate-50 dark:bg-slate-700/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Nome</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Veículo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Placa</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
            {filteredTransporters.map(transporter => (
              <tr key={transporter.id}>
                <td className="px-6 py-4 whitespace-nowrap">{transporter.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{transporter.vehicle}</td>
                <td className="px-6 py-4 whitespace-nowrap">{transporter.licensePlate}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => openModal(transporter)} className="text-teal-600 hover:text-teal-900 dark:text-teal-400 dark:hover:text-teal-200">Editar</button>
                  <button onClick={() => setTransporterToDelete(transporter)} className="ml-4 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200">Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {isModalOpen && <TransporterModal transporter={selectedTransporter} onClose={closeModal} onSave={onSave} />}
      {transporterToDelete && (
        <ConfirmationModal
          isOpen={!!transporterToDelete}
          onClose={() => setTransporterToDelete(null)}
          onConfirm={() => {
            onDelete(transporterToDelete.id);
            setTransporterToDelete(null);
          }}
          title="Excluir Transportadora"
          message={`Tem certeza que deseja excluir a transportadora ${transporterToDelete.name}?`}
        />
      )}
    </div>
  );
};

export default TransportersTab;
