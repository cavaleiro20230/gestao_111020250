import React, { useContext } from 'react';
import { AppContext } from '../../../App';
import { Page } from '../../../types';
import AccountingConfigForm from '../configuration/AccountingConfigForm';

const AccountingConfigurationPage: React.FC = () => {
    const context = useContext(AppContext);
    if (!context) return null;

    const {
        accountingConfig,
        handleSaveAccountingConfig,
        chartOfAccounts,
        setActivePage
    } = context;

    return (
        <div className="p-8">
            <AccountingConfigForm
                config={accountingConfig}
                onSave={handleSaveAccountingConfig}
                onBack={() => setActivePage(Page.Accounting)}
                chartOfAccounts={chartOfAccounts}
            />
        </div>
    );
};

export default AccountingConfigurationPage;