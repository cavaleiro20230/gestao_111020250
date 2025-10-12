
import React, { useState, useContext, useMemo } from 'react';
import { AppContext } from '../../App';
import Header from '../Header';
import Card from '../Card';
import DocumentModal from '../modals/DocumentModal';
import ConfirmationModal from '../modals/ConfirmationModal';
import DocumentDetailModal from '../modals/DocumentDetailModal';
import type { Document } from '../../types';

const DocumentsPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [documentToDelete, setDocumentToDelete] = useState<Document | null>(null);
  const [docInDetail, setDocInDetail] = useState<Document | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const context = useContext(AppContext);
  if (!context) return null;

  const { documents, projects, users, handleSaveDocument, handleDeleteDocument } = context;

  const openModal = (doc: Document | null = null) => {
    setSelectedDocument(doc);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedDocument(null);
    setIsModalOpen(false);
  };
  
  const filteredDocuments = useMemo(() => {
    if (!searchTerm) return documents;
    const lowercasedTerm = searchTerm.toLowerCase();
    return documents.filter(doc => 
      doc.name.toLowerCase().includes(lowercasedTerm) ||
      doc.content.toLowerCase().includes(lowercasedTerm) ||
      doc.projectName?.toLowerCase().includes(lowercasedTerm)
    );
  }, [documents, searchTerm]);

  return (
    <div className="p-8">
      <Header title="Gestão de Documentos">
        <button onClick={() => openModal()} className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors shadow-sm">
          Novo Documento
        </button>
      </Header>

      <Card>
        <div className="mb-4">
            <input
              type="search"
              placeholder="Pesquisar por nome, projeto ou conteúdo do documento..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white dark:bg-slate-700"
            />
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
            <thead className="bg-slate-50 dark:bg-slate-700/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Nome do Documento</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Projeto Associado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Proprietário</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Data de Criação</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
              {filteredDocuments.map(doc => (
                <tr key={doc.id} onClick={() => setDocInDetail(doc)} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer">
                  <td className="px-6 py-4 whitespace-nowrap font-medium">{doc.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{doc.projectName || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{users.find(u => u.id === doc.ownerId)?.name || 'Desconhecido'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{new Date(doc.uploadDate).toLocaleDateString('pt-BR')}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={(e) => { e.stopPropagation(); setDocInDetail(doc); }} className="text-teal-600 hover:text-teal-900 dark:text-teal-400 dark:hover:text-teal-200">Detalhes</button>
                    <button onClick={(e) => { e.stopPropagation(); setDocumentToDelete(doc); }} className="ml-4 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200">Excluir</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {isModalOpen && <DocumentModal document={selectedDocument} onClose={closeModal} onSave={handleSaveDocument} projects={projects} />}
      
      {docInDetail && <DocumentDetailModal doc={docInDetail} onClose={() => setDocInDetail(null)} />}

      {documentToDelete && (
        <ConfirmationModal
          isOpen={!!documentToDelete}
          onClose={() => setDocumentToDelete(null)}
          onConfirm={() => {
            handleDeleteDocument(documentToDelete.id);
            setDocumentToDelete(null);
          }}
          title="Excluir Documento"
          message={`Tem certeza que deseja excluir o documento "${documentToDelete.name}"? Esta ação não pode ser desfeita.`}
        />
      )}
    </div>
  );
};

export default DocumentsPage;
