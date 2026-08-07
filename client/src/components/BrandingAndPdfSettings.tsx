import React, { useState, useMemo } from 'react';
import { 
  getStoredBrandingSettings, 
  saveStoredBrandingSettings, 
  type AdminBrandingSettings 
} from '../lib/adminSettings';
import { generateKiyuHubProjectBreakdownPDF } from '../lib/pdfExporter';
import type { FormData } from '../types/schema';
import { Palette, Upload, Image as ImageIcon, Eye, CheckCircle2, RotateCcw, Sparkles } from 'lucide-react';
import { PdfPreview } from './PdfPreview';

const SAMPLE_PROJECT_DATA: FormData = {
  fullName: 'Ebenezer Addo',
  email: 'ebenezer@techghana.com',
  phoneNumber: '+233 24 987 6543',
  whatsappNumber: '+233 24 987 6543',
  companyName: 'Ghana Tech Hub Ltd',
  roleOrTitle: 'CTO',
  projectTitle: 'Smart Logistics & Fleet Platform',
  projectType: 'app',
  subCategory: 'logistics',
  projectDescription: 'Real-time driver tracking, automated dispatch algorithm, and mobile payment gateway for logistics operations in West Africa.',
  targetPlatforms: ['Web Dashboard', 'iOS Mobile App', 'Android Mobile App'],
  selectedFeatures: ['User Auth & Roles', 'Real-time GPS Tracking', 'Payment Gateway Integration', 'Analytics Dashboard'],
  budget: '$5,000 - $10,000',
  currency: 'USD',
  launchDate: '2-3 Months',
  contentProvider: 'Client will provide all brand assets and wireframes',
  maintenanceNeeded: 'Quarterly SLA Maintenance',
  additionalInfo: 'Requires integration with local Mobile Money payment gateways (MTN MoMo, Telecel Cash).',
  agreedToTerms: true
};

const COLOR_PRESETS = [
  { name: 'Official Navy & Gold', primary: '#1b2a4a', accent: '#b89252' },
  { name: 'Royal Blue & Platinum', primary: '#1e3a8a', accent: '#64748b' },
  { name: 'Emerald & Bronze', primary: '#064e3b', accent: '#d97706' },
  { name: 'Crimson & Slate', primary: '#881337', accent: '#475569' },
  { name: 'Deep Onyx & Amber', primary: '#090d16', accent: '#f59e0b' },
  { name: 'Imperial Purple & Rose', primary: '#4c1d95', accent: '#e11d48' },
];

