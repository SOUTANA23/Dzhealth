import React from 'react';

type NeonCardProps = {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  color?: 'cyan' | 'red' | 'green' | 'blue' | 'default';
};

const colorMap = {
  cyan: 'border-cyan-500/30 hover:border-cyan-400/60 hover:shadow-cyan-500/20',
  red: 'border-red-500/30 hover:border-red-400/60 hover:shadow-red-500/20',
  green: 'border-green-500/30 hover:border-green-400/60 hover:shadow-green-500/20',
  blue: 'border-blue-500/30 hover:border-blue-400/60 hover:shadow-blue-500/20',
  default: 'border-white/10 hover:border-white/20 hover:shadow-white/10',
};

export function NeonCard({ children, className = '', onClick, color = 'default' }: NeonCardProps) {
  return (
    <div
      onClick={onClick}
      className={`
        bg-[#0d1b2a]/80 backdrop-blur-sm border rounded-2xl
        transition-all duration-200 hover:shadow-lg
        ${colorMap[color]}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
