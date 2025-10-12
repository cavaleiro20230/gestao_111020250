import React, { useState, useContext, useMemo, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Header from '../../Header';
import Card from '../../Card';
import { AppContext } from '../../../App';
import { Page, CustomReport, CustomReportConfig, CustomReportDataSource, CustomReportFilterOperator } from '../../../types';

const DATA_SOURCES: Record<CustomReportDataSource, { name: string; columns: Record<string, { label: string; type: 'string' | 'number' | 'date' }> }> = {
    accountsPayable: { 
        name: 'Contas a Pagar', 
        columns: {
            description: { label: 'Descrição', type: 'string' },
            category: { label: 'Categoria', type: 'string' },
            value: { label: 'Valor', type: 'number' },
            dueDate: { label: 'Vencimento', type: 'date' },
            status: { label: 'Status', type: 'string' },
        }
    },
    projects: {
        name: 'Projetos',
        columns: {
            name: { label: 'Nome', type: 'string' },
            clientName: { label: 'Cliente', type: 'string' },
            managerName: { label: 'Gerente', type: 'string' },
            startDate: { label: 'Data Início', type: 'date' },
            endDate: { label: 'Data Fim', type: 'date' },
            budget: { label: 'Orçamento', type: 'number' },
            status: { label: 'Status', type: 'string' },
        }
    },
    timesheetEntries: {
        name: 'Apontamento de Horas',
        columns: {
            personnelName: { label: 'Pessoa', type: 'string' },
            projectName: { label: 'Projeto', type: 'string' },
            date: { label: 'Data', type: 'date' },
            hours: { label: 'Horas', type: 'number' },
            description: { label: 'Descrição Atividade', type: 'string' },
        }
    },
    accountsReceivable: {
        name: 'Contas a Receber',
        columns: {
            description: { label: 'Descrição', type: 'string' },
            value: { label: 'Valor', type: 'number' },
            dueDate: { label: 'Vencimento', type: 'date' },
            status: { label: 'Status', type: 'string' },
        }
    }
};

const OPERATORS: Record<CustomReportFilterOperator, string> = {
    equals: 'é igual a',
    not_equals: 'é diferente de',
    contains: 'contém',
    greater_than: 'é maior que',
    less_than: 'é menor que',
};

const CustomReportEditorPage: React.FC = () => {
    const context = useContext(AppContext);
    if (!context) return null;

    const { pageContext, customReports, handleSaveCustomReport, setActivePage, ...data } = context;
    const existingReport = customReports.find(r => r.id === pageContext?.reportId);
    
    const [name, setName] = useState(existingReport?.name || '');
    const [description, setDescription] = useState(existingReport?.description || '');
    const [config, setConfig] = useState<CustomReportConfig>(existingReport?.config || {
        dataSource: '',
        columns: [],
        filters: [],
    });

    // FIX: Add explicit type to useMemo to ensure correct type inference for availableColumns.
    const availableColumns: Record<string, { label: string; type: 'string' | 'number' | 'date'; }> = useMemo(() => {
        return config.dataSource ? DATA_SOURCES[config.dataSource].columns : {};
    }, [config.dataSource]);

    const handleDataSourceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setConfig({
            dataSource: e.target.value as CustomReportDataSource,
            columns: [],
            filters: []
        });
    };
    
    const handleColumnToggle = (columnKey: string) => {
        setConfig(prev => ({
            ...prev,
            columns: prev.columns.includes(columnKey) 
                ? prev.columns.filter(c => c !== columnKey)
                : [...prev.columns, columnKey]
        }));
    };

    const addFilter = () => {
        const firstColumn = Object.keys(availableColumns)[0];
        if (!firstColumn) return;
        setConfig(prev => ({
            ...prev,
            filters: [...prev.filters, { id: uuidv4(), column: firstColumn, operator: 'equals', value: '' }]
        }));
    };

    const updateFilter = (id: string, field: keyof (typeof config.filters)[0], value: string) => {
        setConfig(prev => ({
            ...prev,
            filters: prev.filters.map(f => f.id === id ? { ...f, [field]: value } : f)
        }));
    };

    const removeFilter = (id: string) => {
        setConfig(prev => ({ ...prev, filters: prev.filters.filter(f => f.id !== id) }));
    };

    const previewData = useMemo(() => {
        if (!config.dataSource || !data[config.dataSource]) return [];

        let filteredData = [...data[config.dataSource]];

        config.filters.forEach(filter => {
            if (!filter.column || !filter.value) return;
            filteredData = filteredData.filter(row => {
                const rowValue = row[filter.column];
                const filterValue = filter.value;
                switch (filter.operator) {
                    case 'equals': return String(rowValue).toLowerCase() === String(filterValue).toLowerCase();
                    case 'not_equals': return String(rowValue).toLowerCase() !== String(filterValue).toLowerCase();
                    case 'contains': return String(rowValue).toLowerCase().includes(String(filterValue).toLowerCase());
                    case 'greater_than': return Number(rowValue) > Number(filterValue);
                    case 'less_than': return Number(rowValue) < Number(filterValue);
                    default: return true;
                }
            });
        });
        
        return filteredData.slice(0, 10); // Limit preview to 10 rows
    }, [config, data]);

    const handleSave = () => {
        const report: CustomReport = {
            id: existingReport?.id || uuidv4(),
            name,
            description,
            config,
        };
        handleSaveCustomReport(report);
        setActivePage(Page.CustomReportViewer, { reportId: report.id });
    };

    return (
        <div className="p-8 space-y-6">
            <Header title={existingReport ? 'Editar Relatório' : 'Novo Relatório Personalizado'} />
            
            <Card>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium">Nome do Relatório</label>
                        <input type="text" value={name} onChange={e => setName(e.target.value)} className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-slate-600"/>
                    </div>
                     <div>
                        <label className="block text-sm font-medium">Descrição</label>
                        <input type="text" value={description} onChange={e => setDescription(e.target.value)} className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-slate-600"/>
                    </div>
                </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-1 space-y-4">
                    <div>
                        <label className="block text-sm font-medium">1. Fonte de Dados Principal</label>
                        <select value={config.dataSource} onChange={handleDataSourceChange} className="mt-1 w-full p-2 border rounded-md dark:bg-slate-700 dark:border-slate-600">
                            <option value="" disabled>Selecione...</option>
                            {Object.entries(DATA_SOURCES).map(([key, { name }]) => (
                                <option key={key} value={key}>{name}</option>
                            ))}
                        </select>
                    </div>
                     {config.dataSource && (
                        <>
                         <div>
                            <label className="block text-sm font-medium">2. Colunas para Exibir</label>
                            <div className="mt-2 space-y-1 max-h-48 overflow-y-auto p-2 border rounded-md dark:border-slate-600">
                                {Object.entries(availableColumns).map(([key, { label }]) => (
                                    <div key={key} className="flex items-center">
                                        <input type="checkbox" id={`col-${key}`} checked={config.columns.includes(key)} onChange={() => handleColumnToggle(key)} className="h-4 w-4 rounded"/>
                                        <label htmlFor={`col-${key}`} className="ml-2 text-sm">{label}</label>
                                    </div>
                                ))}
                            </div>
                         </div>
                         <div>
                            <label className="block text-sm font-medium">3. Filtros</label>
                            <div className="mt-2 space-y-2">
                                {config.filters.map(filter => (
                                    <div key={filter.id} className="p-2 bg-slate-50 dark:bg-slate-700/50 rounded-md space-y-1">
                                        <div className="flex items-center gap-1">
                                            {/* FIX: Populate select options for filter column and operator. */}
                                            <select value={filter.column} onChange={e => updateFilter(filter.id, 'column', e.target.value)} className="flex-grow p-1 text-xs border rounded-md dark:bg-slate-600 dark:border-slate-500">
                                                {Object.entries(availableColumns).map(([key, col]) => (
                                                    <option key={key} value={key}>{col.label}</option>
                                                ))}
                                            </select>
                                            <select value={filter.operator} onChange={e => updateFilter(filter.id, 'operator', e.target.value)} className="flex-grow p-1 text-xs border rounded-md dark:bg-slate-600 dark:border-slate-500">
                                                {Object.entries(OPERATORS).map(([key, label]) => (
                                                    <option key={key} value={key}>{label}</option>
                                                ))}
                                            </select>
                                            <button onClick={() => removeFilter(filter.id)} className="text-red-500 text-lg">&times;</button>
                                        </div>
                                        <input type="text" value={filter.value} onChange={e => updateFilter(filter.id, 'value', e.target.value)} placeholder="Valor" className="w-full p-1 text-xs border rounded-md dark:bg-slate-600 dark:border-slate-500"/>
                                    </div>
                                ))}
                                <button onClick={addFilter} className="text-sm text-teal-600 hover:text-teal-800">+ Adicionar Filtro</button>
                            </div>
                         </div>
                        </>
                     )}
                </Card>

                <Card className="lg:col-span-2">
                    <h3 className="font-semibold mb-4">Pré-visualização (primeiras 10 linhas)</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead className="bg-slate-50 dark:bg-slate-700/50">
                                <tr>
                                    {config.columns.map(colKey => (
                                        <th key={colKey} className="p-2 text-left font-medium text-xs">{availableColumns[colKey]?.label}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {previewData.map((row, index) => (
                                    <tr key={index} className="border-t dark:border-slate-700">
                                        {config.columns.map(colKey => (
                                            <td key={colKey} className="p-2 whitespace-nowrap">{String(row[colKey] ?? '')}</td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {previewData.length === 0 && config.dataSource && <p className="text-center p-4 text-slate-500">Nenhum dado encontrado com os filtros atuais.</p>}
                    </div>
                </Card>
            </div>
            
            <div className="flex justify-end space-x-2">
                <button onClick={() => setActivePage(Page.CustomReportBuilder)} className="px-4 py-2 bg-slate-200 dark:bg-slate-600 rounded-lg">Cancelar</button>
                <button onClick={handleSave} disabled={!name || !config.dataSource || config.columns.length === 0} className="px-4 py-2 bg-teal-600 text-white rounded-lg disabled:bg-slate-400">Salvar Relatório</button>
            </div>
        </div>
    );
};

export default CustomReportEditorPage;