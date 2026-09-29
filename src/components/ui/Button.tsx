import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'gold' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  // prefer display font for buttons (uppercase CTA) but keep body for normal buttons
  const fontRole = variant === 'gold' || variant === 'primary' ? 'font-display' : 'font-body';
  
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3.5 text-base',
  };

  const variantStyles = {
    primary: 'bg-[color:var(--nfc-green)] hover:bg-[color:var(--nfc-green-light)] text-[color:var(--nfc-white)] focus:ring-[color:var(--nfc-green-light)] shadow-md',
    secondary: 'bg-[color:var(--nfc-surface)] hover:bg-[color:var(--nfc-bg)] text-[color:var(--nfc-text)] border border-[color:var(--nfc-border)] focus:ring-gray-500',
    outline: 'border border-[color:var(--nfc-green)] text-[color:var(--nfc-green)] hover:bg-[color:var(--nfc-green)]/10 focus:ring-[color:var(--nfc-green)]',
    gold: 'bg-[color:var(--nfc-yellow)] hover:bg-[color:var(--nfc-yellow-hover)] text-[color:var(--nfc-dark)] font-bold focus:ring-[color:var(--nfc-yellow-hover)] shadow-md',
    ghost: 'text-gray-500 hover:text-[color:var(--nfc-dark)] hover:bg-white/5 focus:ring-gray-500',
  };

  return (
    <button
      className={`${baseStyles} ${fontRole} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
