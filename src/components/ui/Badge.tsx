import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'green' | 'gold' | 'dark' | 'outline';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'green', className = '' }) => {
  const variantStyles = {
    green: 'bg-[color:var(--nfc-green)] text-white',
    gold: 'bg-[color:var(--nfc-yellow)] text-[color:var(--nfc-dark)] font-bold',
    dark: 'bg-[color:var(--nfc-dark)] text-gray-200 border border-gray-700',
    outline: 'border border-gray-300 text-gray-700',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold uppercase tracking-wider font-display ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
