import { useFormContext } from 'react-hook-form';
import { Select } from '../ui/Select';
import { Input } from '../ui/Input';
import { TextArea } from '../ui/TextArea';
import { motion } from 'framer-motion';
import { CheckSquare, Layers } from 'lucide-react';
import { getFeaturesForProjectType } from '../../lib/projectFeatures';

const PLATFORM_OPTIONS = [
  { id: 'web_desktop', label: 'Computers & Laptops (Web)' },
  { id: 'web_mobile', label: 'Mobile Phone Web Browsers' },
  { id: 'ios_app', label: 'iPhone & iPad App' },
  { id: 'android_app', label: 'Android Phone & Tablet App' },
  { id: 'desktop_native', label: 'Windows / Mac Desktop App' },
  { id: 'api_microservice', label: 'Background Automated Service' },
];

export const Step3SoftwareSpec = () => {
  const { register, watch, setValue, formState: { errors } } = useFormContext();
  
  const projectType = watch('projectType') || 'website';
  const subCategory = watch('subCategory');
  const selectedFeatures: string[] = watch('selectedFeatures') || [];
  const targetPlatforms: string[] = watch('targetPlatforms') || ['web_desktop', 'web_mobile'];

  const dynamicFeatures = getFeaturesForProjectType(projectType);

  const toggleFeature = (id: string) => {
    if (selectedFeatures.includes(id)) {
      setValue('selectedFeatures', selectedFeatures.filter(f => f !== id), { shouldValidate: true });
    } else {
      setValue('selectedFeatures', [...selectedFeatures, id], { shouldValidate: true });
    }
  };

  const togglePlatform = (id: string) => {
    if (targetPlatforms.includes(id)) {
      if (targetPlatforms.length > 1) {
        setValue('targetPlatforms', targetPlatforms.filter(p => p !== id), { shouldValidate: true });
      }
    } else {
      setValue('targetPlatforms', [...targetPlatforms, id], { shouldValidate: true });
    }
  };

  const getSubCategoryOptions = () => {
    switch (projectType) {
      case 'app':
        return [
          { value: 'consumer_app', label: 'General Customer Mobile App' },
          { value: 'ondemand_delivery', label: 'Booking, Taxi or Delivery App' },
          { value: 'social_community', label: 'Social & Community Network' },
          { value: 'health_fitness', label: 'Health, Wellness & Fitness App' },
          { value: 'fintech_wallet', label: 'Mobile Money & Savings App' },
          { value: 'field_enterprise', label: 'Staff & Team Operational App' },
          { value: 'other', label: 'Other Custom Mobile App' },
        ];
      case 'saas':
        return [
          { value: 'b2b_saas', label: 'Business Management & Office Tool' },
          { value: 'crm_erp', label: 'Customer Records & Inventory System' },
          { value: 'analytics_bi', label: 'Business Dashboard & Reports' },
          { value: 'collaboration_tool', label: 'Team Collaboration & Productivity' },
          { value: 'lms_education', label: 'Online School & Course System' },
          { value: 'other', label: 'Other Custom Business Software' },
        ];
      case 'ecommerce':
        return [
          { value: 'b2c_store', label: 'Online Brand Shopping Store' },
          { value: 'multivendor', label: 'Multi-Seller Marketplace' },
          { value: 'booking_rental', label: 'Ticket Booking & Rentals' },
          { value: 'digital_downloads', label: 'Digital Content & Course Store' },
          { value: 'other', label: 'Other Custom Online Shop' },
        ];
      case 'ai_api':
        return [
          { value: 'llm_assistant', label: 'Smart Customer AI Assistant' },
          { value: 'data_pipeline', label: 'Automated Data & File Processor' },
          { value: 'microservice_api', label: 'System Connector / Integration Service' },
          { value: 'automation_agent', label: 'Automated Business Assistant' },
          { value: 'other', label: 'Other Smart Automation Project' },
        ];
      case 'fintech':
        return [
          { value: 'digital_wallet', label: 'Mobile Money & Digital Wallet System' },
          { value: 'payment_gateway', label: 'Payment Acceptance & Online Checkout' },
          { value: 'loans_credit', label: 'Microfinance & Loan System' },
          { value: 'savings_investment', label: 'Savings & Investment App' },
          { value: 'other', label: 'Other Financial Software' },
        ];
      case 'management_systems':
        return [
          { value: 'school_management', label: 'School & Student Records System' },
          { value: 'hospital_clinic', label: 'Hospital & Clinic Patient System' },
          { value: 'hotel_property', label: 'Hotel & Property Management System' },
          { value: 'hr_payroll', label: 'HR, Staff & Payroll System' },
          { value: 'other', label: 'Other Management System' },
        ];
      default:
        return [
          { value: 'corporate_brand', label: 'Company & Brand Website' },
          { value: 'web_portal', label: 'Customer Portal & Login Hub' },
          { value: 'news_media', label: 'News, Blog & Media Website' },
          { value: 'directory_listings', label: 'Business Directory & Listings' },
          { value: 'web_application', label: 'Interactive Web Application' },
          { value: 'other', label: 'Other Custom Website' },
        ];
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
          <Layers className="w-4 h-4 text-blue-700" />
          <span>Step 3 of 5 • Project Features & Details</span>
        </div>
        <h2 className="text-xl sm:text-3xl font-bold sm:font-extrabold text-slate-950 tracking-tight text-center sm:text-left">
          Define Your Project Features
        </h2>
        <p className="text-slate-600 text-xs sm:text-sm mt-1 text-center sm:text-left max-w-lg sm:max-w-none mx-auto sm:mx-0">
          Tell us what features you need and how you want your app or website to work.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Select
          label="What specific type of project is this? *"
          options={getSubCategoryOptions()}
          {...register('subCategory')}
          error={errors.subCategory?.message as string}
        />

        {subCategory === 'other' && (
          <Input
            label="Describe your project type *"
            placeholder="e.g. Real Estate Booking & Virtual Tour Portal"
            {...register('subCategoryOther')}
            error={errors.subCategoryOther?.message as string}
          />
        )}
      </div>

      <TextArea
        label="Project Description & What You Want to Achieve *"
        placeholder="Explain in simple words what your software will do, who will use it, and what problem it solves for your business or customers..."
        className="min-h-[120px]"
        {...register('projectDescription')}
        error={errors.projectDescription?.message as string}
      />

      <div className="space-y-2">
        <label className="block text-sm font-bold text-slate-900">
          Where should users access your app? *
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {PLATFORM_OPTIONS.map((plat) => {
            const isSelected = targetPlatforms.includes(plat.id);
            return (
              <button
                key={plat.id}
                type="button"
                onClick={() => togglePlatform(plat.id)}
                className={`p-2.5 sm:p-3 rounded-xl text-left border transition-all flex items-center justify-between text-xs font-semibold ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/70 text-blue-950 ring-1 ring-blue-600/20 shadow-2xs'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                }`}
              >
                <span>{plat.label}</span>
                {isSelected && <CheckSquare className="w-4 h-4 text-blue-600 shrink-0 ml-1" />}
              </button>
            );
          })}
        </div>
        {errors.targetPlatforms && (
          <p className="text-xs text-red-600 font-semibold">{errors.targetPlatforms.message as string}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-bold text-slate-900">
          Which features do you need? (Select all that apply)
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
          {dynamicFeatures.map((feat) => {
            const isChecked = selectedFeatures.includes(feat.id);
            return (
              <button
                key={feat.id}
                type="button"
                onClick={() => toggleFeature(feat.id)}
                title={feat.description}
                className={`p-2.5 rounded-xl text-left border text-xs font-medium transition-all flex items-start gap-2.5 ${
                  isChecked
                    ? 'border-blue-600 bg-blue-50/60 text-blue-950 font-semibold ring-1 ring-blue-600/20 shadow-2xs'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                }`}
              >
                <div className={`w-4 h-4 rounded flex items-center justify-center shrink-0 transition-colors mt-0.5 ${
                  isChecked ? 'bg-blue-600 text-white' : 'border border-slate-300 bg-white'
                }`}>
                  {isChecked && <CheckSquare className="w-3.5 h-3.5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="leading-snug block">{feat.label}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TextArea
          label="Any extra features or ideas you want to add? (Optional)"
          placeholder="Describe any special feature, rule, or custom idea you want us to build..."
          className="min-h-[90px]"
          {...register('customFeatures')}
        />

        <TextArea
          label="Apps or websites you like as inspiration (Optional)"
          placeholder="Names or website links of existing apps or sites you like..."
          className="min-h-[90px]"
          {...register('inspirationLinks')}
        />
      </div>
    </motion.div>
  );
};

