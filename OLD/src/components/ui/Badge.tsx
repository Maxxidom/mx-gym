import { cn } from '../../utils/cn';

type Color = 'blue' | 'green' | 'red' | 'orange' | 'slate';

interface BadgeProps {
  children: React.ReactNode;
  color?: Color;
  className?: string;
}

const colors: Record<Color, string> = {
  blue: 'bg-blue-100 text-blue-700',
  green: 'bg-emerald-100 text-emerald-700',
  red: 'bg-red-100 text-red-700',
  orange: 'bg-orange-100 text-orange-700',
  slate: 'bg-slate-100 text-slate-600',
};

export function Badge({ children, color = 'slate', className }: BadgeProps) {
  return (
    <span className={cn(
      'inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium',
      colors[color],
      className
    )}>
      {children}
    </span>
  );
}