export const BrandingAndPdfSettings: React.FC = () => {
  const [settings, setSettings] = useState<AdminBrandingSettings>(() => getStoredBrandingSettings());
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [mobileSection, setMobileSection] = useState<'controls' | 'preview'>('controls');

  // Generate live PDF preview blob whenever colors or logos change
  const samplePdfBlob = useMemo(() => {
    try {
      const { pdfBlob } = generateKiyuHubProjectBreakdownPDF(
        SAMPLE_PROJECT_DATA, 
        undefined, 
        {
          primaryColorHex: settings.primaryColorHex,
          accentColorHex: settings.accentColorHex,
          agencyLogoDataUrl: settings.agencyLogoDataUrl
        }
      );
      return pdfBlob;
    } catch (err) {
      console.error('Error rendering live PDF preview:', err);
      return null;
    }
  }, [settings.primaryColorHex, settings.accentColorHex, settings.agencyLogoDataUrl]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>, targetField: 'agencyLogoDataUrl' | 'authLogoDataUrl') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('Logo image size must be under 2MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const updated = { ...settings, [targetField]: result };
      setSettings(updated);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    saveStoredBrandingSettings(settings);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleResetToDefault = () => {
    const reset = {
      primaryColorHex: '#1b2a4a',
      accentColorHex: '#b89252',
      agencyLogoDataUrl: undefined,
      authLogoDataUrl: undefined
    };
    setSettings(reset);
    saveStoredBrandingSettings(reset);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-4 sm:space-y-8">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 shrink-0" />
            <h2 className="text-base sm:text-lg font-bold text-slate-900">PDF & Admin Branding Settings</h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5 sm:mt-1">
            Customize official agency logos and color accents for exported PDF project briefs and the admin login portal.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={handleResetToDefault}
            className="flex-1 sm:flex-none px-3 sm:px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>

          <button
            onClick={handleSave}
            className="flex-1 sm:flex-none px-4 sm:px-5 py-2 text-xs font-bold text-white bg-slate-950 hover:bg-slate-800 rounded-xl shadow-2xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Save Branding</span>
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3.5 sm:p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Branding settings and PDF styling saved successfully!</span>
        </div>
      )}

      {/* Mobile-only View Switcher */}
      <div className="flex lg:hidden bg-white p-1 rounded-xl border border-slate-200 text-xs font-bold">
        <button
          type="button"
          onClick={() => setMobileSection('controls')}
          className={`flex-1 py-2 text-center rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            mobileSection === 'controls'
              ? 'bg-red-600 text-white shadow-2xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          <span>Branding Controls</span>
        </button>
        <button
          type="button"
          onClick={() => setMobileSection('preview')}
          className={`flex-1 py-2 text-center rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            mobileSection === 'preview'
              ? 'bg-red-600 text-white shadow-2xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Live PDF Preview</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Controls Column */}
        <div className={`lg:col-span-6 space-y-4 sm:space-y-6 ${mobileSection === 'preview' ? 'hidden lg:block' : 'block'}`}>
          {/* Logo Upload Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-2xs space-y-4 sm:space-y-5">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5 sm:pb-3">
              <ImageIcon className="w-4 h-4 text-slate-800" />
              <h3 className="text-xs sm:text-sm font-bold text-slate-900">Upload Agency Logos</h3>
            </div>

            {/* Main Agency Logo */}
            <div className="space-y-2">
              <label className="block text-[11px] sm:text-xs font-bold text-slate-700 uppercase tracking-wider">
                Official Agency Logo (PDF Brief Cover & Header)
              </label>
              <div className="p-3 sm:p-4 bg-slate-50 border border-dashed border-slate-300 rounded-xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
                <div className="flex items-center gap-3">
                  {settings.agencyLogoDataUrl ? (
                    <img 
                      src={settings.agencyLogoDataUrl} 
                      alt="Agency Logo" 
                      className="max-h-10 sm:max-h-12 max-w-[100px] sm:max-w-[120px] object-contain rounded-lg border border-slate-200 bg-white p-1"
                    />
                  ) : (
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-200 rounded-lg flex items-center justify-center text-slate-400 shrink-0">
                      <ImageIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                  )}
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      {settings.agencyLogoDataUrl ? 'Custom Logo Uploaded' : 'Default KiyuHub Vector Logo'}
                    </span>
                    <span className="text-[10px] sm:text-[11px] text-slate-500 block">PNG, JPG or SVG (Max 2MB)</span>
                  </div>
                </div>

                <label className="w-full sm:w-auto px-3 py-2 bg-white border border-slate-300 hover:border-slate-400 rounded-lg text-xs font-bold text-slate-700 hover:text-slate-900 shadow-2xs cursor-pointer flex items-center justify-center gap-1.5 transition-colors shrink-0">
                  <Upload className="w-3.5 h-3.5 text-red-600" />
                  <span>Upload Logo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleLogoUpload(e, 'agencyLogoDataUrl')}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Auth Page Logo */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <label className="block text-[11px] sm:text-xs font-bold text-slate-700 uppercase tracking-wider">
                Admin Auth Portal Logo
              </label>
              <div className="p-3 sm:p-4 bg-slate-50 border border-dashed border-slate-300 rounded-xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
                <div className="flex items-center gap-3">
                  {settings.authLogoDataUrl || settings.agencyLogoDataUrl ? (
                    <img 
                      src={settings.authLogoDataUrl || settings.agencyLogoDataUrl} 
                      alt="Auth Logo" 
                      className="max-h-10 sm:max-h-12 max-w-[100px] sm:max-w-[120px] object-contain rounded-lg border border-slate-200 bg-white p-1"
                    />
                  ) : (
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100/60 rounded-lg flex items-center justify-center text-red-600 font-black text-xs sm:text-sm shrink-0">
                      KH
                    </div>
                  )}
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      {settings.authLogoDataUrl ? 'Custom Auth Logo' : (settings.agencyLogoDataUrl ? 'Using Agency Logo' : 'Default Brand Symbol')}
                    </span>
                    <span className="text-[10px] sm:text-[11px] text-slate-500 block">Displayed on admin login screen</span>
                  </div>
                </div>

                <label className="w-full sm:w-auto px-3 py-2 bg-white border border-slate-300 hover:border-slate-400 rounded-lg text-xs font-bold text-slate-700 hover:text-slate-900 shadow-2xs cursor-pointer flex items-center justify-center gap-1.5 transition-colors shrink-0">
                  <Upload className="w-3.5 h-3.5 text-red-600" />
                  <span>Upload Logo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleLogoUpload(e, 'authLogoDataUrl')}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Color Theme Selector */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-2xs space-y-4 sm:space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 sm:pb-3">
              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4 text-slate-800" />
                <h3 className="text-xs sm:text-sm font-bold text-slate-900">PDF Color Theme Accents</h3>
              </div>
              <span className="text-[10px] sm:text-xs text-slate-500">Applies to headings & tables</span>
            </div>

            {/* Presets */}
            <div className="space-y-2">
              <label className="block text-[11px] sm:text-xs font-bold text-slate-700 uppercase tracking-wider">
                Preset Palette Templates
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {COLOR_PRESETS.map((p) => {
                  const isSelected = settings.primaryColorHex === p.primary && settings.accentColorHex === p.accent;
                  return (
                    <button
                      key={p.name}
                      onClick={() => setSettings({ ...settings, primaryColorHex: p.primary, accentColorHex: p.accent })}
                      className={`p-2 sm:p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected 
                          ? 'border-slate-900 ring-2 ring-slate-900/10 bg-slate-50 shadow-2xs' 
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 mb-1 sm:mb-1.5">
                        <span className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full border border-black/10 shadow-2xs" style={{ backgroundColor: p.primary }} />
                        <span className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full border border-black/10 shadow-2xs" style={{ backgroundColor: p.accent }} />
                      </div>
                      <span className="text-[10px] sm:text-[11px] font-bold text-slate-800 block truncate">{p.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Pickers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-2 border-t border-slate-100">
              <div className="space-y-1.5">
                <label className="block text-[11px] sm:text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Primary Color (Headings)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={settings.primaryColorHex}
                    onChange={(e) => setSettings({ ...settings, primaryColorHex: e.target.value })}
                    className="w-9 h-9 rounded-lg border border-slate-300 p-0.5 cursor-pointer bg-white shrink-0"
                  />
                  <input
                    type="text"
                    value={settings.primaryColorHex}
                    onChange={(e) => setSettings({ ...settings, primaryColorHex: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono text-slate-800"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] sm:text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Accent Color (Subtitles)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={settings.accentColorHex}
                    onChange={(e) => setSettings({ ...settings, accentColorHex: e.target.value })}
                    className="w-9 h-9 rounded-lg border border-slate-300 p-0.5 cursor-pointer bg-white shrink-0"
                  />
                  <input
                    type="text"
                    value={settings.accentColorHex}
                    onChange={(e) => setSettings({ ...settings, accentColorHex: e.target.value })}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono text-slate-800"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Live PDF Preview Column */}
        <div className={`lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-3.5 sm:p-6 shadow-2xs space-y-3 sm:space-y-4 ${mobileSection === 'controls' ? 'hidden lg:block' : 'block'}`}>
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 sm:pb-3">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-red-600" />
              <h3 className="text-xs sm:text-sm font-bold text-slate-900">Live PDF Brief Preview</h3>
            </div>
            <span className="text-[10px] sm:text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full border border-slate-200">
              Interactive
            </span>
          </div>

          <div className="bg-slate-100 rounded-xl border border-slate-200 h-[500px] sm:h-[650px] lg:h-[820px] overflow-hidden relative">
            <PdfPreview 
              pdfBlob={samplePdfBlob} 
              fileName="sample_kiyu_hub_brief.pdf" 
            />
          </div>
        </div>
      </div>
    </div>
  );
};
