import React, { useState } from 'react';
import type { Client } from '../../../types';
import ClientModal from '../../modals/ClientModal';
import ConfirmationModal from '../../modals/ConfirmationModal';
import TableControls from '../../TableControls';

interface ClientsTabProps {
  clients: Client[];
  onSave: (client: Client) => void;
  onDelete: (clientId: string) => void;
}

const ClientsTab: React.FC<ClientsTabProps> = ({ clients, onSave, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const openModal = (client: Client | null = null) => {
    setSelectedClient(client);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedClient(null);
    setIsModalOpen(false);
  };
  
  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.cnpj.includes(searchTerm)
  );

  return (
    <div>
      <TableControls
        onAdd={() => openModal()}
        addLabel="Novo Cliente"
        onSearch={setSearchTerm}
      />
      
      <div className="overflow-x-auto mt-4">
        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
          <thead className="bg-slate-50 dark:bg-slate-700/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Nome</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Telefone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">CNPJ</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
            {filteredClients.map(client => (
              <tr key={client.id}>
                <td className="px-6 py-4 whitespace-nowrap">{client.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{client.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">{client.phone}</td>
                <td className="px-6 py-4 whitespace-nowrap">{client.cnpj}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => openModal(client)} className="text-teal-600 hover:text-teal-900 dark:text-teal-400 dark:hover:text-teal-200">Editar</button>
                  <button onClick={() => setClientToDelete(client)} className="ml-4 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200">Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {isModalOpen && <ClientModal client={selectedClient} onClose={closeModal} onSave={onSave} />}
      {clientToDelete && (
        <ConfirmationModal
          isOpen={!!clientToDelete}
          onClose={() => setClientToDelete(null)}
          onConfirm={() => {
            onDelete(clientToDelete.id);
            setClientToDelete(null);
          }}
          title="Excluir Cliente"
          message={`Tem certeza que deseja excluir o cliente ${clientToDelete.name}?`}
        />
      )}
    </div>
  );
};

export default ClientsTab;