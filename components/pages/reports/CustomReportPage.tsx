import React from 'react';
import Header from '../../Header';
import Card from '../../Card';

const CustomReportPage: React.FC = () => {
  return (
    <div className="p-8">
      <Header title="Relatórios Personalizados" />
      <Card>
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-300">Relatórios Personalizados</h2>
          <p className="text-slate-500 mt-2">Esta funcionalidade está em desenvolvimento.</p>
        </div>
      </Card>
    </div>
  );
};

export default CustomReportPage;