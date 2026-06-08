import React from 'react';

type NeonCardProps = {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  color?: 'cyan' | 'red' | 'green' | 'blue' | 'default';
};

const colorMap = {
  cyan:    'border-cyan-500/25 hover:border-cyan-400/50 hover:shadow-cyan-500/10',
  red:     'border-red-500/25 hover:border-red-400/50 hover:shadow-red-500/10',
  green:   'border-green-500/25 hover:border-green-400/50 hover:shadow-green-500/10',
  blue:    'border-blue-500/25 hover:border-blue-400/50 hover:shadow-blue-500/10',
  default: 'border-[var(--border)] hover:border-[var(--border)]',
};

export function NeonCard({ children, className = '', onClick, color = 'default' }: NeonCardProps) {
  return (
    <div
      onClick={onClick}
      className={`
        bg-[var(--bg-card)] backdrop-blur-sm border rounded-2xl
        transition-all duration-200 hover:shadow-lg theme-transition
        ${colorMap[color]}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
