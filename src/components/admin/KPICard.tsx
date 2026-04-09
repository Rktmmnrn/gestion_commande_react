import { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

function TrendIndicator({ value, className = '' }: { value: number; className?: string }) {
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

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: number;
    label: string;
  };
  icon?: ReactNode;
  color?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
}

export function KPICard({ title, value, subtitle, trend, icon, color = 'primary' }: KPICardProps) {
  const colorClasses = {
    primary: 'border-primary/20 bg-primary/5',
    success: 'border-green-500/20 bg-green-500/5',
    warning: 'border-amber-500/20 bg-amber-500/5',
    danger: 'border-red-500/20 bg-red-500/5',
    info: 'border-blue-500/20 bg-blue-500/5',
  };

  return (
    <Card className={`${colorClasses[color]} transition-all hover:shadow-md`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
        )}
        {trend && (
          <div className="flex items-center mt-2">
            <TrendIndicator value={trend.value} />
            <span className="text-xs text-muted-foreground ml-1">
              {trend.label}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}