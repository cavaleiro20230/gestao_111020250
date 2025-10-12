import React, { useState } from 'react';
import type { Service } from '../../../types';
import ServiceModal from '../../modals/ServiceModal';
import ConfirmationModal from '../../modals/ConfirmationModal';
import TableControls from '../../TableControls';

interface ServicesTabProps {
  services: Service[];
  onSave: (service: Service) => void;
  onDelete: (serviceId: string) => void;
}

const ServicesTab: React.FC<ServicesTabProps> = ({ services, onSave, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const formatCurrency = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const openModal = (service: Service | null = null) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedService(null);
    setIsModalOpen(false);
  };

  const filteredServices = services.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div>
      <TableControls
        onAdd={() => openModal()}
        addLabel="Novo Serviço"
        onSearch={setSearchTerm}
      />
      
      <div className="overflow-x-auto mt-4">
        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
          <thead className="bg-slate-50 dark:bg-slate-700/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Nome</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Categoria</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Preço</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
            {filteredServices.map(service => (
              <tr key={service.id}>
                <td className="px-6 py-4 whitespace-nowrap">{service.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{service.category}</td>
                <td className="px-6 py-4 whitespace-nowrap">{formatCurrency(service.price)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => openModal(service)} className="text-teal-600 hover:text-teal-900 dark:text-teal-400 dark:hover:text-teal-200">Editar</button>
                  <button onClick={() => setServiceToDelete(service)} className="ml-4 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200">Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && <ServiceModal service={selectedService} onClose={closeModal} onSave={onSave} />}
      {serviceToDelete && (
        <ConfirmationModal
          isOpen={!!serviceToDelete}
          onClose={() => setServiceToDelete(null)}
          onConfirm={() => {
            onDelete(serviceToDelete.id);
            setServiceToDelete(null);
          }}
          title="Excluir Serviço"
          message={`Tem certeza que deseja excluir o serviço ${serviceToDelete.name}?`}
        />
      )}
    </div>
  );
};

export default ServicesTab;
