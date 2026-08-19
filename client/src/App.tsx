import { useState, useEffect } from 'react';
import { useForm, FormProvider, type SubmitHandler, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { formSchema, type FormData } from './types/schema';
import { ProgressBar } from './components/ProgressBar';
import { Button } from './components/ui/Button';
import { Step1Foundation } from './components/steps/Step1Foundation';
import { Step2Decision } from './components/steps/Step2Decision';
import { Step3SoftwareSpec } from './components/steps/Step3SoftwareSpec';
import { Step4Commercial } from './components/steps/Step4Commercial';
import { Step5Review } from './components/steps/Step5Review';
import { AdminPortal } from './components/AdminPortal';
import { getStoredSubmissions, saveStoredSubmissions, type ProjectSubmission } from './lib/submissionStorage';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Send, CheckCircle2, Download, MessageSquare, Lock, Phone, Mail } from 'lucide-react';
import { generateKiyuHubProjectBreakdownPDF } from './lib/pdfExporter';
import { getFeatureLabel } from './lib/projectFeatures';
import confetti from 'canvas-confetti';

// Google Apps Script endpoint
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbz2WrHDlvs_GBDl2N-OZtso1NflZXv6MZEL0t2AJwy_ct8nhQBzvm72jkZ3i5UwyHiF/exec";

const STORAGE_KEY_DATA = 'kiyuhub_intake_form_data';
const STORAGE_KEY_STEP = 'kiyuhub_intake_step';

const DEFAULT_FORM_VALUES: Partial<FormData> = {
  projectType: 'website',
  targetPlatforms: ['web_desktop', 'web_mobile'],
  selectedFeatures: ['user_auth', 'payments', 'admin_panel'],
  currency: 'GHS',
};

const getInitialFormData = (): Partial<FormData> => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_DATA);
    if (saved) {
      const parsed = JSON.parse(saved);
      delete parsed.logoFile;
      delete parsed.assetsFile;
      return { ...DEFAULT_FORM_VALUES, ...parsed };
    }
  } catch (e) {
    console.error('Failed to load saved form data:', e);
  }
  return DEFAULT_FORM_VALUES;
};

const getInitialStep = (): number => {
  try {
    const savedStep = localStorage.getItem(STORAGE_KEY_STEP);
    if (savedStep) {
      const num = parseInt(savedStep, 10);
      if (!isNaN(num) && num >= 1 && num <= 5) return num;
    }
  } catch (e) {
    console.error('Failed to load saved step:', e);
  }
  return 1;
};

