import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '../lib/utils';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

const STEP_LABELS = [
  "1. Foundation",
  "2. Archetype",
  "3. Specification",
  "4. Commercials",
  "5. Review & Brief"
];

export const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps }) => {
  return (
    <div className="w-full max-w-3xl mx-auto mb-10 px-2">
      <div className="flex items-center justify-between text-xs font-extrabold text-slate-600 mb-3 uppercase tracking-wider">
        <span>Step {currentStep} of {totalSteps}</span>
        <span className="text-slate-900">{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
      </div>

      <div className="relative flex justify-between items-center">
        {/* Background Track */}
        <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200 -z-10 rounded-full" />
        
        {/* Active Track */}
        <motion.div 
          className="absolute top-1/2 left-0 h-1 bg-slate-950 -z-10 rounded-full"
          initial={{ width: '0%' }}
          animate={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
          transition={{ duration: 0.3 }}
        />

        {Array.from({ length: totalSteps }).map((_, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isActive = stepNumber === currentStep;

          return (
            <div key={stepNumber} className="relative flex flex-col items-center">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all border-2 bg-white",
                  isCompleted ? "border-slate-950 bg-slate-950 text-white" :
                  isActive ? "border-slate-950 text-slate-950 ring-4 ring-slate-100 font-extrabold" :
                  "border-slate-300 text-slate-400"
                )}
              >
                {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : stepNumber}
              </div>
              <span className={cn(
                "hidden sm:block absolute -bottom-6 text-[11px] font-semibold whitespace-nowrap transition-colors",
                isActive ? "text-slate-950 font-bold" : "text-slate-400"
              )}>
                {STEP_LABELS[index]}
              </span>
            </div>
          );
        })}
      </div>

      {/* Mobile Active Step Label Badge */}
      <div className="sm:hidden text-center mt-3 text-xs font-bold text-slate-900 bg-slate-100 py-1 px-3 rounded-full w-fit mx-auto border border-slate-200 shadow-2xs">
        {STEP_LABELS[currentStep - 1]}
      </div>
    </div>
  );
};
