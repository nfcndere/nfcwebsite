import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'green' | 'gold' | 'dark' | 'outline';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'green', className = '' }) => {
  const variantStyles = {
    green: 'bg-nfc-green-950/80 text-emerald-300 border border-nfc-green-500/40',
    gold: 'bg-amber-950/80 text-amber-300 border border-amber-500/40',
    dark: 'bg-nfc-dark text-gray-300 border border-gray-700',
    outline: 'border border-gray-600 text-gray-300',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold font-display ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  );
};

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`glass-card rounded-2xl p-6 relative overflow-hidden font-body ${className}`}>
      {children}
    </div>
  );
};
