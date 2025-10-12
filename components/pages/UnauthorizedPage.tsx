import React, { useContext } from 'react';
import Card from '../Card';
import Header from '../Header';
import { AppContext } from '../../App';
import { Page } from '../../types';

const UnauthorizedPage: React.FC = () => {
    const context = useContext(AppContext);

    return (
        <div className="p-8">
            <Header title="Acesso Negado" />
            <Card>
                <div className="text-center py-12">
                    <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">Acesso Negado</h2>
                    <p className="text-slate-600 dark:text-slate-300 mb-6">Você não tem permissão para acessar esta página.</p>
                    <button
                        onClick={() => context?.setActivePage(Page.Dashboard)}
                        className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors shadow-sm"
                    >
                        Voltar para o Dashboard
                    </button>
                </div>
            </Card>
        </div>
    );
};

export default UnauthorizedPage;
