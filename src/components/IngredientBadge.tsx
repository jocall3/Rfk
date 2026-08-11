import React, { useState, useRef, useEffect } from 'react';
import { AlertTriangle, AlertCircle, CheckCircle2, Info } from 'lucide-react';

export type ToxicityLevel = 'High' | 'Medium' | 'Low';

export interface IngredientBadgeProps {
  name: string;
  toxicity: ToxicityLevel;
  regulatoryStatus: string;
  description?: string;
  className?: string;
}

const toxicityConfig = {
  High: {
    bg: 'bg-red-50 hover:bg-red-100 dark:bg-red-950/30 dark:hover:bg-red-950/50',
    text: 'text-red-700 dark:text-red-400',
    border: 'border-red-200 dark:border-red-900/50',
    icon: AlertTriangle,
    dot: 'bg-red-500',
    label: 'High Hazard',
  },
  Medium: {
    bg: 'bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/30 dark:hover:bg-amber-950/50',
    text: 'text-amber-700 dark:text-amber-400',
    border: 'border-amber-200 dark:border-amber-900/50',
    icon: AlertCircle,
    dot: 'bg-amber-500',
    label: 'Moderate Hazard',
  },
  Low: {
    bg: 'bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/30 dark:hover:bg-emerald-950/50',
    text: 'text-emerald-700 dark:text-emerald-400',
    border: 'border-emerald-200 dark:border-emerald-900/50',
    icon: CheckCircle2,
    dot: 'bg-emerald-500',
    label: 'Low Hazard',
  },
};

export const IngredientBadge: React.FC<IngredientBadgeProps> = ({
  name,
  toxicity,
  regulatoryStatus,
  description,
  className = '',
}) => {
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const [tooltipCoords, setTooltipCoords] = useState({ top: 0, left: 0 });
  const badgeRef = useRef<HTMLDivElement>(null);
  const config = toxicityConfig[toxicity];
  const Icon = config.icon;

  const updateTooltipPosition = () => {
    if (badgeRef.current) {
      const rect = badgeRef.current.getBoundingClientRect();
      setTooltipCoords({
        top: rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX + rect.width / 2,
      });
    }
  };

  useEffect(() => {
    if (isTooltipVisible) {
      updateTooltipPosition();
      window.addEventListener('scroll', updateTooltipPosition);
      window.addEventListener('resize', updateTooltipPosition);
    }
    return () => {
      window.removeEventListener('scroll', updateTooltipPosition);
      window.removeEventListener('resize', updateTooltipPosition);
    };
  }, [isTooltipVisible]);

  return (
    <div className="inline-block">
      <div
        ref={badgeRef}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all duration-200 cursor-help select-none ${config.bg} ${config.text} ${config.border} ${className}`}
        onMouseEnter={() => setIsTooltipVisible(true)}
        onMouseLeave={() => setIsTooltipVisible(false)}
        onFocus={() => setIsTooltipVisible(true)}
        onBlur={() => setIsTooltipVisible(false)}
        tabIndex={0}
        aria-haspopup="true"
        aria-label={`${name}: ${config.label} toxicity level. Regulatory status: ${regulatoryStatus}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} aria-hidden="true" />
        <span className="font-semibold">{name}</span>
        <Icon className="w-3.5 h-3.5 opacity-80" />
      </div>

      {isTooltipVisible && (
        <div
          className="fixed z-50 w-72 p-4 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-lg shadow-xl border border-slate-200 dark:border-slate-800 text-sm transition-opacity duration-200 -translate-x-1/2"
          style={{
            top: `${tooltipCoords.top}px`,
            left: `${tooltipCoords.left}px`,
          }}
          role="tooltip"
        >
          <div className="flex items-start gap-2.5">
            <div className={`p-1 rounded-md ${config.bg} ${config.text} mt-0.5`}>
              <Icon className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-slate-900 dark:text-white truncate">
                {name}
              </h4>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className={`inline-block w-2 h-2 rounded-full ${config.dot}`} />
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  {config.label}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80">
            <div className="flex items-start gap-1.5">
              <Info className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Regulatory Status
                </p>
                <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {regulatoryStatus}
                </p>
              </div>
            </div>
          </div>

          {description && (
            <div className="mt-2.5 pt-2.5 border-t border-slate-100 dark:border-slate-800/80">
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Details
              </p>
              <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {description}
              </p>
            </div>
          )}
          
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-white dark:bg-slate-900 border-t border-l border-slate-200 dark:border-slate-800 rotate-45" />
        </div>
      )}
    </div>
  );
};