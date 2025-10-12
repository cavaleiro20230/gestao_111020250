

import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  // FIX: Added onClick property to allow the Card component to be clickable.
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ children, className = '', onClick }) => {
  return (
    <div onClick={onClick} className={`bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm ${className}`}>
      {children}
    </div>
  );
};

export default Card;