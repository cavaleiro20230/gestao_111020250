import React, { useState, useContext } from 'react';
import type { User } from '../../../types';
import { AppContext } from '../../../App';
import Header from '../../Header';
import Card from '../../Card';
import UserModal from '../../modals/UserModal';
import ConfirmationModal from '../../modals/ConfirmationModal';

interface PersonnelManagementPageProps {
    onBack: () => void;
}

const PersonnelManagementPage: React.FC<PersonnelManagementPageProps> = ({ onBack }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);
    const context = useContext(AppContext);

    if (!context) return null;

    const { users, handleSaveUser, handleDeleteUser } = context;

    const openModal = (user: User | null = null) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setSelectedUser(null);
        setIsModalOpen(false);
    };

    return (
        <div>
            <Header title="Gerenciamento de Pessoal">
                 <button onClick={() => openModal()} className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors shadow-sm">
                    Novo Pessoal
                </button>
            </Header>
            <Card>
                 <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                        <thead className="bg-slate-50 dark:bg-slate-700/50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Nome</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Cargo</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Departamento</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Perfil</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                            {users.map(user => (
                                <tr key={user.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{user.position}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{user.department}</td>
                                    <td className="px-6 py-4 whitespace-nowrap capitalize">{user.role}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button onClick={() => openModal(user)} className="text-teal-600 hover:text-teal-900 dark:text-teal-400 dark:hover:text-teal-200">Editar</button>
                                        <button onClick={() => setUserToDelete(user)} className="ml-4 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200">Excluir</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
            <div className="mt-6 flex justify-end">
                <button type="button" onClick={onBack} className="px-4 py-2 bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-white rounded-lg hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors">Voltar</button>
            </div>

            {isModalOpen && <UserModal user={selectedUser} onClose={closeModal} onSave={handleSaveUser} />}
            {userToDelete && (
                <ConfirmationModal
                    isOpen={!!userToDelete}
                    onClose={() => setUserToDelete(null)}
                    onConfirm={() => {
                        handleDeleteUser(userToDelete.id);
                        setUserToDelete(null);
                    }}
                    title="Excluir Pessoal"
                    message={`Tem certeza que deseja excluir ${userToDelete.name}?`}
                />
            )}
        </div>
    );
};

export default PersonnelManagementPage;
