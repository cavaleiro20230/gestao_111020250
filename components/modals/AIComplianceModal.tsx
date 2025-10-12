import React, { useState, useContext } from 'react';
import Modal from './Modal';
import { SparklesIcon } from '../icons';
import { suggestComplianceObligations } from '../../services/geminiService';
import type { ComplianceObligation } from '../../types';
import { AppContext } from '../../App';

interface AIComplianceModalProps {
  grantId: string;
  onClose: () => void;
}

const AIComplianceModal: React.FC<AIComplianceModalProps> = ({ grantId, onClose }) => {
  const [documentText, setDocumentText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<Partial<ComplianceObligation>[]>([]);
  const context = useContext(AppContext);

  const handleAnalyze = async () => {
    if (!documentText.trim()) return;
    setIsLoading(true);
    setError(null);
    setSuggestions([]);
    try {
        const result = await suggestComplianceObligations(documentText);
        setSuggestions(result);
    } catch (e: any) {
        setError(e.message);
    } finally {
        setIsLoading(false);
    }
  };
  
  const handleAddSuggestion = (suggestion: Partial<ComplianceObligation>) => {
      if(context && suggestion.description && suggestion.dueDate) {
          context.handleSaveComplianceObligation({
              id: '', // will be generated
              grantId,
              description: suggestion.description,
              dueDate: suggestion.dueDate,
              status: 'Pendente',
          });
          setSuggestions(prev => prev.filter(s => s !== suggestion));
      }
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="Analisar Edital/Contrato com IA">
      <div className="space-y-4">
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Cole o texto do seu edital ou contrato abaixo. A IA do Gemini irá ler o conteúdo e sugerir as obrigações e prazos mais importantes para você acompanhar.
        </p>
        
        <textarea 
            value={documentText}
            onChange={e => setDocumentText(e.target.value)}
            placeholder="Cole o texto aqui..."
            rows={8}
            className="w-full p-2 border rounded-md bg-white dark:bg-slate-700"
        />

        <button onClick={handleAnalyze} disabled={isLoading || !documentText.trim()} className="w-full flex items-center justify-center px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 disabled:bg-slate-400">
          <SparklesIcon className="w-5 h-5 mr-2" />
          {isLoading ? 'Analisando...' : 'Analisar Texto'}
        </button>

        {error && <p className="text-sm text-center text-red-500">{error}</p>}
        
        {suggestions.length > 0 && (
            <div className="space-y-2 pt-4 border-t">
                 <h4 className="font-semibold">Sugestões Encontradas:</h4>
                {suggestions.map((s, i) => (
                    <div key={i} className="flex items-center justify-between p-2 bg-slate-100 dark:bg-slate-700/50 rounded-md text-sm">
                        <div>
                            <p>{s.description}</p>
                            <p className="text-xs text-slate-500">Vencimento: {s.dueDate}</p>
                        </div>
                        <button onClick={() => handleAddSuggestion(s)} className="px-3 py-1 bg-teal-600 text-white text-xs rounded-md">Adicionar</button>
                    </div>
                ))}
            </div>
        )}

      </div>
       <div className="mt-6 flex justify-end">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-white rounded-lg hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors">
            Fechar
          </button>
      </div>
    </Modal>
  );
};

export default AIComplianceModal;