function App() {
  const [route, setRoute] = useState(() => ({
    pathname: window.location.pathname,
    hash: window.location.hash,
    search: window.location.search,
  }));
  const [currentStep, setCurrentStep] = useState<number>(getInitialStep);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedPdfBlob, setSubmittedPdfBlob] = useState<Blob | null>(null);

  useEffect(() => {
    if (isSuccess) {
      // Trigger subtle celebratory confetti burst
      confetti({
        particleCount: 110,
        spread: 80,
        origin: { y: 0.55 },
        colors: ['#2563EB', '#DC2626', '#1E293B', '#F59E0B', '#10B981']
      });

      const timer1 = setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 60,
          origin: { x: 0, y: 0.65 },
          colors: ['#2563EB', '#3B82F6', '#EF4444']
        });
      }, 300);

      const timer2 = setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 60,
          origin: { x: 1, y: 0.65 },
          colors: ['#2563EB', '#3B82F6', '#EF4444']
        });
      }, 550);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }
  }, [isSuccess]);

  // Sync route path changes
  useEffect(() => {
    const handleLocationChange = () => {
      setRoute({
        pathname: window.location.pathname,
        hash: window.location.hash,
        search: window.location.search,
      });
    };
    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const methods = useForm<FormData>({
    resolver: zodResolver(formSchema) as unknown as Resolver<FormData>,
    mode: 'onChange',
    defaultValues: getInitialFormData()
  });

  const { trigger, handleSubmit } = methods;

  // Save current step to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_STEP, currentStep.toString());
    } catch (e) {
      console.error(e);
    }
  }, [currentStep]);

  // Save form fields to localStorage whenever watched values change
  useEffect(() => {
    // eslint-disable-next-line react-hooks/incompatible-library
    const subscription = methods.watch((value) => {
      try {
        const dataToSave = { ...value };
        delete dataToSave.logoFile;
        delete dataToSave.assetsFile;
        localStorage.setItem(STORAGE_KEY_DATA, JSON.stringify(dataToSave));
      } catch (e) {
        console.error('Failed to save form data to localStorage:', e);
      }
    });
    return () => subscription.unsubscribe();
  }, [methods]);

  const nextStep = async () => {
    let isValid = false;

    switch (currentStep) {
      case 1:
        isValid = await trigger(['fullName', 'email', 'phoneNumber', 'whatsappNumber', 'projectTitle']);
        break;
      case 2:
        isValid = await trigger(['projectType']);
        break;
      case 3:
        isValid = await trigger(['subCategory', 'subCategoryOther', 'projectDescription', 'targetPlatforms']);
        break;
      case 4:
        isValid = await trigger(['budget', 'launchDate', 'contentProvider']);
        break;
      case 5:
        isValid = await trigger(['agreedToTerms']);
        break;
      default:
        break;
    }

    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, 5));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsSubmitting(true);

    try {
      let clientLogoDataUrl: string | undefined;
      if (data.logoFile && data.logoFile.length > 0) {
        clientLogoDataUrl = await fileToBase64(data.logoFile[0]);
      }

      // Generate dynamic project breakdown PDF matching KiyuHub template
      const { doc, pdfBlob } = generateKiyuHubProjectBreakdownPDF(data, clientLogoDataUrl);
      setSubmittedPdfBlob(pdfBlob);
      
      const fileName = `${data.projectTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_project_breakdown.pdf`;
      doc.save(fileName);

      // Save submission record locally for management dashboard
      const newSubmission: ProjectSubmission = {
        id: 'sub_' + Date.now(),
        createdAt: new Date().toISOString(),
        status: 'New Brief',
        clientLogoDataUrl,
        formData: { ...data }
      };
      const existing = getStoredSubmissions();
      saveStoredSubmissions([newSubmission, ...existing]);

      const formattedFeatures = data.selectedFeatures && data.selectedFeatures.length > 0
        ? data.selectedFeatures.map(f => getFeatureLabel(f, data.projectType)).join(', ')
        : 'N/A';

      // Build email notification form data for admin
      const buildAdminEmailFormData = () => {
        const formData = new FormData();
        formData.append('_subject', `New Software Project Brief: ${data.projectTitle} (${data.fullName})`);
        formData.append('_replyto', data.email);
        formData.append('Project Title', data.projectTitle);
        formData.append('Client Name', data.fullName);
        formData.append('Email', data.email);
        formData.append('Phone', data.phoneNumber || 'N/A');
        formData.append('WhatsApp', data.whatsappNumber || 'N/A');
        formData.append('Company', data.companyName || 'N/A');
        formData.append('Role', data.roleOrTitle || 'N/A');
        formData.append('Project Type', data.projectType || 'N/A');
        formData.append('Sub Category', (data.subCategory === 'other' ? data.subCategoryOther : data.subCategory) || 'N/A');
        formData.append('Project Description', data.projectDescription || '');
        formData.append('Target Platforms', data.targetPlatforms?.join(', ') || 'N/A');
        formData.append('Selected Features', formattedFeatures);
        formData.append('Budget', `${data.budget} ${data.currency}`);
        formData.append('Launch Target', data.launchDate);
        formData.append('Content Provider', data.contentProvider);
        formData.append('Maintenance SLA', data.maintenanceNeeded || 'None');
        formData.append('Extra Notes', data.additionalInfo || 'None');
        formData.append('attachment', pdfBlob, fileName);
        return formData;
      };

      // Dispatch ONLY to Kiyuhubofficial@gmail.com via FormSubmit endpoint with attached PDF brief
      try {
        await fetch('https://formsubmit.co/ajax/978835e4d52c21eb0301d5c2796de383', {
          method: 'POST',
          body: buildAdminEmailFormData()
        });
      } catch (emailErr) {
        console.error('Error dispatching email notification to admin:', emailErr);
      }

      // Prepare payload for Google Apps Script backend endpoint
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const payload: Record<string, any> = { ...data, formattedFeatures };

      if (clientLogoDataUrl) {
        payload.logoFile = {
          name: data.logoFile![0].name,
          type: data.logoFile![0].type,
          data: clientLogoDataUrl
        };
      }

      if (data.assetsFile && data.assetsFile.length > 0) {
        payload.assetsFile = await Promise.all(
          Array.from(data.assetsFile as FileList).map(async (file: File) => ({
            name: file.name,
            type: file.type,
            data: await fileToBase64(file)
          }))
        );
      }

      payload.pdfBrief = {
        name: fileName,
        type: 'application/pdf',
        data: await fileToBase64(new File([pdfBlob], fileName, { type: "application/pdf" }))
      };

      try {
        await fetch(GOOGLE_SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } catch (gsErr) {
        console.error('Error posting to Google Apps Script:', gsErr);
      }

      // Clear local storage draft on successful submission
      localStorage.removeItem(STORAGE_KEY_DATA);
      localStorage.removeItem(STORAGE_KEY_STEP);
    } catch (error) {
      console.error('Error submitting form:', error);
    }

    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsSubmitting(false);
    setIsSuccess(true);
  };

  // Render Admin Portal if URL path is /admin or hash is #admin or query param contains admin
  const isAdminView = 
    route.pathname === '/admin' || 
    route.pathname.startsWith('/admin') || 
    route.hash === '#admin' || 
    route.hash.startsWith('#admin') || 
    route.search.includes('admin');

  if (isAdminView) {
    return <AdminPortal />;
  }

  if (isSuccess) {
    const projectTitle = methods.getValues('projectTitle');

    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 bg-tech-pattern">
        <motion.div 
          initial={{ scale: 0.88, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-2xl max-w-xl w-full text-center space-y-6 relative overflow-hidden"
        >
          {/* Top Decorative Banner */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-red-600 via-blue-600 to-slate-900" />

          {/* Success Badge Icon */}
          <motion.div 
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.15 }}
            className="w-20 h-20 bg-slate-950 text-white rounded-3xl flex items-center justify-center mx-auto shadow-lg relative group"
          >
            <CheckCircle2 className="w-10 h-10 stroke-[2.5] text-emerald-400" />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
              Project Breakdown Generated!
            </h2>
            <p className="text-slate-600 text-sm mt-2 leading-relaxed">
              Your software project brief for <strong>{projectTitle}</strong> has been converted into an official KiyuHub Project Breakdown document.
            </p>
          </motion.div>

          {/* Next Steps Card */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left text-xs space-y-2"
          >
            <p className="font-bold text-slate-950 text-sm">Next Engineering Steps:</p>
            <p className="text-slate-700 leading-relaxed">
              Our lead software architect will review your project requirements and reach out within <strong>48 hours</strong> to schedule your technical discovery call and present your initial architecture roadmap.
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="space-y-3 pt-2"
          >
            {submittedPdfBlob && (
              <Button 
                variant="outline" 
                className="w-full text-xs py-3 border-slate-300 hover:bg-slate-50"
                onClick={() => {
                  const url = URL.createObjectURL(submittedPdfBlob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `${projectTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_project_breakdown.pdf`;
                  a.click();
                }}
              >
                <Download className="w-4 h-4 mr-2 text-blue-600" /> Download Project Breakdown PDF
              </Button>
            )}
            
            <a 
              href={`https://wa.me/233535597240?text=Hi%20KiyuHub,%20I%20just%20submitted%20a%20software%20project%20brief%20for%20${encodeURIComponent(projectTitle)}`} 
              target="_blank" 
              rel="noreferrer"
              className="w-full block"
            >
              <Button variant="primary" className="w-full text-xs py-3 bg-slate-950 hover:bg-slate-800 text-white">
                <MessageSquare className="w-4 h-4 mr-2 text-emerald-400" /> Connect on WhatsApp (+233 54 417 4341)
              </Button>
            </a>
          </motion.div>

          <button 
            onClick={() => window.location.reload()} 
            className="text-xs text-slate-400 hover:text-slate-700 underline block mx-auto pt-2"
          >
            Submit Another Software Brief
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans bg-tech-pattern pb-16">
      {/* Top Contact Header Bar */}
      <div className="hidden sm:block bg-slate-950 text-slate-300 py-2.5 px-4 sm:px-6 md:px-8 border-b border-slate-800 text-xs">
        <div className="w-full flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <a 
              href="https://kiyuhub.netlify.app/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="font-extrabold text-red-600 hover:underline tracking-tight text-sm sm:text-xs"
              onDoubleClick={(e) => {
                e.preventDefault();
                window.location.hash = '#admin';
                window.dispatchEvent(new Event('hashchange'));
              }}
            >
              KiyuHub Ghana
            </a>
            <span className="text-slate-300 font-normal">— Empowering Breakthroughs</span>
          </div>

          <div className="flex items-center gap-3.5 sm:gap-4 text-slate-200 font-medium">
            <div className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-red-500 shrink-0" />
              <span>0544174341 / 0241269458</span>
            </div>
            <span className="text-slate-700 font-light">|</span>
            <a href="mailto:kiyuhubofficial@gmail.com" className="flex items-center gap-1.5 hover:text-white transition-colors">
              <Mail className="w-3.5 h-3.5 text-red-500 shrink-0" />
              <span>kiyuhubofficial@gmail.com</span>
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 pt-6 sm:pt-8 transition-all duration-300">
        {/* Main Form Header */}
        <header className="flex flex-col sm:flex-row items-center justify-between pb-6 mb-8 border-b border-slate-200 gap-4">
          <div className="text-center sm:text-left">
            <a 
              href="https://kiyuhub.netlify.app/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xl sm:text-2xl font-black text-red-600 hover:underline tracking-tight uppercase leading-none block"
              onDoubleClick={(e) => {
                e.preventDefault();
                window.location.hash = '#admin';
                window.dispatchEvent(new Event('hashchange'));
              }}
            >
              KIYUHUB GHANA
            </a>
            <p className="text-[10px] sm:text-xs font-bold text-slate-500 tracking-widest uppercase mt-1">
              Empowering Breakthroughs
            </p>
          </div>

          {/* Right side Pill Badge */}
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-slate-200 bg-white shadow-2xs text-xs font-semibold text-slate-800">
            <span className="text-red-600 font-mono font-bold">&gt;_</span>
            <span>Software Project Scope &amp; Intake Tool</span>
          </div>
        </header>

        {/* Main Form Container */}
        <FormProvider {...methods}>
          <div className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl p-4 sm:p-10 shadow-sm relative">
            <ProgressBar currentStep={currentStep} totalSteps={5} />

            <form onSubmit={handleSubmit(onSubmit)} className="mt-8">
              <AnimatePresence mode="wait">
                {currentStep === 1 && <Step1Foundation key="step1" />}
                {currentStep === 2 && <Step2Decision key="step2" />}
                {currentStep === 3 && <Step3SoftwareSpec key="step3" />}
                {currentStep === 4 && <Step4Commercial key="step4" />}
                {currentStep === 5 && <Step5Review key="step5" goToStep={setCurrentStep} />}
              </AnimatePresence>

              {/* Navigation Actions */}
              <div className="flex items-center justify-between mt-10 pt-6 border-t border-slate-200">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className={currentStep === 1 ? 'invisible' : ''}
                >
                  <ArrowLeft className="mr-2 w-4 h-4" /> Previous
                </Button>

                {currentStep < 5 ? (
                  <Button type="button" onClick={nextStep} variant="primary">
                    Next Step <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                ) : (
                  <Button type="submit" isLoading={isSubmitting} variant="primary" className="px-8 py-3.5 text-sm font-bold bg-slate-950 text-white hover:bg-slate-800">
                    Submit Brief & Export PDF <Send className="ml-2 w-4 h-4" />
                  </Button>
                )}
              </div>
            </form>
          </div>
        </FormProvider>

        {/* Footer */}
        <footer className="text-center text-xs text-slate-500 mt-8 space-y-1">
          <p>
            <button
              type="button"
              onClick={() => {
                window.location.hash = '#admin';
                window.dispatchEvent(new Event('hashchange'));
              }}
              title="Admin Access"
              className="hover:text-slate-900 cursor-pointer text-slate-400 font-bold mr-0.5"
            >
              ©
            </button>{' '}
            2023 <a href="https://kiyuhub.netlify.app/" target="_blank" rel="noopener noreferrer" className="font-bold text-red-600 hover:underline">KiyuHub Ghana</a>. All rights reserved.
            {' '}
            <button
              type="button"
              onClick={() => {
                window.location.hash = '#admin';
                window.dispatchEvent(new Event('hashchange'));
              }}
              title="Admin Login"
              className="inline-inline-block text-slate-300 hover:text-slate-600 p-0.5 transition-colors cursor-pointer opacity-30 hover:opacity-100 ml-1"
            >
              <Lock className="w-2.5 h-2.5 inline" />
            </button>
          </p>
          <p>Contact Engineering: +233 54 417 4341 / +233 24 126 9458 | kiyuhubofficial@gmail.com</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
