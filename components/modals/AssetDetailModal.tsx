import React, { useContext, useMemo } from 'react';
import type { Asset } from '../../types';
import { AppContext } from '../../App';
import Modal from './Modal';

interface AssetDetailModalProps {
  asset: Asset;
  onClose: () => void;
}

const AssetDetailModal: React.FC<AssetDetailModalProps> = ({ asset, onClose }) => {
  const context = useContext(AppContext);
  if (!context) return null;

  const { depreciationHistory } = context;

  const assetHistory = useMemo(() => {
    return depreciationHistory
      .filter(e => e.assetId === asset.id)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [depreciationHistory, asset.id]);

  const formatCurrency = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('pt-BR', { timeZone: 'UTC' });

  return (
    <Modal isOpen={true} onClose={onClose} title={`Detalhes do Ativo: ${asset.name}`}>
      <div className="space-y-6">
        {/* Asset Info */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          <div><p className="font-semibold">N/S</p><p>{asset.serialNumber}</p></div>
          <div><p className="font-semibold">Data Aquisição</p><p>{formatDate(asset.acquisitionDate)}</p></div>
          <div><p className="font-semibold">Valor Aquisição</p><p>{formatCurrency(asset.value)}</p></div>
          <div><p className="font-semibold">Método Depreciação</p><p>{asset.depreciationMethod === 'linear' ? 'Linear' : 'Nenhum'}</p></div>
          <div><p className="font-semibold">Vida Útil</p><p>{asset.usefulLifeMonths} meses</p></div>
          <div><p className="font-semibold">Valor Residual</p><p>{formatCurrency(asset.salvageValue)}</p></div>
        </div>

        {/* Depreciation History */}
        <div>
          <h4 className="text-md font-semibold mb-2">Histórico de Depreciação</h4>
          <div className="overflow-auto border border-slate-200 dark:border-slate-700 rounded-lg max-h-60">
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
              <thead className="bg-slate-50 dark:bg-slate-700/50 sticky top-0">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase">Data Lançamento</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-slate-500 dark:text-slate-300 uppercase">Valor Depreciado</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-slate-500 dark:text-slate-300 uppercase">Valor Contábil</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-slate-800">
                {assetHistory.map(entry => (
                  <tr key={entry.id}>
                    <td className="px-4 py-2 whitespace-nowrap text-sm">{formatDate(entry.date)}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-right text-red-600 dark:text-red-400">{formatCurrency(entry.amount)}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-right font-semibold">{formatCurrency(entry.bookValueAfter)}</td>
                  </tr>
                ))}
                {assetHistory.length === 0 && (
                  <tr>
                    <td colSpan={3} className="text-center py-4 text-sm text-slate-500">Nenhum lançamento de depreciação encontrado.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="mt-6 flex justify-end">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-white rounded-lg hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors">
            Fechar
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AssetDetailModal;