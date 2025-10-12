import React, { useState } from 'react';
import type { CompanyConfig } from '../../../types';
import Header from '../../Header';
import Card from '../../Card';

interface CompanyConfigFormProps {
    config: CompanyConfig;
    onSave: (newConfig: CompanyConfig) => void;
    onBack: () => void;
}

const CompanyConfigForm: React.FC<CompanyConfigFormProps> = ({ config, onSave, onBack }) => {
    const [formData, setFormData] = useState<CompanyConfig>(config);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div>
            <Header title="Configurações da Empresa" />
            <Card>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Nome da Empresa</label>
                            <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm bg-white dark:bg-slate-700" />
                        </div>
                        <div>
                            <label htmlFor="cnpj" className="block text-sm font-medium text-slate-700 dark:text-slate-300">CNPJ</label>
                            <input type="text" name="cnpj" id="cnpj" value={formData.cnpj} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm bg-white dark:bg-slate-700" />
                        </div>
                         <div>
                            <label htmlFor="address" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Endereço</label>
                            <input type="text" name="address" id="address" value={formData.address} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm bg-white dark:bg-slate-700" />
                        </div>
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Telefone</label>
                            <input type="text" name="phone" id="phone" value={formData.phone} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm bg-white dark:bg-slate-700" />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
                            <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm bg-white dark:bg-slate-700" />
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end space-x-2">
                        <button type="button" onClick={onBack} className="px-4 py-2 bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-white rounded-lg hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors">Voltar</button>
                        <button type="submit" className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors shadow-sm">Salvar</button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default CompanyConfigForm;
