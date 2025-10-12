import React, { useState } from 'react';
import type { Product } from '../../../types';
import ProductModal from '../../modals/ProductModal';
import ConfirmationModal from '../../modals/ConfirmationModal';
import TableControls from '../../TableControls';

interface ProductsTabProps {
  products: Product[];
  onSave: (product: Product) => void;
  onDelete: (productId: string) => void;
}

const ProductsTab: React.FC<ProductsTabProps> = ({ products, onSave, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const formatCurrency = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const openModal = (product: Product | null = null) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setIsModalOpen(false);
  };

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div>
      <TableControls
        onAdd={() => openModal()}
        addLabel="Novo Produto"
        onSearch={setSearchTerm}
      />

      <div className="overflow-x-auto mt-4">
        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
          <thead className="bg-slate-50 dark:bg-slate-700/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Nome</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Categoria</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Preço</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Estoque</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
            {filteredProducts.map(product => (
              <tr key={product.id}>
                <td className="px-6 py-4 whitespace-nowrap">{product.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{product.category}</td>
                <td className="px-6 py-4 whitespace-nowrap">{formatCurrency(product.price)}</td>
                <td className="px-6 py-4 whitespace-nowrap">{product.stock}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => openModal(product)} className="text-teal-600 hover:text-teal-900 dark:text-teal-400 dark:hover:text-teal-200">Editar</button>
                  <button onClick={() => setProductToDelete(product)} className="ml-4 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200">Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {isModalOpen && <ProductModal product={selectedProduct} onClose={closeModal} onSave={onSave} />}
      {productToDelete && (
        <ConfirmationModal
          isOpen={!!productToDelete}
          onClose={() => setProductToDelete(null)}
          onConfirm={() => {
            onDelete(productToDelete.id);
            setProductToDelete(null);
          }}
          title="Excluir Produto"
          message={`Tem certeza que deseja excluir o produto ${productToDelete.name}?`}
        />
      )}
    </div>
  );
};

export default ProductsTab;
