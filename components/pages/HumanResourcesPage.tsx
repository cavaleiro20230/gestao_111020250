import React, { useState } from 'react';
import Header from '../Header';
import Card from '../Card';
import TeamTab from './personnel/TeamTab';
import TimesheetsTab from './personnel/TimesheetsTab';
import TravelRequestsTab from './personnel/TravelRequestsTab';
import PerformanceReviewsTab from './personnel/PerformanceReviewsTab';
import HolidaysTab from './personnel/HolidaysTab';
import OnboardingTab from './personnel/OnboardingTab';
import OrgChartTab from './personnel/OrgChartTab';
import { ClockIcon, UsersIcon, PaperAirplaneIcon, ShieldCheckIcon } from '../icons';

type Tab = 'team' | 'timesheets' | 'travel' | 'reviews' | 'holidays' | 'onboarding' | 'orgchart';

const HumanResourcesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('team');

  const tabs: { id: Tab, label: string, icon: React.FC<{className?: string}> }[] = [
    { id: 'team', label: 'Equipe', icon: UsersIcon },
    { id: 'orgchart', label: 'Organograma', icon: UsersIcon },
    { id: 'timesheets', label: 'Apontamento de Horas', icon: ClockIcon },
    { id: 'holidays', label: 'Férias e Ausências', icon: ClockIcon },
    { id: 'travel', label: 'Diárias e Viagens', icon: PaperAirplaneIcon },
    { id: 'reviews', label: 'Avaliações de Desempenho', icon: ShieldCheckIcon },
    { id: 'onboarding', label: 'Onboarding/Offboarding', icon: UsersIcon },
  ];

  const renderTabContent = () => {
    switch(activeTab) {
      case 'team': return <TeamTab />;
      case 'timesheets': return <TimesheetsTab />;
      case 'travel': return <TravelRequestsTab />;
      case 'reviews': return <PerformanceReviewsTab />;
      case 'holidays': return <HolidaysTab />;
      case 'onboarding': return <OnboardingTab />;
      case 'orgchart': return <OrgChartTab />;
      default: return null;
    }
  };

  return (
    <div className="p-8">
      <Header title="Recursos Humanos" />
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
                } flex items-center whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
              >
                <tab.icon className="w-5 h-5 mr-2" />
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

export default HumanResourcesPage;