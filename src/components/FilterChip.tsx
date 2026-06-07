type FilterChipProps = {
  label: string;
  active?: boolean;
  onClick?: () => void;
  color?: 'cyan' | 'red' | 'green' | 'blue';
};

const colorMap = {
  cyan: {
    active: 'bg-cyan-500 text-white border-cyan-500',
    inactive: 'bg-transparent text-gray-400 border-gray-700 hover:border-cyan-500/50',
  },
  red: {
    active: 'bg-red-600 text-white border-red-600',
    inactive: 'bg-transparent text-gray-400 border-gray-700 hover:border-red-500/50',
  },
  green: {
    active: 'bg-green-600 text-white border-green-600',
    inactive: 'bg-transparent text-gray-400 border-gray-700 hover:border-green-500/50',
  },
  blue: {
    active: 'bg-blue-600 text-white border-blue-600',
    inactive: 'bg-transparent text-gray-400 border-gray-700 hover:border-blue-500/50',
  },
};

export function FilterChip({ label, active, onClick, color = 'cyan' }: FilterChipProps) {
  const c = colorMap[color];
  return (
    <button
      onClick={onClick}
      className={`
        px-4 py-1.5 rounded-full border text-sm font-medium
        transition-all duration-150 whitespace-nowrap
        ${active ? c.active : c.inactive}
      `}
    >
      {label}
    </button>
  );
}
