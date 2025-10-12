import React, { useState, useContext } from 'react';
import type { OnboardingProcess } from '../../../types';
import { AppContext, AuthContext } from '../../../App';
import OnboardingProcessModal from '../../modals/OnboardingProcessModal';
import ConfirmationModal from '../../modals/ConfirmationModal';
import { generateWelcomeGuide } from '../../../services/geminiService';
import { SparklesIcon } from '../../icons';
import Modal from '../../modals/Modal';

const OnboardingTab: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProcess, setSelectedProcess] = useState<OnboardingProcess | null>(null);
  const [processToDelete, setProcessToDelete] = useState<OnboardingProcess | null>(null);
  const [welcomeGuide, setWelcomeGuide] = useState<string | null>(null);
  const [isGuideLoading, setIsGuideLoading] = useState(false);

  const context = useContext(AppContext);
  if (!context) return null;

  const { onboardingProcesses, personnel, users, handleSaveOnboardingProcess, handleDeleteOnboardingProcess } = context;

  const openModal = (process: OnboardingProcess | null = null) => {
    setSelectedProcess(process);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedProcess(null);
    setIsModalOpen(false);
  };
  
  const handleGenerateGuide = async (process: OnboardingProcess) => {
      const employee = personnel.find(p => p.id === process.employeeId);
      if (!employee) return;
      setIsGuideLoading(true);
      setWelcomeGuide(null);
      try {
          const guide = await generateWelcomeGuide(employee);
          setWelcomeGuide(guide);
      } catch (error) {
          console.error(error);
          alert("Erro ao gerar guia de boas-vindas.");
      } finally {
          setIsGuideLoading(false);
      }
  };

  return (
    <div className="space-y-6">
        <div className="flex justify-end">
             <button onClick={() => openModal()} className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700">
                Iniciar Novo Processo
            </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {onboardingProcesses.map(process => {
                const progress = process.tasks.filter(t => t.completed).length / process.tasks.length * 100;
                return (
                    <div key={process.id} className="p-4 border rounded-lg shadow-sm bg-white dark:bg-slate-800">
                        <h4 className="font-bold">{process.employeeName}</h4>
                        <p className={`text-sm font-semibold ${process.type === 'onboarding' ? 'text-green-500' : 'text-red-500'}`}>
                            {process.type === 'onboarding' ? 'Onboarding' : 'Offboarding'}
                        </p>
                        <div className="w-full bg-slate-200 rounded-full h-2.5 dark:bg-slate-700 mt-2">
                            <div className="bg-teal-500 h-2.5 rounded-full" style={{width: `${progress}%`}}></div>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">{progress.toFixed(0)}% concluído</p>
                        <div className="mt-4 pt-2 border-t flex justify-end gap-2">
                            {process.type === 'onboarding' && (
                                <button onClick={() => handleGenerateGuide(process)} className="text-xs flex items-center gap-1 text-sky-600 hover:text-sky-800">
                                    <SparklesIcon className="w-4 h-4" /> Gerar Guia
                                </button>
                            )}
                            <button onClick={() => openModal(process)} className="text-xs font-medium text-teal-600 hover:text-teal-800">Detalhes</button>
                            <button onClick={() => setProcessToDelete(process)} className="text-xs font-medium text-red-600 hover:text-red-800">Excluir</button>
                        </div>
                    </div>
                )
            })}
        </div>


      {isModalOpen && <OnboardingProcessModal process={selectedProcess} onClose={closeModal} onSave={handleSaveOnboardingProcess} personnel={personnel} users={users}/>}
      
      {processToDelete && (
        <ConfirmationModal
          isOpen={!!processToDelete}
          onClose={() => setProcessToDelete(null)}
          onConfirm={() => {
            handleDeleteOnboardingProcess(processToDelete.id);
            setProcessToDelete(null);
          }}
          title="Excluir Processo"
          message={`Tem certeza de que deseja excluir o processo de ${processToDelete.employeeName}?`}
        />
      )}

      {welcomeGuide && (
          <Modal isOpen={!!welcomeGuide} onClose={() => setWelcomeGuide(null)} title="Guia de Boas-Vindas Gerado por IA">
              <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">{welcomeGuide}</div>
          </Modal>
      )}
    </div>
  );
};

export default OnboardingTab;