import React from 'react';

interface HeaderProps {
  title: string;
  children?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ title, children }) => {
  return (
    <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
      <h2 className="text-3xl font-bold text-slate-800 dark:text-white">{title}</h2>
      <div className="mt-4 md:mt-0">
        {children}
      </div>
    </header>
  );
};

export default Header;
