import React, { useState } from 'react';
import type { FiscalConfig } from '../../../types';
import Header from '../../Header';
import Card from '../../Card';

interface FiscalConfigFormProps {
    config: FiscalConfig;
    onSave: (newConfig: FiscalConfig) => void;
    onBack: () => void;
}

const FiscalConfigForm: React.FC<FiscalConfigFormProps> = ({ config, onSave, onBack }) => {
    const [formData, setFormData] = useState<FiscalConfig>(config);

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
            <Header title="Configurações Fiscais" />
            <Card>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Regime Tributário */}
                        <div className="md:col-span-2">
                            <label htmlFor="taxRegime" className={labelClass}>Regime Tributário</label>
                            <select name="taxRegime" id="taxRegime" value={formData.taxRegime} onChange={handleChange} className={inputClass}>
                                <option value="Simples Nacional">Simples Nacional</option>
                                <option value="Lucro Presumido">Lucro Presumido</option>
                                <option value="Lucro Real">Lucro Real</option>
                            </select>
                        </div>
                        
                        {/* Alíquota ICMS */}
                        <div>
                            <label htmlFor="icmsRate" className={labelClass}>Alíquota Padrão ICMS (%)</label>
                            <input type="number" name="icmsRate" id="icmsRate" step="0.1" value={formData.icmsRate} onChange={handleChange} required className={inputClass} />
                        </div>
                        
                        {/* Alíquota PIS/COFINS */}
                        <div>
                            <label htmlFor="pisCofinsRate" className={labelClass}>Alíquota Padrão PIS/COFINS (%)</label>
                            <input type="number" name="pisCofinsRate" id="pisCofinsRate" step="0.1" value={formData.pisCofinsRate} onChange={handleChange} required className={inputClass} />
                        </div>
                        
                        {/* Emissão NFS-e */}
                        <div className="md:col-span-2 flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                            <div>
                                <h4 className={labelClass}>Habilitar Emissão de NFS-e</h4>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Permitir a emissão de Nota Fiscal de Serviço eletrônica pelo sistema.</p>
                            </div>
                            <label htmlFor="enableNfse" className="flex items-center cursor-pointer">
                                <div className="relative">
                                    <input type="checkbox" id="enableNfse" name="enableNfse" className="sr-only" checked={formData.enableNfse} onChange={handleChange} />
                                    <div className="block bg-slate-300 dark:bg-slate-600 w-14 h-8 rounded-full"></div>
                                    <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${formData.enableNfse ? 'transform translate-x-6 bg-teal-500' : ''}`}></div>
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

export default FiscalConfigForm;