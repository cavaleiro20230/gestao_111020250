import React, { useState, useContext } from 'react';
import { AppContext } from '../../App';
import Header from '../Header';
import Card from '../Card';
import AssetModal from '../modals/AssetModal';
import ConfirmationModal from '../modals/ConfirmationModal';
import AssetDetailModal from '../modals/AssetDetailModal';
import RunDepreciationModal from '../modals/RunDepreciationModal';
import type { Asset } from '../../types';

const AssetsPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRunDepreciationModalOpen, setIsRunDepreciationModalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [assetToDelete, setAssetToDelete] = useState<Asset | null>(null);
  const [assetForDetail, setAssetForDetail] = useState<Asset | null>(null);
  
  const context = useContext(AppContext);
  if (!context) return null;

  const { assets, projects, handleSaveAsset, handleDeleteAsset, depreciationHistory, handleRunDepreciation } = context;

  const openModal = (asset: Asset | null = null) => {
    setSelectedAsset(asset);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedAsset(null);
    setIsModalOpen(false);
  };
  
  const formatCurrency = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const getAssetCurrentValue = (asset: Asset) => {
    const assetHistory = depreciationHistory
        .filter(e => e.assetId === asset.id)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    if (assetHistory.length > 0) {
        return assetHistory[0].bookValueAfter;
    }
    return asset.value;
  };


  return (
    <div className="p-8">
      <Header title="Patrimônio (Ativos)">
        <div className="flex space-x-2">
            <button onClick={() => setIsRunDepreciationModalOpen(true)} className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors shadow-sm">
                Calcular Depreciação
            </button>
            <button onClick={() => openModal()} className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors shadow-sm">
                Novo Ativo
            </button>
        </div>
      </Header>
      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
            <thead className="bg-slate-50 dark:bg-slate-700/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Nome do Ativo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Projeto de Origem</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Valor de Aquisição</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Valor Contábil</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
              {assets.map(asset => (
                <tr key={asset.id} onClick={() => setAssetForDetail(asset)} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer">
                  <td className="px-6 py-4 whitespace-nowrap font-medium">{asset.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{asset.projectName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{formatCurrency(asset.value)}</td>
                  <td className="px-6 py-4 whitespace-nowrap font-semibold">{formatCurrency(getAssetCurrentValue(asset))}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full`}>
                        {asset.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={(e) => { e.stopPropagation(); openModal(asset);}} className="text-teal-600 hover:text-teal-900 dark:text-teal-400 dark:hover:text-teal-200">Editar</button>
                    <button onClick={(e) => { e.stopPropagation(); setAssetToDelete(asset);}} className="ml-4 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200">Excluir</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      {isModalOpen && <AssetModal asset={selectedAsset} onClose={closeModal} onSave={handleSaveAsset} projects={projects} />}
      {assetToDelete && (
        <ConfirmationModal
          isOpen={!!assetToDelete}
          onClose={() => setAssetToDelete(null)}
          onConfirm={() => {
            handleDeleteAsset(assetToDelete.id);
            setAssetToDelete(null);
          }}
          title="Excluir Ativo"
          message={`Tem certeza que deseja excluir o ativo "${assetToDelete.name}"?`}
        />
      )}
      {isRunDepreciationModalOpen && <RunDepreciationModal onClose={() => setIsRunDepreciationModalOpen(false)} onRun={handleRunDepreciation} />}
      {assetForDetail && <AssetDetailModal asset={assetForDetail} onClose={() => setAssetForDetail(null)} />}
    </div>
  );
};

export default AssetsPage;