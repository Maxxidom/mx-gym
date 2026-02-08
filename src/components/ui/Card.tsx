import { ReactNode } from 'react';
import { cn } from '../../utils/cn';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  active?: boolean;
}

export function Card({ children, className, onClick, active }: CardProps) {
  const isClickable = !!onClick;
  
  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-white rounded-2xl border transition-all',
        isClickable && 'cursor-pointer active:scale-[0.98]',
        active 
          ? 'border-blue-300 shadow-sm shadow-blue-100' 
          : 'border-slate-100 shadow-sm',
        className
      )}
    >
      {children}
    </div>
  );
}
