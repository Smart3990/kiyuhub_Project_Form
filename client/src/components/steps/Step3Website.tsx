import { useFormContext } from 'react-hook-form';
import { Select } from '../ui/Select';
import { Input } from '../ui/Input';
import { TextArea } from '../ui/TextArea';
import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';

export const Step3Website = () => {
  const { register, watch, formState: { errors } } = useFormContext();
  
  const websiteType = watch('websiteType');

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div>
        <div className="hidden sm:flex items-center gap-2 text-blue-700 text-xs font-bold uppercase tracking-wider mb-2">
          <Globe className="w-4 h-4" />
          <span>Step 3 • Website Specifications</span>
        </div>
        <h2 className="text-xl sm:text-3xl font-bold sm:font-extrabold text-slate-900 tracking-tight text-center sm:text-left">
          Website Details & Features
        </h2>
        <p className="text-slate-600 text-xs sm:text-sm mt-1 text-center sm:text-left max-w-lg sm:max-w-none mx-auto sm:mx-0">
          Tell us about the website platform you envision. Keep it as simple or detailed as you like!
        </p>
      </div>

      <Select
        label="What type of website do you need? *"
        options={[
          { value: 'corporate', label: 'Corporate / Business Brochure Site' },
          { value: 'blog', label: 'Blog, News or Content Portal' },
          { value: 'ecommerce', label: 'E-commerce Store & Online Shop' },
          { value: 'community', label: 'Community Forum / Portal' },
          { value: 'saas', label: 'SaaS / Web Application Platform' },
          { value: 'portfolio', label: 'Portfolio / Creative Showcase' },
          { value: 'lms', label: 'Educational / Online Learning (LMS)' },
          { value: 'other', label: 'Other Custom Concept' },
        ]}
        {...register('websiteType')}
        error={errors.websiteType?.message as string}
      />

      {websiteType === 'other' && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
          <Input
            label="Please specify your website concept"
            placeholder="e.g. Real Estate Listing & Virtual Tour Portal"
            {...register('websiteTypeOther')}
            error={errors.websiteTypeOther?.message as string}
          />
        </motion.div>
      )}

      <TextArea
        label="Project Overview & Description *"
        placeholder="Describe your website in your own words. What is its main purpose? Who is your target audience?"
        className="min-h-[140px]"
        {...register('projectDescription')}
        error={errors.projectDescription?.message as string}
      />

      <TextArea
        label="Key Features & Capabilities"
        placeholder="e.g., Contact Form, WhatsApp Chat Widget, Mobile Payment Gateway (MoMo/Card), User Accounts, Photo Gallery, Admin Dashboard..."
        {...register('features')}
      />

      <TextArea
        label="Inspiration & Websites You Admire"
        placeholder="Paste links or names of websites whose design or functionality you like..."
        {...register('admiredWebsites')}
      />
    </motion.div>
  );
};

