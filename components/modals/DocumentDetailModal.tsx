

import React, { useState, useContext } from 'react';
import { AppContext, AuthContext } from '../../App';
import type { Document, User, DocumentPermission } from '../../types';
import { queryDocumentContent } from '../../services/geminiService';
import Modal from './Modal';
import { SparklesIcon, DocumentTextIcon, ArrowPathIcon, KeyIcon, ChatBubbleBottomCenterTextIcon } from '../icons';

interface DocumentDetailModalProps {
  doc: Document;
  onClose: () => void;
}

type Tab = 'details' | 'versions' | 'permissions' | 'comments' | 'ai_query';

const DocumentDetailModal: React.FC<DocumentDetailModalProps> = ({ doc, onClose }) => {
    const [activeTab, setActiveTab] = useState<Tab>('details');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string|null>(null);
    const [aiResponse, setAiResponse] = useState('');
    const [aiQuestion, setAiQuestion] = useState('');
    const [newComment, setNewComment] = useState('');

    const [isManagingPermissions, setIsManagingPermissions] = useState(false);
    const [permissions, setPermissions] = useState<DocumentPermission[]>(doc.permissions);
    const [userToAdd, setUserToAdd] = useState('');
    const [accessLevel, setAccessLevel] = useState<'read' | 'write'>('read');
    
    const [isUploadingVersion, setIsUploadingVersion] = useState(false);
    const [changeNotes, setChangeNotes] = useState('');

    const appContext = useContext(AppContext);
    const authContext = useContext(AuthContext);
    const { user } = authContext;
    const { users, handleUpdatePermissions, handleUploadNewVersion, handleAddDocumentComment } = appContext;

    const hasWriteAccess = doc.permissions.some(p => p.userId === user?.id && p.accessLevel === 'write');

    const handleAskAI = async () => {
        if (!aiQuestion.trim()) return;
        setIsLoading(true);
        setError(null);
        setAiResponse('');
        try {
            const result = await queryDocumentContent(doc.content, aiQuestion);
            setAiResponse(result);
        } catch (e: any) {
            setError(e.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePostComment = () => {
        if (newComment.trim() && user) {
            handleAddDocumentComment(doc.id, user.id, newComment.trim());
            // This is an optimistic update. The parent state will handle the source of truth.
            doc.comments = [...(doc.comments || []), { id: 'temp', authorId: user.id, authorName: user.name, content: newComment.trim(), createdAt: new Date().toISOString() }];
            setNewComment('');
        }
    };
    
    const handleAddPermission = () => {
        if (userToAdd && !permissions.some(p => p.userId === userToAdd)) {
            const userObject = users.find(u => u.id === userToAdd);
            if (userObject) {
                setPermissions([...permissions, { userId: userObject.id, userName: userObject.name, accessLevel }]);
            }
        }
    };
    
    const handleRemovePermission = (userId: string) => {
        if (userId === doc.ownerId) return; // Cannot remove owner
        setPermissions(permissions.filter(p => p.userId !== userId));
    };
    
    const handleSavePermissions = () => {
        handleUpdatePermissions(doc.id, permissions);
        setIsManagingPermissions(false);
    };

    const handleSaveNewVersion = () => {
        if (!changeNotes.trim() || !user) return;
        // In a real app, you'd handle a file upload here. We'll simulate new content.
        const newContent = `${doc.content}\n\n[NOVA VERSÃO - ${new Date().toLocaleString('pt-BR')}]: ${changeNotes}`;
        handleUploadNewVersion(doc.id, user, changeNotes, newContent);
        setChangeNotes('');
        setIsUploadingVersion(false);
        // Note: The modal won't auto-update with the new version as it's passed by value.
        // A real app with global state management would solve this.
        onClose(); // Close and reopen to see changes.
    };

    const tabs: { id: Tab, label: string, icon: React.FC<{className?: string}> }[] = [
        { id: 'details', label: 'Detalhes', icon: DocumentTextIcon },
        { id: 'versions', label: 'Versões', icon: ArrowPathIcon },
        { id: 'permissions', label: 'Permissões', icon: KeyIcon },
        { id: 'comments', label: 'Comentários', icon: ChatBubbleBottomCenterTextIcon },
        { id: 'ai_query', label: 'Perguntar à IA', icon: SparklesIcon },
    ];

    const renderContent = () => {
        switch(activeTab) {
            case 'details':
                return (
                    <div className="space-y-4 text-sm">
                        <p><strong className="font-semibold">Descrição:</strong> {doc.description}</p>
                        <p><strong className="font-semibold">Tipo:</strong> {doc.type}</p>
                        <p><strong className="font-semibold">Projeto:</strong> {doc.projectName || 'N/A'}</p>
                        <p><strong className="font-semibold">Proprietário:</strong> {users.find(u => u.id === doc.ownerId)?.name || 'N/A'}</p>
                        <h4 className="font-semibold pt-4 border-t border-slate-200 dark:border-slate-700">Conteúdo do Documento (Última Versão)</h4>
                        <pre className="p-2 bg-slate-50 dark:bg-slate-700/50 rounded-md text-xs whitespace-pre-wrap font-sans max-h-60 overflow-y-auto">{doc.content}</pre>
                    </div>
                );
            case 'versions':
                return (
                    <div className="space-y-4">
                        {hasWriteAccess && !isUploadingVersion && <button onClick={() => setIsUploadingVersion(true)} className="w-full text-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700">Carregar Nova Versão</button>}
                        {isUploadingVersion && (
                            <div className="p-4 border border-teal-500 rounded-lg space-y-2">
                                <h4 className="font-semibold">Nova Versão</h4>
                                <textarea value={changeNotes} onChange={e => setChangeNotes(e.target.value)} placeholder="Descreva as alterações feitas nesta versão..." rows={2} className="w-full p-2 border rounded-md bg-white dark:bg-slate-700" />
                                <div className="flex justify-end gap-2">
                                    <button onClick={() => setIsUploadingVersion(false)} className="px-3 py-1 bg-slate-200 dark:bg-slate-600 text-sm rounded-md">Cancelar</button>
                                    <button onClick={handleSaveNewVersion} className="px-3 py-1 bg-teal-600 text-white text-sm rounded-md">Salvar Versão</button>
                                </div>
                            </div>
                        )}
                        <h4 className="font-semibold">Histórico de Versões</h4>
                        <div className="space-y-3 max-h-80 overflow-y-auto">
                            {[...doc.versions].reverse().map(v => (
                                <div key={v.id} className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-md text-sm">
                                    <p className="font-bold">Versão {v.versionNumber}</p>
                                    <p className="text-xs text-slate-500">por {v.uploaderName} em {new Date(v.uploadDate).toLocaleString('pt-BR')}</p>
                                    <p className="mt-1 italic">"{v.changeNotes}"</p>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 'permissions':
                 return (
                    <div className="space-y-4">
                        {hasWriteAccess && !isManagingPermissions && <button onClick={() => setIsManagingPermissions(true)} className="w-full text-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700">Gerenciar Permissões</button>}
                        {isManagingPermissions ? (
                             <div className="p-4 border border-teal-500 rounded-lg space-y-4">
                                <div>
                                    <h4 className="font-semibold mb-2">Adicionar Permissão</h4>
                                    <div className="flex gap-2">
                                        <select value={userToAdd} onChange={e => setUserToAdd(e.target.value)} className="flex-grow p-2 border rounded-md bg-white dark:bg-slate-700"><option value="">Selecione um usuário</option>{users.filter(u=>!permissions.some(p=>p.userId === u.id)).map(u => <option key={u.id} value={u.id}>{u.name}</option>)}</select>
                                        <select value={accessLevel} onChange={e => setAccessLevel(e.target.value as any)} className="p-2 border rounded-md bg-white dark:bg-slate-700"><option value="read">Leitura</option><option value="write">Escrita</option></select>
                                        <button onClick={handleAddPermission} className="px-3 py-1 bg-teal-600 text-white text-sm rounded-md">+</button>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    {permissions.map(p => (
                                        <div key={p.userId} className="flex justify-between items-center text-sm p-2 bg-slate-50 dark:bg-slate-700/50 rounded">
                                            <span>{p.userName} ({p.accessLevel === 'read' ? 'Leitura' : 'Escrita'}) {p.userId === doc.ownerId && '(Proprietário)'}</span>
                                            {p.userId !== doc.ownerId && <button onClick={() => handleRemovePermission(p.userId)} className="text-red-500 text-lg">&times;</button>}
                                        </div>
                                    ))}
                                </div>
                                <div className="flex justify-end gap-2"><button onClick={() => {setIsManagingPermissions(false); setPermissions(doc.permissions);}} className="px-3 py-1 bg-slate-200 dark:bg-slate-600 text-sm rounded-md">Cancelar</button><button onClick={handleSavePermissions} className="px-3 py-1 bg-teal-600 text-white text-sm rounded-md">Salvar Permissões</button></div>
                            </div>
                        ) : (
                             <div className="space-y-2">
                                {permissions.map(p => (
                                    <div key={p.userId} className="flex justify-between items-center text-sm p-2 bg-slate-50 dark:bg-slate-700/50 rounded">
                                        <span>{p.userName} {p.userId === doc.ownerId && '(Proprietário)'}</span>
                                        <span className="font-semibold">{p.accessLevel === 'read' ? 'Leitura' : 'Escrita'}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                );
            case 'comments':
                return (
                    <div className="space-y-4">
                        <div className="space-y-3 max-h-72 overflow-y-auto p-2 border-b border-slate-200 dark:border-slate-700">
                            {(doc.comments || []).map(comment => (
                                <div key={comment.id}>
                                    <p className="text-xs">
                                        <span className="font-semibold">{comment.authorName}</span>
                                        <span className="text-slate-400 ml-2">{new Date(comment.createdAt).toLocaleString('pt-BR')}</span>
                                    </p>
                                    <p className="text-sm bg-slate-100 dark:bg-slate-700/50 p-2 rounded-md mt-1">{comment.content}</p>
                                </div>
                            ))}
                            {(!doc.comments || doc.comments.length === 0) && <p className="text-xs text-center text-slate-400 py-4">Nenhum comentário ainda.</p>}
                        </div>
                         <div className="flex items-start space-x-2">
                            <textarea value={newComment} onChange={e => setNewComment(e.target.value)} placeholder="Adicionar um comentário..." rows={2} className="flex-1 mt-1 block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md" />
                            <button type="button" onClick={handlePostComment} className="mt-1 px-4 py-2 bg-slate-200 dark:bg-slate-600 rounded-lg">Enviar</button>
                        </div>
                    </div>
                );
            case 'ai_query':
                return (
                    <div className="space-y-4">
                        <textarea value={aiQuestion} onChange={e => setAiQuestion(e.target.value)} placeholder="Pergunte algo sobre o conteúdo deste documento..." rows={3} className="w-full p-2 border rounded-md bg-white dark:bg-slate-700" />
                        <button onClick={handleAskAI} disabled={isLoading} className="w-full flex items-center justify-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:bg-slate-400">
                            {isLoading ? 'Analisando...' : 'Perguntar'}
                        </button>
                        {error && <p className="text-red-500 text-sm">Erro: {error}</p>}
                        {aiResponse && <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-md text-sm whitespace-pre-wrap">{aiResponse}</div>}
                    </div>
                );
        }
    };

    return (
        <Modal isOpen={true} onClose={onClose} title={doc.name}>
            <div className="flex flex-col">
                <div className="border-b border-slate-200 dark:border-slate-700">
                    <nav className="-mb-px flex space-x-4 overflow-x-auto">
                        {tabs.map(tab => (
                            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`${activeTab === tab.id ? 'border-teal-500 text-teal-600' : 'border-transparent text-slate-500 hover:text-slate-700'} flex items-center whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm`}>
                                <tab.icon className="w-4 h-4 mr-2" /> {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>
                <div className="py-6">{renderContent()}</div>
            </div>
        </Modal>
    );
};

export default DocumentDetailModal;