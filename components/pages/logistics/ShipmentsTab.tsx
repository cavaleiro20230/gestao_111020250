
import React, { useState, useContext } from 'react';
import type { Shipment } from '../../../types';
import { AppContext } from '../../../App';
import ShipmentModal from '../../modals/ShipmentModal';
import ConfirmationModal from '../../modals/ConfirmationModal';
import TableControls from '../../TableControls';

const ShipmentsTab: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [shipmentToDelete, setShipmentToDelete] = useState<Shipment | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const context = useContext(AppContext);
  if (!context) return null;

  const { shipments, batches, handleSaveShipment, handleDeleteShipment } = context;

  const openModal = (shipment: Shipment | null = null) => {
    setSelectedShipment(shipment);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedShipment(null);
    setIsModalOpen(false);
  };
  
  const filteredShipments = shipments.filter(s => 
    s.trackingCode.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.destination.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <TableControls
        onAdd={() => openModal()}
        addLabel="Nova Remessa"
        onSearch={setSearchTerm}
      />
      
      <div className="overflow-x-auto mt-4">
        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
          <thead className="bg-slate-50 dark:bg-slate-700/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Rastreio</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Origem</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Destino</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Lotes</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
            {filteredShipments.map(shipment => (
              <tr key={shipment.id}>
                <td className="px-6 py-4 whitespace-nowrap font-semibold">{shipment.trackingCode}</td>
                <td className="px-6 py-4 whitespace-nowrap">{shipment.origin}</td>
                <td className="px-6 py-4 whitespace-nowrap">{shipment.destination}</td>
                <td className="px-6 py-4 whitespace-nowrap">{shipment.status}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{shipment.batchIds.length}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => openModal(shipment)} className="text-teal-600 hover:text-teal-900 dark:text-teal-400 dark:hover:text-teal-200">Editar</button>
                  <button onClick={() => setShipmentToDelete(shipment)} className="ml-4 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200">Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {isModalOpen && <ShipmentModal shipment={selectedShipment} onClose={closeModal} onSave={handleSaveShipment} batches={batches} />}
      {shipmentToDelete && (
        <ConfirmationModal
          isOpen={!!shipmentToDelete}
          onClose={() => setShipmentToDelete(null)}
          onConfirm={() => {
            handleDeleteShipment(shipmentToDelete.id);
            setShipmentToDelete(null);
          }}
          title="Excluir Remessa"
          message={`Tem certeza que deseja excluir a remessa ${shipmentToDelete.trackingCode}?`}
        />
      )}
    </div>
  );
};

export default ShipmentsTab;
