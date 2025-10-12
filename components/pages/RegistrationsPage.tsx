import React, { useState, useContext } from 'react';
import Header from '../Header';
import Card from '../Card';
import ClientsTab from './registrations/ClientsTab';
import ProductsTab from './registrations/ProductsTab';
import ServicesTab from './registrations/ServicesTab';
import SuppliersTab from './registrations/SuppliersTab';
import TransportersTab from './registrations/TransportersTab';
import SellersTab from './registrations/SellersTab';
import FundingSourcesTab from './registrations/FundingSourcesTab';
import BudgetItemsTab from './registrations/BudgetItemsTab';
import { AppContext } from '../../App';

type Tab = 'clients' | 'products' | 'services' | 'suppliers' | 'transporters' | 'sellers' | 'fundingSources' | 'budgetItems';

const RegistrationsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('clients');
  const context = useContext(AppContext);

  if (!context) return null;

  const { 
    clients, handleSaveClient, handleDeleteClient,
    products, handleSaveProduct, handleDeleteProduct,
    services, handleSaveService, handleDeleteService,
    suppliers, handleSaveSupplier, handleDeleteSupplier,
    transporters, handleSaveTransporter, handleDeleteTransporter,
    sellers, handleSaveSeller, handleDeleteSeller,
    fundingSources, handleSaveFundingSource, handleDeleteFundingSource,
    budgetItems, handleSaveBudgetItem, handleDeleteBudgetItem
  } = context;

  const tabs: { id: Tab, label: string }[] = [
    { id: 'clients', label: 'Clientes' },
    { id: 'suppliers', label: 'Fornecedores' },
    { id: 'products', label: 'Produtos/Insumos' },
    { id: 'services', label: 'Serviços' },
    { id: 'fundingSources', label: 'Fontes de Recurso' },
    { id: 'budgetItems', label: 'Rubricas Orçamentárias' },
    { id: 'transporters', label: 'Transportadoras' },
    { id: 'sellers', label: 'Vendedores' },
  ];

  const renderTabContent = () => {
    switch(activeTab) {
      case 'clients': return <ClientsTab clients={clients} onSave={handleSaveClient} onDelete={handleDeleteClient} />;
      case 'products': return <ProductsTab products={products} onSave={handleSaveProduct} onDelete={handleDeleteProduct} />;
      case 'services': return <ServicesTab services={services} onSave={handleSaveService} onDelete={handleDeleteService} />;
      case 'suppliers': return <SuppliersTab suppliers={suppliers} onSave={handleSaveSupplier} onDelete={handleDeleteSupplier} />;
      case 'transporters': return <TransportersTab transporters={transporters} onSave={handleSaveTransporter} onDelete={handleDeleteTransporter} />;
      case 'sellers': return <SellersTab sellers={sellers} onSave={handleSaveSeller} onDelete={handleDeleteSeller} />;
      case 'fundingSources': return <FundingSourcesTab sources={fundingSources} onSave={handleSaveFundingSource} onDelete={handleDeleteFundingSource} />;
      case 'budgetItems': return <BudgetItemsTab items={budgetItems} onSave={handleSaveBudgetItem} onDelete={handleDeleteBudgetItem} />;
      default: return null;
    }
  };

  return (
    <div className="p-8">
      <Header title="Cadastros" />
      <Card>
        <div className="border-b border-slate-200 dark:border-slate-700">
          <nav className="-mb-px flex space-x-6 overflow-x-auto" aria-label="Tabs">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`${
                  activeTab === tab.id
                    ? 'border-teal-500 text-teal-600 dark:border-teal-400 dark:text-teal-400'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:border-slate-500'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
        <div className="mt-6">
            {renderTabContent()}
        </div>
      </Card>
    </div>
  );
};

export default RegistrationsPage;
