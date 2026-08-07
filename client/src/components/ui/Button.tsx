import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '../../lib/utils';

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'grant';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, ...props }, ref) => {
    const variants = {
      primary: 'bg-slate-950 text-white hover:bg-slate-800 border-transparent shadow-sm hover:shadow',
      secondary: 'bg-blue-700 text-white hover:bg-blue-800 border-transparent shadow-sm',
      grant: 'bg-red-600 text-white hover:bg-red-700 border-transparent shadow-sm hover:shadow-red-200',
      outline: 'bg-white border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white',
      ghost: 'bg-transparent text-slate-700 hover:text-slate-900 hover:bg-slate-100 border-transparent',
    };

    const sizes = {
      sm: 'px-3.5 py-2 text-sm font-medium rounded-lg',
      md: 'px-6 py-3 text-base font-semibold rounded-xl',
      lg: 'px-8 py-4 text-lg font-bold rounded-xl',
    };

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          'inline-flex items-center justify-center font-semibold transition-all duration-200 border cursor-pointer select-none',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100',
          variants[variant],
          sizes[size],
          className
        )}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading ? (
          <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : null}
        {children}
      </motion.button>
    );
  }
);
Button.displayName = 'Button';

