import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface TrendIndicatorProps {
  value: number;
  className?: string;
}

export function TrendIndicator({ value, className = '' }: TrendIndicatorProps) {
  if (value > 0) {
    return (
      <div className={`flex items-center text-green-600 ${className}`}>
        <TrendingUp className="w-4 h-4" />
        <span className="text-sm font-medium ml-1">+{value}%</span>
      </div>
    );
  } else if (value < 0) {
    return (
      <div className={`flex items-center text-red-600 ${className}`}>
        <TrendingDown className="w-4 h-4" />
        <span className="text-sm font-medium ml-1">{value}%</span>
      </div>
    );
  } else {
    return (
      <div className={`flex items-center text-muted-foreground ${className}`}>
        <Minus className="w-4 h-4" />
        <span className="text-sm font-medium ml-1">0%</span>
      </div>
    );
  }
}