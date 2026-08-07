import React from 'react';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="block text-sm font-semibold text-slate-800">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            className={cn(
              'w-full rounded-xl bg-white border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 shadow-2xs transition-all duration-200',
              'focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/15',
              'hover:border-slate-400',
              error && 'border-red-600 focus:border-red-600 focus:ring-red-100',
              className
            )}
            {...props}
          />
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
Input.displayName = 'Input';

