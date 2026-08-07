import { useFormContext } from 'react-hook-form';
import { RadioCard } from '../ui/RadioCard';
import { motion } from 'framer-motion';
import { Globe, Smartphone, Layers, ShoppingBag, Bot, CreditCard, Building2 } from 'lucide-react';

export const Step2Decision = () => {
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
          <Layers className="w-4 h-4 text-blue-700" />
          <span>Step 2 of 5 • Software Project Category</span>
        </div>
        <h2 className="text-xl sm:text-3xl font-bold sm:font-extrabold text-slate-950 tracking-tight text-center sm:text-left">
          Select Your Core Software Category
        </h2>
        <p className="text-slate-600 text-xs sm:text-sm mt-1 text-center sm:text-left max-w-lg sm:max-w-none mx-auto sm:mx-0">
          Choose the main type of project you want us to build for you.
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
        <RadioCard
          label="Website & Business Portal"
          value="website"
          icon={<Globe className="w-6 h-6 text-blue-600" />}
          description="Official company websites, customer portals, news blogs, and online brand showcases."
          {...register('projectType')}
        />
        <RadioCard
          label="Mobile Phone Application"
          value="app"
          icon={<Smartphone className="w-6 h-6 text-blue-600" />}
          description="Custom phone and tablet applications for iPhone, iPad, and Android users."
          {...register('projectType')}
        />
        <RadioCard
          label="Business & Cloud Software"
          value="saas"
          icon={<Layers className="w-6 h-6 text-blue-600" />}
          description="Online business tools, member portals, team software, and automated management platforms."
          {...register('projectType')}
        />
        <RadioCard
          label="Online Store & E-commerce"
          value="ecommerce"
          icon={<ShoppingBag className="w-6 h-6 text-blue-600" />}
          description="Online shopping stores, multi-seller marketplaces, booking platforms, and digital payment shops."
          {...register('projectType')}
        />
        <RadioCard
          label="Smart AI & Automation"
          value="ai_api"
          icon={<Bot className="w-6 h-6 text-blue-600" />}
          description="Intelligent AI assistants, automated customer bots, and smart background connections."
          {...register('projectType')}
        />
        <RadioCard
          label="Financial & Payment System"
          value="fintech"
          icon={<CreditCard className="w-6 h-6 text-blue-600" />}
          description="Digital wallets, payment gateways, mobile money solutions, and financial tools."
          {...register('projectType')}
        />
        <RadioCard
          label="School, Health & Enterprise System"
          value="management_systems"
          icon={<Building2 className="w-6 h-6 text-blue-600" />}
          description="Management systems for schools, clinics, hospitals, and organization operations."
          {...register('projectType')}
        />
      </div>
      {errors.projectType && (
        <p className="text-red-600 font-semibold mt-2 text-sm">
          {errors.projectType.message as string}
        </p>
      )}
    </motion.div>
  );
};


