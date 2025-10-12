import React, { useState } from 'react';
import type { FinancialConfig } from '../../../types';
import Header from '../../Header';
import Card from '../../Card';

interface FinancialConfigFormProps {
    config: FinancialConfig;
    onSave: (newConfig: FinancialConfig) => void;
    onBack: () => void;
}

const FinancialConfigForm: React.FC<FinancialConfigFormProps> = ({ config, onSave, onBack }) => {
    const [formData, setFormData] = useState<FinancialConfig>(config);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        
        if (type === 'checkbox') {
            const { checked } = e.target as HTMLInputElement;
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            setFormData(prev => ({ 
                ...prev, 
                [name]: type === 'number' ? parseFloat(value) || 0 : value 
            }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    const inputClass = "mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm bg-white dark:bg-slate-700";
    const labelClass = "block text-sm font-medium text-slate-700 dark:text-slate-300";


    return (
        <div>
            <Header title="Configurações Financeiras" />
            <Card>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Juros */}
                        <div>
                            <label htmlFor="lateFeeInterest" className={labelClass}>Juros por Atraso (%)</label>
                            <input type="number" name="lateFeeInterest" id="lateFeeInterest" step="0.1" value={formData.lateFeeInterest} onChange={handleChange} required className={inputClass} />
                        </div>
                        {/* Multa */}
                        <div>
                            <label htmlFor="lateFeeFine" className={labelClass}>Multa por Atraso (%)</label>
                            <input type="number" name="lateFeeFine" id="lateFeeFine" step="0.1" value={formData.lateFeeFine} onChange={handleChange} required className={inputClass} />
                        </div>
                        {/* Notificação */}
                        <div>
                            <label htmlFor="dueNotificationDays" className={labelClass}>Dias para Notificação de Vencimento</label>
                            <input type="number" name="dueNotificationDays" id="dueNotificationDays" value={formData.dueNotificationDays} onChange={handleChange} required className={inputClass} />
                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Número de dias antes do vencimento para enviar um lembrete.</p>
                        </div>
                        {/* Indice de reajuste */}
                        <div>
                            <label htmlFor="contractAdjustmentIndex" className={labelClass}>Índice de Reajuste de Contrato</label>
                            <select name="contractAdjustmentIndex" id="contractAdjustmentIndex" value={formData.contractAdjustmentIndex} onChange={handleChange} className={inputClass}>
                                <option value="Nenhum">Nenhum</option>
                                <option value="IGP-M">IGP-M</option>
                                <option value="IPCA">IPCA</option>
                            </select>
                        </div>
                         {/* Pagamento Parcial */}
                        <div className="md:col-span-2 flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                            <div>
                                <h4 className={labelClass}>Permitir Pagamento Parcial</h4>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Habilitar a opção para clientes realizarem pagamentos parciais em faturas.</p>
                            </div>
                            <label htmlFor="allowPartialPayment" className="flex items-center cursor-pointer">
                                <div className="relative">
                                    <input type="checkbox" id="allowPartialPayment" name="allowPartialPayment" className="sr-only" checked={formData.allowPartialPayment} onChange={handleChange} />
                                    <div className="block bg-slate-300 dark:bg-slate-600 w-14 h-8 rounded-full"></div>
                                    <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${formData.allowPartialPayment ? 'transform translate-x-6 bg-teal-500' : ''}`}></div>
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
        </div>
    );
};

export default FinancialConfigForm;