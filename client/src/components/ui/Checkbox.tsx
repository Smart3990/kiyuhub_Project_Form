import React from 'react';
import { cn } from '../../lib/utils';
import { Check } from 'lucide-react';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, ...props }, ref) => {
    return (
      <label className={cn("flex items-start space-x-3 cursor-pointer group select-none", className)}>
        <div className="relative pt-0.5">
          <input
            type="checkbox"
            ref={ref}
            className="peer sr-only"
            {...props}
          />
          <div className={cn(
            "h-5 w-5 rounded-md border-2 border-slate-300 bg-white transition-all duration-200 shadow-2xs flex items-center justify-center",
            "peer-checked:bg-blue-600 peer-checked:border-blue-600 peer-checked:[&>svg]:opacity-100",
            "group-hover:border-slate-400"
          )}>
            <Check className="h-3.5 w-3.5 text-white opacity-0 transition-opacity stroke-[3]" />
          </div>
        </div>
        <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors leading-relaxed">
          {label}
        </span>
      </label>
    );
  }
);
Checkbox.displayName = 'Checkbox';

