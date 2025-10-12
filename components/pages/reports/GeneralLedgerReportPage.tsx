// FIX: Create missing placeholder component to resolve module errors.
import React from 'react';
import Header from '../../Header';
import Card from '../../Card';

const GeneralLedgerReportPage: React.FC = () => {
  return (
    <div className="p-8">
      <Header title="Livro Razão" />
      <Card>
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-300">Em Desenvolvimento</h2>
          <p className="text-slate-500 mt-2">Este relatório está sendo construído. A funcionalidade está disponível na tela de Contabilidade.</p>
        </div>
      </Card>
    </div>
  );
};

export default GeneralLedgerReportPage;