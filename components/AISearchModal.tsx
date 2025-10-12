import React, { useState, useContext } from 'react';
import { AppContext } from '../App';
import { processNaturalLanguageCommand } from '../services/geminiService';
import { SparklesIcon, XMarkIcon, PaperAirplaneIcon, CheckCircleIcon } from './icons';

interface AISearchModalProps {
    onClose: () => void;
}

const AISearchModal: React.FC<AISearchModalProps> = ({ onClose }) => {
    const [query, setQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [response, setResponse] = useState<string>('');
    const [actionFeedback, setActionFeedback] = useState<string[]>([]);
    const appContext = useContext(AppContext);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim() || !appContext) return;
        
        setIsLoading(true);
        setError(null);
        setResponse('');
        setActionFeedback([]);
        
        try {
            const geminiResponse = await processNaturalLanguageCommand(appContext, query);
            
            if (geminiResponse.functionCalls && geminiResponse.functionCalls.length > 0) {
                const results = await Promise.all(
                    geminiResponse.functionCalls.map(call => appContext.handleExecuteFunctionCall(call))
                );
                setActionFeedback(results.map(r => r.message));
            }

            if(geminiResponse.text) {
                setResponse(geminiResponse.text);
            }

        } catch (err: any) {
            setError(err.message || 'Ocorreu um erro ao buscar a resposta.');
        } finally {
            setIsLoading(false);
            setQuery('');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-start pt-20" onClick={onClose}>
            <div 
                className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col" 
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center">
                        <SparklesIcon className="w-5 h-5 mr-2 text-teal-500" />
                        Pergunte ou Comande
                    </h2>
                    <button onClick={onClose} className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>
                
                <div className="p-6 overflow-y-auto flex-1">
                    {error && (
                        <div className="mb-4 p-4 text-red-700 bg-red-100 dark:bg-red-900/50 dark:text-red-300 rounded-lg">
                            <strong>Erro:</strong> {error}
                        </div>
                    )}

                    {isLoading && (
                        <div className="text-center text-slate-600 dark:text-slate-300 rounded-lg">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500 mx-auto"></div>
                            <p className="mt-2 text-sm">A IA está pensando...</p>
                        </div>
                    )}

                    {actionFeedback.length > 0 && (
                         <div className="space-y-2 mb-4">
                            {actionFeedback.map((feedback, index) => (
                                <div key={index} className="p-3 bg-green-50 dark:bg-green-900/50 text-green-800 dark:text-green-200 rounded-lg flex items-center">
                                    <CheckCircleIcon className="w-5 h-5 mr-3" />
                                    <span className="text-sm font-medium">{feedback}</span>
                                </div>
                            ))}
                        </div>
                    )}
                    
                    {response && (
                        <div className="prose prose-sm dark:prose-invert max-w-none text-slate-700 dark:text-slate-200 whitespace-pre-wrap">
                            <p>{response}</p>
                        </div>
                    )}
                </div>

                <div className="p-4 border-t border-slate-200 dark:border-slate-700">
                    <form onSubmit={handleSearch} className="flex items-center gap-2">
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Ex: Criar tarefa 'Revisar relatório' para o projeto X"
                            className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white dark:bg-slate-700"
                            autoFocus
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !query.trim()}
                            className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors shadow-sm disabled:bg-slate-400 disabled:cursor-not-allowed"
                        >
                            <PaperAirplaneIcon className="w-5 h-5" />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AISearchModal;