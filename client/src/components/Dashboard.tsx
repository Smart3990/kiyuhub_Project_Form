import React, { useState, useMemo } from 'react';
import { generateKiyuHubProjectBreakdownPDF } from '../lib/pdfExporter';
import { PdfPreview } from './PdfPreview';
import { 
  getStoredSubmissions, 
  saveStoredSubmissions, 
  type ProjectSubmission 
} from '../lib/submissionStorage';
import { 
  Search, 
  Download, 
  MessageSquare, 
  Plus, 
  Eye, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  Layers, 
  DollarSign, 
  Phone, 
  Mail, 
  X, 
  Sparkles,
  FileText,
  User
} from 'lucide-react';

interface DashboardProps {
  onNavigateToForm: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigateToForm }) => {
  const [submissions, setSubmissions] = useState<ProjectSubmission[]>(() => getStoredSubmissions());
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedSubmission, setSelectedSubmission] = useState<ProjectSubmission | null>(null);
  const [editingNotes, setEditingNotes] = useState<string>('');
  const [modalTab, setModalTab] = useState<'details' | 'pdf'>('details');

  const selectedPdfBlob = useMemo(() => {
    if (!selectedSubmission) return null;
    try {
      const { pdfBlob } = generateKiyuHubProjectBreakdownPDF(
        selectedSubmission.formData, 
        selectedSubmission.clientLogoDataUrl
      );
      return pdfBlob;
    } catch (e) {
      console.error('Failed to generate PDF blob:', e);
      return null;
    }
  }, [selectedSubmission]);

  const handleUpdateStatus = (id: string, newStatus: ProjectSubmission['status']) => {
    const updated = submissions.map((sub) => {
      if (sub.id === id) {
        return { ...sub, status: newStatus };
      }
      return sub;
    });
    setSubmissions(updated);
    saveStoredSubmissions(updated);

    if (selectedSubmission && selectedSubmission.id === id) {
      setSelectedSubmission({ ...selectedSubmission, status: newStatus });
    }
  };

  const handleSaveNotes = (id: string) => {
    const updated = submissions.map((sub) => {
      if (sub.id === id) {
        return { ...sub, adminNotes: editingNotes };
      }
      return sub;
    });
    setSubmissions(updated);
    saveStoredSubmissions(updated);
    if (selectedSubmission && selectedSubmission.id === id) {
      setSelectedSubmission({ ...selectedSubmission, adminNotes: editingNotes });
    }
  };

  const handleDeleteSubmission = (id: string) => {
    if (window.confirm('Are you sure you want to delete this project submission brief?')) {
      const updated = submissions.filter((sub) => sub.id !== id);
      setSubmissions(updated);
      saveStoredSubmissions(updated);
      if (selectedSubmission && selectedSubmission.id === id) {
        setSelectedSubmission(null);
      }
    }
  };

  const handleDownloadPDF = (sub: ProjectSubmission) => {
    try {
      const { doc } = generateKiyuHubProjectBreakdownPDF(sub.formData, sub.clientLogoDataUrl);
      const fileName = `${(sub.formData.projectTitle || 'project').replace(/[^a-z0-9]/gi, '_').toLowerCase()}_project_breakdown.pdf`;
      doc.save(fileName);
    } catch (e) {
      console.error('Failed to generate PDF:', e);
      alert('Error generating PDF brief. Please try again.');
    }
  };

  const handleSeedSampleData = () => {
    const samples: ProjectSubmission[] = [
      {
        id: 'sub_' + Date.now() + '_1',
        createdAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
        status: 'New Brief',
        adminNotes: 'High priority query from logistics company. Need to schedule discovery call.',
        formData: {
          fullName: 'Kwame Mensah',
          email: 'kwame@deliverygh.com',
          phoneNumber: '+233 24 123 4567',
          whatsappNumber: '+233 24 123 4567',
          companyName: 'DeliveryGH Logistics',
          roleOrTitle: 'Managing Director',
          projectTitle: 'Logistics Fleet Tracking App',
          projectType: 'app',
          subCategory: 'logistics_tracking',
          projectDescription: 'Real-time vehicle fleet tracking and dispatch management app for courier drivers and business clients across Accra and Kumasi.',
          targetPlatforms: ['ios', 'android', 'web_desktop'],
          selectedFeatures: ['user_auth', 'realtime_chat', 'admin_panel', 'push_notifications', 'payments'],
          budget: '10000-20000_ghs',
          currency: 'GHS',
          launchDate: 'fasttrack_2w',
          contentProvider: 'collaborative',
          maintenanceNeeded: 'monthly_devops',
          agreedToTerms: true,
        }
      },
      {
        id: 'sub_' + Date.now() + '_2',
        createdAt: new Date(Date.now() - 3600000 * 24 * 5).toISOString(),
        status: 'Approved',
        adminNotes: 'Scope finalized. Deposit received. Milestone 1 under development.',
        formData: {
          fullName: 'Abena Osei',
          email: 'abena@afrocrafts.shop',
          phoneNumber: '+233 55 987 6543',
          whatsappNumber: '+233 55 987 6543',
          companyName: 'AfroCrafts Online',
          roleOrTitle: 'E-commerce Lead',
          projectTitle: 'AfroCrafts Marketplace',
          projectType: 'ecommerce',
          subCategory: 'multivendor_marketplace',
          projectDescription: 'A multi-vendor e-commerce platform allowing artisan creators in West Africa to sell handcrafted products globally with mobile money & card payments.',
          targetPlatforms: ['web_desktop', 'web_mobile'],
          selectedFeatures: ['user_auth', 'payments', 'admin_panel', 'analytics', 'search_filter'],
          budget: '20000+_ghs',
          currency: 'GHS',
          launchDate: 'standard_1m',
          contentProvider: 'client_ready',
          maintenanceNeeded: 'ongoing_features',
          agreedToTerms: true,
        }
      }
    ];

    const updated = [...samples, ...submissions];
    setSubmissions(updated);
    saveStoredSubmissions(updated);
  };

  const filteredSubmissions = submissions.filter((sub) => {
    const q = searchQuery.toLowerCase();
    const titleMatch = sub.formData.projectTitle?.toLowerCase().includes(q);
    const nameMatch = sub.formData.fullName?.toLowerCase().includes(q);
    const emailMatch = sub.formData.email?.toLowerCase().includes(q);
    const companyMatch = sub.formData.companyName?.toLowerCase().includes(q);
    const matchesSearch = !q || titleMatch || nameMatch || emailMatch || companyMatch;

    const matchesStatus = statusFilter === 'all' || sub.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || sub.formData.projectType === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const totalBriefs = submissions.length;
  const newBriefs = submissions.filter((s) => s.status === 'New Brief' || s.status === 'Under Triage').length;
  const approvedBriefs = submissions.filter((s) => s.status === 'Approved' || s.status === 'In Development').length;

  return (
    <div className="space-y-6">
      {/* Top Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">Submissions Admin</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-950 tracking-tight mt-0.5">
            Project Briefs Dashboard
          </h1>
          <p className="text-xs text-slate-600 mt-0.5 sm:mt-1">
            Manage, review, and export PDF briefs submitted to KiyuHub.
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          {submissions.length === 0 && (
            <button
              onClick={handleSeedSampleData}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-2.5 sm:px-3.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Load Sample Data</span>
            </button>
          )}

          <button
            onClick={onNavigateToForm}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Brief</span>
          </button>
        </div>
      </div>

      {/* Metrics Bar - Optimized for Mobile 3-Column or Responsive Grid */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        <div className="bg-white p-3 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center sm:justify-between text-center sm:text-left gap-1 sm:gap-0">
          <div>
            <p className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider line-clamp-1">Total Logged</p>
            <h3 className="text-lg sm:text-2xl font-extrabold text-slate-950 mt-0.5">{totalBriefs}</h3>
          </div>
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center font-bold shrink-0">
            <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-3 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center sm:justify-between text-center sm:text-left gap-1 sm:gap-0">
          <div>
            <p className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider line-clamp-1">Pending Triage</p>
            <h3 className="text-lg sm:text-2xl font-extrabold text-amber-600 mt-0.5">{newBriefs}</h3>
          </div>
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold border border-amber-200 shrink-0">
            <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
        </div>

        <div className="bg-white p-3 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center sm:justify-between text-center sm:text-left gap-1 sm:gap-0">
          <div>
            <p className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider line-clamp-1">Approved</p>
            <h3 className="text-lg sm:text-2xl font-extrabold text-emerald-600 mt-0.5">{approvedBriefs}</h3>
          </div>
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold border border-emerald-200 shrink-0">
            <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search project, client, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-slate-400 transition-colors"
          />
        </div>

        <div className="grid grid-cols-2 gap-2 w-full md:w-auto md:flex md:items-center">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full text-xs py-2 px-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 font-medium focus:outline-hidden"
          >
            <option value="all">All Statuses</option>
            <option value="New Brief">New Brief</option>
            <option value="Under Triage">Under Triage</option>
            <option value="Discovery Call">Discovery Call</option>
            <option value="Approved">Approved</option>
            <option value="In Development">In Development</option>
            <option value="Completed">Completed</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full text-xs py-2 px-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 font-medium focus:outline-hidden"
          >
            <option value="all">All Archetypes</option>
            <option value="website">Website</option>
            <option value="app">Mobile / Web App</option>
            <option value="saas">SaaS Platform</option>
            <option value="ecommerce">E-commerce</option>
            <option value="ai_api">AI & API Service</option>
            <option value="fintech">FinTech</option>
            <option value="management_systems">Enterprise / Portal</option>
          </select>
        </div>
      </div>

      {/* Submissions List */}
      {filteredSubmissions.length === 0 ? (
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">No project briefs found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              {searchQuery || statusFilter !== 'all' || categoryFilter !== 'all'
                ? 'Try clearing your filters or search query.'
                : 'Submit a new project specification brief to get started!'}
            </p>
          </div>
          {submissions.length === 0 && (
            <button
              onClick={handleSeedSampleData}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 rounded-xl hover:bg-blue-100 transition-colors cursor-pointer"
            >
              <Sparkles className="w-4 h-4" /> Load Sample Project Submissions
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3.5 sm:gap-4">
          {filteredSubmissions.map((sub) => {
            const data = sub.formData;
            const dateStr = new Date(sub.createdAt).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            });

            return (
              <div
                key={sub.id}
                className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs hover:border-slate-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-3.5 sm:gap-4"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center justify-between sm:justify-start gap-2 border-b border-slate-100 pb-2.5 sm:border-0 sm:pb-0">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[10px] sm:text-xs font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 border border-slate-200 uppercase tracking-wider">
                        {data.projectType?.replace('_', ' ')}
                      </span>

                      <select
                        value={sub.status}
                        onChange={(e) => handleUpdateStatus(sub.id, e.target.value as ProjectSubmission['status'])}
                        className="text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full border cursor-pointer focus:outline-hidden bg-white text-slate-900 border-slate-300"
                      >
                        <option value="New Brief">🟢 New Brief</option>
                        <option value="Under Triage">⚡ Under Triage</option>
                        <option value="Discovery Call">📞 Discovery Call</option>
                        <option value="Approved">✅ Approved</option>
                        <option value="In Development">🚀 In Development</option>
                        <option value="Completed">🎉 Completed</option>
                      </select>
                    </div>

                    <span className="text-[11px] text-slate-400 font-mono">ID: {sub.id.slice(-6)} • {dateStr}</span>
                  </div>

                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-950 flex flex-wrap items-center gap-2 mt-1 sm:mt-0">
                      <span>{data.projectTitle}</span>
                      {sub.clientLogoDataUrl && (
                        <span className="text-[10px] bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded-md border border-blue-200">
                          Logo Attached ✨
                        </span>
                      )}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-2 mt-1">
                      {data.projectDescription}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-y-1.5 gap-x-3 text-[11px] sm:text-xs text-slate-600 pt-1">
                    <span className="flex items-center gap-1 font-semibold text-slate-900 bg-slate-50 sm:bg-transparent px-2 sm:px-0 py-0.5 rounded-md">
                      <User className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span className="truncate max-w-[140px] sm:max-w-none">{data.fullName}</span> {data.companyName ? `(${data.companyName})` : ''}
                    </span>
                    <span className="flex items-center gap-1 bg-slate-50 sm:bg-transparent px-2 sm:px-0 py-0.5 rounded-md">
                      <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate max-w-[160px] sm:max-w-none">{data.email}</span>
                    </span>
                    <span className="flex items-center gap-1 font-mono bg-slate-50 sm:bg-transparent px-2 sm:px-0 py-0.5 rounded-md">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      {data.phoneNumber}
                    </span>
                  </div>
                </div>

                {/* Quick Action Buttons - Grid on mobile, Stack on desktop */}
                <div className="grid grid-cols-3 gap-2 w-full md:w-auto md:flex md:flex-col shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
                  <button
                    onClick={() => {
                      setSelectedSubmission(sub);
                      setEditingNotes(sub.adminNotes || '');
                    }}
                    className="inline-flex items-center justify-center gap-1 sm:gap-1.5 px-2.5 py-2 text-[11px] sm:text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>View</span>
                  </button>

                  <button
                    onClick={() => handleDownloadPDF(sub)}
                    className="inline-flex items-center justify-center gap-1 sm:gap-1.5 px-2.5 py-2 text-[11px] sm:text-xs font-bold text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-red-600 shrink-0" />
                    <span>PDF</span>
                  </button>

                  <a
                    href={`https://wa.me/${data.whatsappNumber?.replace(/[^0-9]/g, '')}?text=Hi%20${encodeURIComponent(data.fullName)},%20this%20is%20KiyuHub%20regarding%20your%20project%20brief%20for%20${encodeURIComponent(data.projectTitle)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-1 sm:gap-1.5 px-2.5 py-2 text-[11px] sm:text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl transition-colors cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Brief Detail Modal / Drawer */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-2.5 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-2xl max-w-5xl w-full h-[92vh] sm:h-[90vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="p-3.5 sm:p-6 border-b border-slate-200 bg-slate-50 space-y-3 sm:space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="pr-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                      {selectedSubmission.formData.projectType}
                    </span>
                    <span className="text-[11px] sm:text-xs font-mono text-slate-500">
                      Logged: {new Date(selectedSubmission.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h2 className="text-lg sm:text-2xl font-extrabold text-slate-950 mt-1 line-clamp-1">
                    {selectedSubmission.formData.projectTitle}
                  </h2>
                </div>

                <button
                  onClick={() => setSelectedSubmission(null)}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-200 text-slate-600 hover:bg-slate-300 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>

              {/* Tab Navigation Controls */}
              <div className="flex items-center gap-1.5 sm:gap-2 border-b border-slate-200 pb-0">
                <button
                  type="button"
                  onClick={() => setModalTab('details')}
                  className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 text-xs font-bold rounded-t-xl transition-colors border-b-2 cursor-pointer flex items-center justify-center gap-1.5 ${
                    modalTab === 'details'
                      ? 'border-red-600 text-red-600 bg-white'
                      : 'border-transparent text-slate-600 hover:text-slate-900 bg-transparent'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Specification Details</span>
                </button>

                <button
                  type="button"
                  onClick={() => setModalTab('pdf')}
                  className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 text-xs font-bold rounded-t-xl transition-colors border-b-2 cursor-pointer flex items-center justify-center gap-1.5 ${
                    modalTab === 'pdf'
                      ? 'border-red-600 text-red-600 bg-white'
                      : 'border-transparent text-slate-600 hover:text-slate-900 bg-transparent'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Live PDF Preview</span>
                </button>
              </div>
            </div>

            {/* Modal Content Body */}
            {modalTab === 'pdf' ? (
              <div className="p-2 sm:p-6 bg-slate-100 flex-1 min-h-[400px]">
                <PdfPreview 
                  pdfBlob={selectedPdfBlob} 
                  fileName={`${(selectedSubmission.formData.projectTitle || 'project').replace(/[^a-z0-9]/gi, '_').toLowerCase()}_brief.pdf`} 
                />
              </div>
            ) : (
              <div className="p-3.5 sm:p-6 overflow-y-auto space-y-4 sm:space-y-6 text-xs text-slate-700 flex-1">
                {/* Logo Preview Banner if Present */}
                {selectedSubmission.clientLogoDataUrl && (
                  <div className="p-3 sm:p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center gap-3 sm:gap-4">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-xl border border-slate-200 p-1.5 sm:p-2 shrink-0 flex items-center justify-center">
                      <img
                        src={selectedSubmission.clientLogoDataUrl}
                        alt="Uploaded Brand Logo"
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs sm:text-sm">Uploaded Brand Logo</h4>
                      <p className="text-slate-500 text-[11px] sm:text-xs mt-0.5">
                        Uploaded client brand asset attached with submission record.
                      </p>
                    </div>
                  </div>
                )}

                {/* Client Information */}
                <div className="space-y-2 border-b border-slate-100 pb-3 sm:pb-4">
                  <h3 className="font-bold text-slate-950 text-xs sm:text-sm uppercase tracking-wider flex items-center gap-1.5">
                    <User className="w-4 h-4 text-blue-700" />
                    1. Contact & Stakeholder Information
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 bg-slate-50 p-3 sm:p-4 rounded-xl border border-slate-200">
                    <p><strong className="text-slate-950">Name:</strong> {selectedSubmission.formData.fullName}</p>
                    <p><strong className="text-slate-950">Email:</strong> {selectedSubmission.formData.email}</p>
                    <p><strong className="text-slate-950">Phone:</strong> {selectedSubmission.formData.phoneNumber}</p>
                    <p><strong className="text-slate-950">WhatsApp:</strong> {selectedSubmission.formData.whatsappNumber}</p>
                    <p><strong className="text-slate-950">Company:</strong> {selectedSubmission.formData.companyName || 'N/A'}</p>
                    <p><strong className="text-slate-950">Role:</strong> {selectedSubmission.formData.roleOrTitle || 'N/A'}</p>
                  </div>
                </div>

                {/* Functional Scope & Description */}
                <div className="space-y-2 border-b border-slate-100 pb-3 sm:pb-4">
                  <h3 className="font-bold text-slate-950 text-xs sm:text-sm uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-blue-700" />
                    2. Project Archetype & Scope Description
                  </h3>
                  <div className="bg-slate-50 p-3 sm:p-4 rounded-xl border border-slate-200 space-y-2">
                    <p><strong className="text-slate-950">Sub-Category Detail:</strong> {selectedSubmission.formData.subCategory}</p>
                    <p><strong className="text-slate-950">Project Description:</strong> {selectedSubmission.formData.projectDescription}</p>
                    {selectedSubmission.formData.targetPlatforms && (
                      <p><strong className="text-slate-950">Target Platforms:</strong> {selectedSubmission.formData.targetPlatforms.join(', ')}</p>
                    )}
                    {selectedSubmission.formData.selectedFeatures && (
                      <div className="pt-1">
                        <strong className="text-slate-950 block mb-1">Selected Features & Capabilities:</strong>
                        <div className="flex flex-wrap gap-1.5">
                          {selectedSubmission.formData.selectedFeatures.map((feat) => (
                            <span key={feat} className="bg-white px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md border border-slate-200 font-medium text-slate-800 text-[11px] sm:text-xs">
                              {feat}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Commercials & Timeline */}
                <div className="space-y-2 border-b border-slate-100 pb-3 sm:pb-4">
                  <h3 className="font-bold text-slate-950 text-xs sm:text-sm uppercase tracking-wider flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4 text-blue-700" />
                    3. Budget, Timeline & Maintenance
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 bg-slate-50 p-3 sm:p-4 rounded-xl border border-slate-200">
                    <p><strong className="text-slate-950">Budget Bracket:</strong> {selectedSubmission.formData.budget}</p>
                    <p><strong className="text-slate-950">Target Timeline:</strong> {selectedSubmission.formData.launchDate}</p>
                    <p><strong className="text-slate-950">Design & Assets:</strong> {selectedSubmission.formData.contentProvider}</p>
                    <p><strong className="text-slate-950">SLA Support:</strong> {selectedSubmission.formData.maintenanceNeeded || 'Included Warranty'}</p>
                  </div>
                </div>

                {/* Admin Internal Notes Area */}
                <div className="space-y-2">
                  <h3 className="font-bold text-slate-950 text-xs sm:text-sm uppercase tracking-wider">
                    Internal Engineering & Sales Notes
                  </h3>
                  <textarea
                    rows={3}
                    value={editingNotes}
                    onChange={(e) => setEditingNotes(e.target.value)}
                    placeholder="Add private notes on milestone progress, pricing quotes, or meeting summaries..."
                    className="w-full p-2.5 sm:p-3 rounded-xl border border-slate-300 bg-white text-xs text-slate-900 focus:outline-hidden focus:border-slate-500"
                  />
                  <button
                    onClick={() => handleSaveNotes(selectedSubmission.id)}
                    className="px-3.5 py-1.5 bg-slate-950 text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    Save Internal Notes
                  </button>
                </div>
              </div>
            )}

            {/* Modal Actions Footer */}
            <div className="p-3 sm:p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-2.5">
              <button
                onClick={() => handleDeleteSubmission(selectedSubmission.id)}
                className="inline-flex items-center gap-1.5 text-xs text-red-600 hover:text-red-800 font-bold px-2 py-1.5 sm:px-3 sm:py-2 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span className="hidden sm:inline">Delete Brief</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDownloadPDF(selectedSubmission)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 sm:px-4 text-xs font-bold text-white bg-slate-950 hover:bg-slate-800 rounded-xl transition-colors shadow-xs cursor-pointer"
                >
                  <Download className="w-4 h-4" /> Export PDF Brief
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
