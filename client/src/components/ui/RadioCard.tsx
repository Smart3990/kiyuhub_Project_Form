import React from 'react';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface RadioCardProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ReactNode;
  description?: string;
  badge?: string;
}

export const RadioCard = React.forwardRef<HTMLInputElement, RadioCardProps>(
  ({ className, label, icon, description, badge, ...props }, ref) => {
    return (
      <label className="relative cursor-pointer block h-full select-none">
        <input
          type="radio"
          ref={ref}
          className="peer sr-only"
          {...props}
        />
        <motion.div
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.99 }}
          className={cn(
            "relative flex flex-col items-start p-3.5 sm:p-4 h-full rounded-xl border border-slate-200 bg-white transition-all duration-200 shadow-2xs group",
            "hover:border-slate-300 hover:bg-slate-50/40",
            "peer-checked:border-blue-600 peer-checked:bg-blue-50/50 peer-checked:ring-2 peer-checked:ring-blue-600/20 peer-checked:shadow-xs",
            className
          )}
        >
          {/* Selected checkmark indicator */}
          <div className="absolute top-3 right-3 w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center opacity-0 peer-checked:opacity-100 transition-opacity shadow-2xs">
            <Check className="w-2.5 h-2.5 stroke-[3]" />
          </div>

          {badge && (
            <span className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-600 text-white shadow-2xs">
              {badge}
            </span>
          )}

          {icon && (
            <div className="mb-2 text-blue-600 transition-colors">
              {icon}
            </div>
          )}
          
          <span className="text-sm sm:text-base font-bold text-slate-900 peer-checked:text-blue-950 mb-1 leading-tight">
            {label}
          </span>
          
          {description && (
            <span className="text-xs text-slate-500 peer-checked:text-slate-700 leading-snug">
              {description}
            </span>
          )}
        </motion.div>
      </label>
    );
  }
);
RadioCard.displayName = 'RadioCard';


