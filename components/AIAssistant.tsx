import React, { useState, useCallback } from 'react';
import { getFinancialInsights } from '../services/geminiService';
import type { FinancialData } from '../types';
import Card from './Card';
import { SparklesIcon } from './icons';

interface AIAssistantProps {
    data: FinancialData;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ data }) => {
    const [insights, setInsights] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleGetInsights = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        setInsights('');
        try {
            const result = await getFinancialInsights(data);
            setInsights(result);
        } catch (e: any) {
            setError(e.message || 'An unexpected error occurred.');
        } finally {
            setIsLoading(false);
        }
    }, [data]);
    
    return (
        <Card>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Assistente de IA Financeiro</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Utilize a inteligência artificial da Gemini para obter uma análise estratégica e insights práticos sobre seus dados financeiros.</p>
                </div>
                <button
                    onClick={handleGetInsights}
                    disabled={isLoading}
                    className="mt-4 md:mt-0 flex items-center justify-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed shadow-sm"
                >
                    <SparklesIcon className="w-5 h-5 mr-2" />
                    {isLoading ? 'Analisando...' : 'Gerar Análise'}
                </button>
            </div>
            
            {isLoading && (
                 <div className="mt-4 p-4 text-center text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700/50 rounded-lg">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500 mx-auto"></div>
                    <p className="mt-2">Processando dados. Isso pode levar alguns segundos...</p>
                 </div>
            )}
            
            {error && (
                <div className="mt-4 p-4 text-red-700 bg-red-100 dark:bg-red-900/50 dark:text-red-300 rounded-lg">
                    <strong>Erro:</strong> {error}
                </div>
            )}

            {insights && (
                 <div className="mt-4 p-4 bg-slate-100 dark:bg-slate-700/50 rounded-lg">
                    <h4 className="font-semibold text-slate-800 dark:text-white mb-2">Análise Estratégica:</h4>
                    <div className="prose prose-sm dark:prose-invert text-slate-600 dark:text-slate-300 whitespace-pre-wrap">
                        {insights.split('\n').map((line, index) => {
                            if (line.trim().startsWith('-')) {
                                return <p key={index} className="ml-4">{line}</p>;
                            }
                            return <p key={index}>{line}</p>;
                        })}
                    </div>
                 </div>
            )}
        </Card>
    );
};

export default AIAssistant;
