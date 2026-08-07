import { useFormContext } from 'react-hook-form';
import { Select } from '../ui/Select';
import { TextArea } from '../ui/TextArea';
import { motion } from 'framer-motion';
import { Upload, Image as ImageIcon, FileText, DollarSign } from 'lucide-react';

export const Step4Commercial = () => {
  const { register, watch, formState: { errors } } = useFormContext();
  
  const assetsFile = watch('assetsFile');
  const logoFile = watch('logoFile');

  return (
    <motion.div
      initial={{ opacity: 0, x: 15 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -15 }}
      className="space-y-6"
    >
      <div>
        <div className="hidden sm:flex items-center gap-2 text-slate-900 text-xs font-bold uppercase tracking-wider mb-1">
          <DollarSign className="w-4 h-4 text-blue-700" />
          <span>Step 4 of 5 • Commercial Budget, Timeline & Assets</span>
        </div>
        <h2 className="text-xl sm:text-3xl font-bold sm:font-extrabold text-slate-950 tracking-tight text-center sm:text-left">
          Commercial Scope & Deliverables
        </h2>
        <p className="text-slate-600 text-xs sm:text-sm mt-1 text-center sm:text-left max-w-lg sm:max-w-none mx-auto sm:mx-0">
          Define budget parameters, target delivery dates, ongoing maintenance preferences, and brand assets.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Select
          label="Estimated Budget Range *"
          options={[
            { value: '3000-5000_ghs', label: 'GHS 3,000 - GHS 5,000 (~$250 - $400 USD)' },
            { value: '5000-10000_ghs', label: 'GHS 5,000 - GHS 10,000 (~$400 - $800 USD)' },
            { value: '10000-20000_ghs', label: 'GHS 10,000 - GHS 20,000 (~$800 - $1,600 USD)' },
            { value: '20000+_ghs', label: 'GHS 20,000+ (~$1,600+ USD) Enterprise Tier' },
          ]}
          {...register('budget')}
          error={errors.budget?.message as string}
        />

        <Select
          label="Target Delivery Timeline *"
          options={[
            { value: 'fasttrack_2w', label: 'Fast-Track MVP (2 - 3 Weeks)' },
            { value: 'standard_1m', label: 'Standard Build (1 Month)' },
            { value: 'medium_2m', label: 'Comprehensive Build (2 - 3 Months)' },
            { value: 'flexible', label: 'Flexible / Phased Discovery' },
          ]}
          {...register('launchDate')}
          error={errors.launchDate?.message as string}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Select
          label="Design & Content *"
          options={[
            { value: 'client_ready', label: 'I have my logo, brand colors, or page designs ready' },
            { value: 'kiyu_design', label: 'I need KiyuHub to handle design and branding for me' },
            { value: 'collaborative', label: 'I have some sketches / ideas, but need help refining' },
          ]}
          {...register('contentProvider')}
          error={errors.contentProvider?.message as string}
        />

        <Select
          label="Post-Launch Support & Maintenance"
          options={[
            { value: 'standard_warranty', label: '30-Day Support & Bug Fixes (Included Free)' },
            { value: 'monthly_devops', label: 'Monthly Maintenance & Server Care' },
            { value: 'ongoing_features', label: 'Ongoing Updates & New Features' },
            { value: 'handover_only', label: 'Handover Source Code (Self-Managed)' },
          ]}
          {...register('maintenanceNeeded')}
        />
      </div>

      <div className="space-y-4 p-5 border border-slate-200 rounded-2xl bg-slate-50/80 shadow-2xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
            <Upload className="w-4 h-4 text-blue-700" />
            <span>Upload Company Logo & Optional Design Files</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
              Brand Logo (PNG, JPG, SVG)
            </label>
            <div className="border border-dashed border-slate-300 rounded-xl p-3 bg-white text-center hover:border-slate-400 transition-colors">
              <input
                type="file"
                accept="image/*"
                className="block w-full text-xs text-slate-500
                  file:mr-3 file:py-1.5 file:px-3
                  file:rounded-lg file:border-0
                  file:text-xs file:font-semibold
                  file:bg-slate-950 file:text-white
                  hover:file:bg-slate-800
                  cursor-pointer"
                {...register('logoFile')}
              />
            </div>
            {logoFile && logoFile.length > 0 && (
              <div className="mt-2 flex items-center gap-3 p-2 bg-white rounded-xl border border-slate-200">
                <div className="w-10 h-10 relative rounded-lg overflow-hidden border border-slate-200 shrink-0 bg-slate-50 flex items-center justify-center">
                  <img 
                    src={URL.createObjectURL(logoFile[0])} 
                    alt="Logo Preview" 
                    className="max-w-full max-h-full object-contain p-1"
                    onLoad={(e) => URL.revokeObjectURL((e.target as HTMLImageElement).src)}
                  />
                </div>
                <div className="text-xs truncate">
                  <p className="font-semibold text-slate-900 truncate">{logoFile[0].name}</p>
                  <p className="text-blue-600 font-medium text-[11px]">Will be placed on your PDF brief ✨</p>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
              Design Files or Documents (PDF, ZIP, Word, Images)
            </label>
            <div className="border border-dashed border-slate-300 rounded-xl p-3 bg-white text-center hover:border-slate-400 transition-colors">
              <input
                type="file"
                multiple
                className="block w-full text-xs text-slate-500
                  file:mr-3 file:py-1.5 file:px-3
                  file:rounded-lg file:border-0
                  file:text-xs file:font-semibold
                  file:bg-blue-700 file:text-white
                  hover:file:bg-blue-800
                  cursor-pointer"
                {...register('assetsFile')}
              />
            </div>
          </div>
        </div>

        {assetsFile && assetsFile.length > 0 && (
          <div className="space-y-2 pt-1">
            <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
              Attached Files ({assetsFile.length})
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
              {Array.from(assetsFile as FileList).map((file: File, index: number) => (
                <div key={index} className="p-2 rounded-xl border border-slate-200 bg-white text-slate-900 flex flex-col justify-between text-xs gap-1 shadow-xs">
                  <div className="flex items-center gap-1.5 font-semibold truncate text-slate-800">
                    {file.type.startsWith('image/') ? (
                      <ImageIcon className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    ) : (
                      <FileText className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                    )}
                    <span className="truncate">{file.name}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">{(file.size / 1024).toFixed(1)} KB</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <TextArea
        label="Any Extra Notes or Questions for Us?"
        placeholder="Share any extra details, questions, or specific needs you have for your project..."
        {...register('additionalInfo')}
      />
    </motion.div>
  );
};


