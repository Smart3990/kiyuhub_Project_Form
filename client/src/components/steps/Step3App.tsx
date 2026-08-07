import { useFormContext } from 'react-hook-form';
import { Select } from '../ui/Select';
import { Input } from '../ui/Input';
import { TextArea } from '../ui/TextArea';
import { motion } from 'framer-motion';
import { Smartphone } from 'lucide-react';

export const Step3App = () => {
  const { register, watch, formState: { errors } } = useFormContext();
  
  const appType = watch('appType');

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div>
        <div className="hidden sm:flex items-center gap-2 text-blue-700 text-xs font-bold uppercase tracking-wider mb-2">
          <Smartphone className="w-4 h-4" />
          <span>Step 3 • Mobile App Specifications</span>
        </div>
        <h2 className="text-xl sm:text-3xl font-bold sm:font-extrabold text-slate-900 tracking-tight text-center sm:text-left">
          Mobile App Details & Features
        </h2>
        <p className="text-slate-600 text-xs sm:text-sm mt-1 text-center sm:text-left max-w-lg sm:max-w-none mx-auto sm:mx-0">
          Describe your mobile application idea. iOS, Android, or cross-platform builds are all supported.
        </p>
      </div>

      <Select
        label="What type of mobile app are you building? *"
        options={[
          { value: 'social', label: 'Social Networking / Community App' },
          { value: 'ecommerce', label: 'E-commerce Store / Marketplace App' },
          { value: 'utility', label: 'Utility / Productivity / SaaS Tool' },
          { value: 'entertainment', label: 'Entertainment / Media / Streaming' },
          { value: 'health', label: 'Health, Fitness & Wellness' },
          { value: 'educational', label: 'Educational / E-learning App' },
          { value: 'ondemand', label: 'On-Demand Service / Booking & Delivery' },
          { value: 'business', label: 'Business / Enterprise Management' },
          { value: 'other', label: 'Other Custom Concept' },
        ]}
        {...register('appType')}
        error={errors.appType?.message as string}
      />

      {appType === 'other' && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
          <Input
            label="Please specify the type of mobile app"
            placeholder="e.g. AI Financial Tracking Assistant"
            {...register('appTypeOther')}
            error={errors.appTypeOther?.message as string}
          />
        </motion.div>
      )}

      <TextArea
        label="Project Overview & Description *"
        placeholder="Describe your mobile app in your own words. What problem does it solve? Who is going to use it?"
        className="min-h-[140px]"
        {...register('projectDescription')}
        error={errors.projectDescription?.message as string}
      />

      <TextArea
        label="Key Features & Integrations"
        placeholder="List required capabilities (e.g., User Authentication, In-App Payments/MoMo, Push Notifications, GPS Tracking, Camera Access, Admin Portal...)"
        {...register('features')}
      />

      <TextArea
        label="Apps You Admire (Inspiration)"
        placeholder="Names or app store links of apps with UI/UX or features you like..."
        {...register('admiredApps')}
      />
    </motion.div>
  );
};

