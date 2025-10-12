import React, { useState } from 'react';
import type { OtherConfig } from '../../../types';
import Header from '../../Header';
import Card from '../../Card';
import ConfirmationModal from '../../modals/ConfirmationModal';

interface OtherConfigFormProps {
    config: OtherConfig;
    onSave: (newConfig: OtherConfig) => void;
    onBack: () => void;
}

const OtherConfigForm: React.FC<OtherConfigFormProps> = ({ config, onSave, onBack }) => {
    const [formData, setFormData] = useState<OtherConfig>(config);
    const [itemToRemove, setItemToRemove] = useState<{ listName: 'paymentConditions' | 'costCenters'; index: number } | null>(null);

    const handleToggleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: checked }));
    };

    const handleAddItem = (listName: 'paymentConditions' | 'costCenters') => {
        const newItem = prompt(`Adicionar novo item a ${listName === 'paymentConditions' ? 'Condições de Pagamento' : 'Centros de Custo'}:`);
        if (newItem && newItem.trim() !== '') {
            const newConfig = {
                ...formData,
                [listName]: [...formData[listName], newItem.trim()]
            };
            setFormData(newConfig);
            onSave(newConfig);
        }
    };
    
    const handleConfirmRemove = () => {
        if (itemToRemove) {
            const { listName, index: indexToRemove } = itemToRemove;
            const newConfig = {
                ...formData,
                [listName]: formData[listName].filter((_, index) => index !== indexToRemove)
            };
            setFormData(newConfig);
            onSave(newConfig);
            setItemToRemove(null);
        }
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    const labelClass = "block text-sm font-medium text-slate-700 dark:text-slate-300";

    return (
        <div>
            <Header title="Outras Configurações" />
            <Card>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-6">
                        {/* Condições de Pagamento */}
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <h4 className={`${labelClass}`}>Condições de Pagamento</h4>
                                <button type="button" onClick={() => handleAddItem('paymentConditions')} className="text-sm text-teal-600 hover:text-teal-800 dark:text-teal-400 dark:hover:text-teal-200 font-medium">+ Adicionar</button>
                            </div>
                            <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg space-y-2">
                                {formData.paymentConditions.map((item, index) => (
                                    <div key={index} className="flex justify-between items-center text-sm text-slate-600 dark:text-slate-300">
                                        <span>{item}</span>
                                        <button type="button" onClick={() => setItemToRemove({ listName: 'paymentConditions', index })} className="text-red-500 hover:text-red-700 text-lg">&times;</button>
                                    </div>
                                ))}
                                {formData.paymentConditions.length === 0 && <p className="text-xs text-slate-400 dark:text-slate-500">Nenhum item cadastrado.</p>}
                            </div>
                        </div>

                        {/* Centros de Custo */}
                        <div>
                             <div className="flex justify-between items-center mb-2">
                                <h4 className={`${labelClass}`}>Centros de Custo</h4>
                                <button type="button" onClick={() => handleAddItem('costCenters')} className="text-sm text-teal-600 hover:text-teal-800 dark:text-teal-400 dark:hover:text-teal-200 font-medium">+ Adicionar</button>
                            </div>
                             <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg space-y-2">
                                {formData.costCenters.map((item, index) => (
                                    <div key={index} className="flex justify-between items-center text-sm text-slate-600 dark:text-slate-300">
                                        <span>{item}</span>
                                        <button type="button" onClick={() => setItemToRemove({ listName: 'costCenters', index })} className="text-red-500 hover:text-red-700 text-lg">&times;</button>
                                    </div>
                                ))}
                                {formData.costCenters.length === 0 && <p className="text-xs text-slate-400 dark:text-slate-500">Nenhum item cadastrado.</p>}
                            </div>
                        </div>

                        {/* Backup Automático */}
                        <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                            <div>
                                <h4 className={labelClass}>Habilitar Backup Automático</h4>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Realizar backups diários da base de dados na nuvem.</p>
                            </div>
                            <label htmlFor="enableAutomaticBackup" className="flex items-center cursor-pointer">
                                <div className="relative">
                                    <input type="checkbox" id="enableAutomaticBackup" name="enableAutomaticBackup" className="sr-only" checked={formData.enableAutomaticBackup} onChange={handleToggleChange} />
                                    <div className="block bg-slate-300 dark:bg-slate-600 w-14 h-8 rounded-full"></div>
                                    <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${formData.enableAutomaticBackup ? 'transform translate-x-6 bg-teal-500' : ''}`}></div>
                                </div>
                            </label>
                        </div>
                    </div>
                    <div className="mt-6 flex justify-end space-x-2">
                        <button type="button" onClick={onBack} className="px-4 py-2 bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-white rounded-lg hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors">Voltar</button>
                        <button type="submit" className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors shadow-sm">Salvar</button>
                    </div>
                </form>
            </Card>

            <ConfirmationModal
                isOpen={!!itemToRemove}
                onClose={() => setItemToRemove(null)}
                onConfirm={handleConfirmRemove}
                title="Confirmar Exclusão"
                message={`Tem certeza que deseja remover o item "${itemToRemove ? formData[itemToRemove.listName][itemToRemove.index] : ''}"?`}
            />

        </div>
    );
};

export default OtherConfigForm;