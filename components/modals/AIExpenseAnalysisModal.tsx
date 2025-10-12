import React, { useState, useRef } from 'react';
import Modal from './Modal';
import { CameraIcon, SparklesIcon } from '../icons';
import { analyzeExpenseDocument } from '../../services/geminiService';
import type { AIExpenseData } from '../../types';

interface AIExpenseAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAnalysisComplete: (data: AIExpenseData) => void;
}

const AIExpenseAnalysisModal: React.FC<AIExpenseAnalysisModalProps> = ({ isOpen, onClose, onAnalysisComplete }) => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setError(null);
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleProcess = () => {
    if (!file) return;

    setIsLoading(true);
    setError(null);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      try {
        const base64String = (reader.result as string).split(',')[1];
        const result = await analyzeExpenseDocument(base64String, file.type);
        onAnalysisComplete(result);
      } catch (e: any) {
        setError(e.message || 'Ocorreu um erro desconhecido.');
      } finally {
        setIsLoading(false);
      }
    };
    reader.onerror = () => {
      setError('Falha ao ler o arquivo.');
      setIsLoading(false);
    };
  };

  const handleClose = () => {
      // Clean up state when closing
      setFile(null);
      setPreviewUrl(null);
      setError(null);
      setIsLoading(false);
      onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Análise de Despesa com IA">
      <div className="space-y-4">
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Envie uma foto ou um arquivo PDF de uma nota fiscal ou recibo. A inteligência artificial do Gemini irá extrair automaticamente os dados como fornecedor, valor, data e itens para pré-preencher um lançamento de contas a pagar.
        </p>

        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*,.pdf" />

        {previewUrl ? (
          <div className="relative border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-2 h-64">
            <img src={previewUrl} alt="Preview" className="w-full h-full object-contain" />
          </div>
        ) : (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg text-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50"
          >
            <CameraIcon className="w-12 h-12 text-slate-400" />
            <p className="mt-4 text-sm text-slate-500">
              Clique para tirar uma foto ou selecionar o arquivo da sua nota fiscal ou recibo.
            </p>
          </div>
        )}
        
        {file && <p className="text-sm text-center text-slate-500">Arquivo selecionado: {file.name}</p>}

        {isLoading && (
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500 mx-auto"></div>
            <p className="mt-2 text-sm text-slate-500">Analisando documento... Isso pode levar um momento.</p>
          </div>
        )}
        
        {error && <p className="text-sm text-center text-red-500">{error}</p>}

      </div>
      <div className="mt-6 flex justify-end space-x-2">
        <button type="button" onClick={handleClose} className="px-4 py-2 bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-white rounded-lg hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors">
          Cancelar
        </button>
        <button onClick={handleProcess} disabled={!file || isLoading} className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors shadow-sm disabled:bg-slate-400 disabled:cursor-not-allowed flex items-center">
          <SparklesIcon className="w-5 h-5 mr-2" />
          {isLoading ? 'Processando...' : 'Processar com IA'}
        </button>
      </div>
    </Modal>
  );
};

export default AIExpenseAnalysisModal;
