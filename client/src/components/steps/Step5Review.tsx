import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Checkbox } from '../ui/Checkbox';
import { motion } from 'framer-motion';
import { Edit2, ShieldCheck, Layers, Code2, DollarSign, FileCheck } from 'lucide-react';
import { getFeatureLabel } from '../../lib/projectFeatures';

interface Step5ReviewProps {
  goToStep: (step: number) => void;
}

interface SectionProps {
  title: string;
  step: number;
  icon: React.ReactNode;
  children: React.ReactNode;
  onEdit: (step: number) => void;
}

const Section = ({ title, step, icon, children, onEdit }: SectionProps) => (
  <div className="bg-white p-5 rounded-2xl border border-slate-200 relative group hover:border-slate-400 transition-all shadow-xs">
    <div className="flex justify-between items-center mb-3 border-b border-slate-100 pb-2">
      <h3 className="text-sm font-bold text-slate-950 flex items-center gap-2">
        <span className="text-blue-700">{icon}</span>
        {title}
      </h3>
      <button 
        onClick={() => onEdit(step)}
        className="text-slate-400 hover:text-slate-950 transition-colors p-1 rounded-lg hover:bg-slate-100 flex items-center gap-1 text-xs font-semibold"
        type="button"
      >
        <Edit2 className="w-3.5 h-3.5" />
        <span>Edit</span>
      </button>
    </div>
    <div className="space-y-1.5 text-xs sm:text-sm text-slate-700">
      {children}
    </div>
  </div>
);

export const Step5Review: React.FC<Step5ReviewProps> = ({ goToStep }) => {
  const { register, getValues, formState: { errors } } = useFormContext();
  const values = getValues();

  const getArchetypeLabel = (type: string) => {
    switch(type) {
      case 'app': return '📱 Mobile Phone Application';
      case 'saas': return '☁️ Business & Cloud Software';
      case 'ecommerce': return '🛒 Online Store & E-commerce';
      case 'ai_api': return '🤖 Smart AI & Automation';
      case 'fintech': return '💳 Financial & Payment System';
      case 'management_systems': return '🏢 School, Health & Enterprise System';
      default: return '🌐 Website & Business Portal';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 15 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -15 }}
      className="space-y-6"
    >
      <div>
        <div className="hidden sm:flex items-center gap-2 text-slate-900 text-xs font-bold uppercase tracking-wider mb-1">
          <FileCheck className="w-4 h-4 text-blue-700" />
          <span>Step 5 of 5 • Final Review & Submission</span>
        </div>
        <h2 className="text-xl sm:text-3xl font-bold sm:font-extrabold text-slate-950 tracking-tight text-center sm:text-left">
          Review & Submit Your Project Brief
        </h2>
        <p className="text-slate-600 text-xs sm:text-sm mt-1 text-center sm:text-left max-w-lg sm:max-w-none mx-auto sm:mx-0">
          Review all project information below before generating your official project breakdown PDF and submitting to KiyuHub.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Section title="1. Contact Information" step={1} icon={<ShieldCheck className="w-4 h-4" />} onEdit={goToStep}>
          <p><strong className="text-slate-950">Name:</strong> {values.fullName}</p>
          <p><strong className="text-slate-950">Email:</strong> {values.email}</p>
          <p><strong className="text-slate-950">Phone / WhatsApp:</strong> {values.phoneNumber} / {values.whatsappNumber}</p>
          {values.companyName && <p><strong className="text-slate-950">Company:</strong> {values.companyName}</p>}
          {values.roleOrTitle && <p><strong className="text-slate-950">Role:</strong> {values.roleOrTitle}</p>}
          <p><strong className="text-slate-950">Project Name:</strong> {values.projectTitle}</p>
        </Section>

        <Section title="2. Project Category" step={2} icon={<Layers className="w-4 h-4" />} onEdit={goToStep}>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <p className="text-sm font-bold text-slate-950">
              {getArchetypeLabel(values.projectType)}
            </p>
          </div>
        </Section>

        <Section title="3. Project Features & Requirements" step={3} icon={<Code2 className="w-4 h-4" />} onEdit={goToStep}>
          <p><strong className="text-slate-950">Category Detail:</strong> {values.subCategory === 'other' ? values.subCategoryOther : values.subCategory}</p>
          <p className="mt-1"><strong className="text-slate-950 block">Project Description:</strong> <span className="text-slate-600 italic">{values.projectDescription}</span></p>
          {values.targetPlatforms && values.targetPlatforms.length > 0 && (
            <p className="mt-1"><strong className="text-slate-950">Target Platforms:</strong> {values.targetPlatforms.join(', ')}</p>
          )}
          {values.selectedFeatures && values.selectedFeatures.length > 0 && (
            <p className="mt-1">
              <strong className="text-slate-950">Selected Features ({values.selectedFeatures.length}):</strong>{' '}
              {values.selectedFeatures.map((f: string) => getFeatureLabel(f, values.projectType)).join(', ')}
            </p>
          )}
        </Section>

        <Section title="4. Budget & Timeline" step={4} icon={<DollarSign className="w-4 h-4" />} onEdit={goToStep}>
          <p><strong className="text-slate-950">Budget Bracket:</strong> {values.budget}</p>
          <p><strong className="text-slate-950">Target Timeline:</strong> {values.launchDate}</p>
          <p><strong className="text-slate-950">Design & Assets:</strong> {values.contentProvider}</p>
          {values.maintenanceNeeded && <p><strong className="text-slate-950">Maintenance & Support:</strong> {values.maintenanceNeeded}</p>}
          {values.logoFile && values.logoFile.length > 0 && (
            <p className="mt-1"><strong className="text-slate-950">Logo File:</strong> {values.logoFile[0].name}</p>
          )}
          {values.assetsFile && values.assetsFile.length > 0 && (
            <p className="mt-1"><strong className="text-slate-950">Supporting Documents:</strong> {Array.from(values.assetsFile as FileList).length} file(s)</p>
          )}
        </Section>
      </div>

      <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl text-xs text-slate-700 space-y-2">
        <h4 className="font-bold text-slate-950 text-sm flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-blue-700" />
          <span>KiyuHub Engineering & Delivery Commitment</span>
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-slate-600">
          <p>• 100% Intellectual Property & Source Code Ownership</p>
          <p>• Clean Architecture, Type-safe & Scalable Codebase</p>
          <p>• Milestone-based Payments & Clear Progress Demos</p>
          <p>• 30-Day Post-Launch Bug Warranty Included</p>
        </div>
      </div>

      <div className="pt-2 border-t border-slate-200">
        <Checkbox
          label="I confirm that all provided details are accurate and agree to KiyuHub's Privacy Policy & Service Terms."
          {...register('agreedToTerms')}
        />
        {errors.agreedToTerms && (
          <p className="text-xs text-red-600 font-semibold mt-1.5">{errors.agreedToTerms.message as string}</p>
        )}
      </div>
    </motion.div>
  );
};


