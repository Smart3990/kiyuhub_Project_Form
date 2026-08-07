import React, { useState } from 'react';
import { Dashboard } from './Dashboard';
import { AdminManagement } from './AdminManagement';
import { BrandingAndPdfSettings } from './BrandingAndPdfSettings';
import { 
  getStoredAdmins, 
  getStoredBrandingSettings 
} from '../lib/adminSettings';
import { 
  Mail, 
  Key, 
  LogOut, 
  ArrowLeft, 
  ShieldCheck, 
  Terminal, 
  FileText, 
  Palette, 
  Users, 
  Image as ImageIcon 
} from 'lucide-react';

const AUTH_STORAGE_KEY = 'kiyuhub_admin_auth';
const LOGGED_ADMIN_EMAIL_KEY = 'kiyuhub_logged_admin_email';

export const AdminPortal: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem(AUTH_STORAGE_KEY) === 'true';
  });

  const [currentAdminEmail, setCurrentAdminEmail] = useState<string>(() => {
    return sessionStorage.getItem(LOGGED_ADMIN_EMAIL_KEY) || 'admin@kiyuhub.com';
  });

  const [activeTab, setActiveTab] = useState<'briefs' | 'branding' | 'admins'>('briefs');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const brandingSettings = getStoredBrandingSettings();
  const logoUrl = brandingSettings.authLogoDataUrl || brandingSettings.agencyLogoDataUrl;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    setTimeout(() => {
      const storedAdmins = getStoredAdmins();
      const inputEmail = email.trim().toLowerCase();
      const inputPassword = password;

      const matchedAdmin = storedAdmins.find(
        (a) => a.email.trim().toLowerCase() === inputEmail && 
               (a.passwordHash === inputPassword || a.passwordHash === inputPassword.trim())
      );

      if (matchedAdmin) {
        sessionStorage.setItem(AUTH_STORAGE_KEY, 'true');
        sessionStorage.setItem(LOGGED_ADMIN_EMAIL_KEY, matchedAdmin.email);
        setCurrentAdminEmail(matchedAdmin.email);
        setIsAuthenticated(true);
        setErrorMsg('');
      } else {
        setErrorMsg('Invalid admin credentials. Please check your email and password.');
      }
      setIsLoading(false);
    }, 350);
  };

  const handleLogout = () => {
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
    sessionStorage.removeItem(LOGGED_ADMIN_EMAIL_KEY);
    setIsAuthenticated(false);
    setEmail('');
    setPassword('');
  };

  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 font-sans bg-tech-pattern pb-20 md:pb-12">
        {/* Desktop Top Admin Navigation Header */}
        <header className="hidden md:block bg-slate-950 text-white border-b border-slate-800 py-3.5 px-6 lg:px-8 sticky top-0 z-30 shadow-md">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <a 
                href="https://kiyuhub.netlify.app/" 
                target="_blank" 
                rel="noreferrer" 
                className="font-extrabold text-red-500 text-lg tracking-tight hover:underline flex items-center gap-2"
              >
                {logoUrl && (
                  <img src={logoUrl} alt="Logo" className="h-6 max-w-[100px] object-contain" />
                )}
                <span>KIYUHUB GHANA</span>
              </a>
              <span className="text-slate-700 font-light">/</span>
              <div className="flex items-center gap-1.5 bg-slate-900 text-slate-200 text-xs px-3 py-1 rounded-full border border-slate-800 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="truncate max-w-[200px]">{currentAdminEmail}</span>
              </div>
            </div>

            {/* Desktop Navigation Tabs */}
            <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs font-bold">
              <button
                onClick={() => setActiveTab('briefs')}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeTab === 'briefs' 
                    ? 'bg-red-600 text-white shadow-xs' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Client Briefs</span>
              </button>

              <button
                onClick={() => setActiveTab('branding')}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeTab === 'branding' 
                    ? 'bg-red-600 text-white shadow-xs' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Palette className="w-3.5 h-3.5" />
                <span>Branding & PDF</span>
              </button>

              <button
                onClick={() => setActiveTab('admins')}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeTab === 'admins' 
                    ? 'bg-red-600 text-white shadow-xs' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Admin Team</span>
              </button>
            </div>

            {/* Desktop Action buttons */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  window.location.hash = '';
                  if (window.location.search.includes('admin')) {
                    window.history.pushState({}, '', window.location.pathname);
                  }
                  window.dispatchEvent(new Event('hashchange'));
                }}
                className="inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-white font-semibold bg-slate-900 hover:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-800 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Intake Form</span>
              </button>

              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-red-400 hover:text-white bg-red-950/60 hover:bg-red-900 px-3 py-1.5 rounded-lg border border-red-900 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </header>

        {/* Mobile Header Bar - Clean Form-style Branding */}
        <header className="md:hidden bg-white border-b border-slate-200 px-3.5 py-2 sticky top-0 z-30 shadow-2xs flex items-center justify-between">
          <div>
            <a 
              href="https://kiyuhub.netlify.app/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs font-extrabold text-red-600 hover:underline tracking-tight uppercase leading-tight block"
            >
              KIYUHUB GHANA
            </a>
            <p className="text-[8px] font-bold text-slate-500 tracking-wider uppercase leading-none mt-0.5">
              Empowering Breakthroughs
            </p>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => {
                window.location.hash = '';
                if (window.location.search.includes('admin')) {
                  window.history.pushState({}, '', window.location.pathname);
                }
                window.dispatchEvent(new Event('hashchange'));
              }}
              title="Return to Intake Form"
              className="p-1.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-red-600" />
              <span className="text-[11px] font-bold">Form</span>
            </button>

            <button
              onClick={handleLogout}
              title="Sign Out"
              className="p-1.5 rounded-lg bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </header>

        {/* Dedicated Mobile Navigation Tab Switcher Bar */}
        <div className="md:hidden bg-white border-b border-slate-200 sticky top-[49px] z-20 shadow-2xs px-3 py-2">
          <div className="grid grid-cols-3 gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
            <button
              onClick={() => setActiveTab('briefs')}
              className={`flex items-center justify-center gap-1.5 py-2 px-1 rounded-lg transition-all cursor-pointer ${
                activeTab === 'briefs' 
                  ? 'bg-red-600 text-white shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate text-[11px]">Briefs</span>
            </button>

            <button
              onClick={() => setActiveTab('branding')}
              className={`flex items-center justify-center gap-1.5 py-2 px-1 rounded-lg transition-all cursor-pointer ${
                activeTab === 'branding' 
                  ? 'bg-red-600 text-white shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Palette className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate text-[11px]">Branding</span>
            </button>

            <button
              onClick={() => setActiveTab('admins')}
              className={`flex items-center justify-center gap-1.5 py-2 px-1 rounded-lg transition-all cursor-pointer ${
                activeTab === 'admins' 
                  ? 'bg-red-600 text-white shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate text-[11px]">Team</span>
            </button>
          </div>
        </div>

        {/* Active Tab View */}
        <main className="max-w-7xl mx-auto px-3.5 sm:px-6 pt-4 sm:pt-6">
          {activeTab === 'briefs' && (
            <Dashboard 
              onNavigateToForm={() => {
                window.location.hash = '';
                if (window.location.search.includes('admin')) {
                  window.history.pushState({}, '', window.location.pathname);
                }
                window.dispatchEvent(new Event('hashchange'));
              }} 
            />
          )}
          {activeTab === 'branding' && <BrandingAndPdfSettings />}
          {activeTab === 'admins' && <AdminManagement currentAdminEmail={currentAdminEmail} />}
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans bg-tech-pattern flex flex-col items-center justify-center p-4 relative">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-8 shadow-xl space-y-6 relative z-10">
        {/* Custom Logo / Logo Placeholder */}
        <div className="text-center space-y-3">
          {logoUrl ? (
            <div className="flex justify-center pb-1">
              <img 
                src={logoUrl} 
                alt="Logo" 
                className="max-h-16 max-w-[200px] object-contain rounded-lg p-1 border border-slate-100 shadow-2xs"
              />
            </div>
          ) : (
            <div className="w-24 h-24 mx-auto border-2 border-dashed border-slate-300 rounded-2xl bg-slate-50 flex flex-col items-center justify-center text-slate-400 gap-1 p-2">
              <ImageIcon className="w-8 h-8 text-slate-400" />
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight text-center leading-tight">
                Uploadable Logo Placeholder
              </span>
            </div>
          )}

          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Admin Portal
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Sign in to manage client project briefs, PDF branding, and administrative access.
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl text-center font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@kiyuhub.com"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-hidden focus:border-red-600 focus:ring-1 focus:ring-red-600"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <Key className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-hidden focus:border-red-600 focus:ring-1 focus:ring-red-600"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-slate-950 hover:bg-slate-800 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 mt-2 cursor-pointer"
          >
            {isLoading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <Terminal className="w-4 h-4" />
                <span>Sign In to Dashboard</span>
              </>
            )}
          </button>
        </form>

        <div className="pt-2 text-center border-t border-slate-100">
          <button
            type="button"
            onClick={() => {
              window.location.hash = '';
              if (window.location.search.includes('admin')) {
                window.history.pushState({}, '', window.location.pathname);
              }
              window.dispatchEvent(new Event('hashchange'));
            }}
            className="text-xs text-slate-500 hover:text-slate-800 transition-colors inline-flex items-center gap-1 font-medium cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Project Intake Form
          </button>
        </div>
      </div>
    </div>
  );
};
