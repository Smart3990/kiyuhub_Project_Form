import { useFormContext } from 'react-hook-form';
import { Input } from '../ui/Input';
import { motion } from 'framer-motion';
import { UserCheck } from 'lucide-react';

export const Step1Foundation = () => {
  const { register, formState: { errors } } = useFormContext();

  return (
    <motion.div
      initial={{ opacity: 0, x: 15 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -15 }}
      className="space-y-6"
    >
      <div>
        <div className="hidden sm:flex items-center gap-2 text-slate-900 text-xs font-bold uppercase tracking-wider mb-1">
          <UserCheck className="w-4 h-4 text-blue-700" />
          <span>Step 1 of 5 • Contact Information</span>
        </div>
        <h2 className="text-xl sm:text-3xl font-bold sm:font-extrabold text-slate-950 tracking-tight text-center sm:text-left">
          Your Contact Details
        </h2>
        <p className="text-slate-600 text-xs sm:text-sm mt-1 text-center sm:text-left max-w-lg sm:max-w-none mx-auto sm:mx-0">
          Please provide your contact information so we can reach out to discuss your project.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        <Input
          label="Your Full Name *"
          placeholder="e.g. Alex Morgan"
          {...register('fullName')}
          error={errors.fullName?.message as string}
        />
        <Input
          label="Email Address *"
          type="email"
          placeholder="e.g. alex@company.com"
          {...register('email')}
          error={errors.email?.message as string}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Phone Number *"
          type="tel"
          placeholder="e.g. +233 54 417 4341"
          {...register('phoneNumber')}
          error={errors.phoneNumber?.message as string}
        />
        <Input
          label="WhatsApp Number *"
          type="tel"
          placeholder="e.g. +233 24 126 9458"
          {...register('whatsappNumber')}
          error={errors.whatsappNumber?.message as string}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Input
          label="Business / Brand Name (Optional)"
          placeholder="e.g. Acme Ventures"
          {...register('companyName')}
        />
        <Input
          label="Your Role / Position (Optional)"
          placeholder="e.g. Founder, Manager, Owner"
          {...register('roleOrTitle')}
        />
        <Input
          label="Project Name / Working Title *"
          placeholder="e.g. Delivery App, Company Website"
          {...register('projectTitle')}
          error={errors.projectTitle?.message as string}
        />
      </div>
    </motion.div>
  );
};



