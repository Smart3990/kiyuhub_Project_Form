import React from 'react';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="block text-sm font-semibold text-slate-800">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            className={cn(
              'w-full appearance-none rounded-xl bg-white border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 shadow-2xs transition-all duration-200 cursor-pointer pr-10',
              'focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/15',
              'hover:border-slate-400',
              error && 'border-red-600 focus:border-red-600 focus:ring-red-100',
              className
            )}
            {...props}
            defaultValue=""
          >
            <option value="" disabled className="text-slate-400">Select an option...</option>
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} className="text-slate-900 py-1">
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
        </div>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs font-medium text-red-600 flex items-center gap-1 mt-1"
          >
            <span>•</span> {error}
          </motion.p>
        )}
      </div>
    );
  }
);
Select.displayName = 'Select';

