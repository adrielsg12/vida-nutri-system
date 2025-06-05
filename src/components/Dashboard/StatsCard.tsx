
import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: 'emerald' | 'blue' | 'purple' | 'orange';
  onClick?: () => void;
  clickable?: boolean;
}

export const StatsCard = ({ 
  title, 
  value, 
  icon: Icon, 
  trend,
  color = 'emerald',
  onClick,
  clickable = false
}: StatsCardProps) => {
  const colorClasses = {
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200',
    orange: 'bg-orange-50 text-orange-600 border-orange-200',
  };

  const CardComponent = clickable ? 'button' : 'div';

  return (
    <Card className={`hover:shadow-md transition-all duration-200 ${
      clickable ? 'cursor-pointer hover:scale-105 hover:bg-gray-50' : ''
    }`}>
      <CardContent className="p-6">
        <CardComponent
          className={`w-full text-left ${clickable ? 'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded' : ''}`}
          onClick={clickable ? onClick : undefined}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
              <p className="text-3xl font-bold text-gray-900">{value}</p>
              {trend && (
                <p className={`text-sm mt-1 ${
                  trend.isPositive ? 'text-emerald-600' : 'text-red-600'
                }`}>
                  {trend.isPositive ? '+' : ''}{trend.value}% vs mês anterior
                </p>
              )}
            </div>
            <div className={`p-3 rounded-lg border ${colorClasses[color]}`}>
              <Icon className="h-6 w-6" />
            </div>
          </div>
        </CardComponent>
      </CardContent>
    </Card>
  );
};
