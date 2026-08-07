import React, { useState, useEffect } from 'react';
import { 
  getStoredAdmins, 
  saveStoredAdmins, 
  type AdminAccount 
} from '../lib/adminSettings';
import { UserPlus, ShieldCheck, Trash2, Mail, Key, CheckCircle, AlertCircle } from 'lucide-react';

interface AdminManagementProps {
  currentAdminEmail: string;
}

export const AdminManagement: React.FC<AdminManagementProps> = ({ currentAdminEmail }) => {
  const [admins, setAdmins] = useState<AdminAccount[]>(() => getStoredAdmins());
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const DEFAULT_ADMIN_EMAIL = 'blanc.69458@gmail.com';
  const isPrimaryAdmin = currentAdminEmail.toLowerCase() === DEFAULT_ADMIN_EMAIL.toLowerCase();

  useEffect(() => {
    const handleSync = () => {
      setAdmins(getStoredAdmins());
    };

    window.addEventListener('admin_accounts_updated', handleSync);
    window.addEventListener('storage', handleSync);
    window.addEventListener('focus', handleSync);

    return () => {
      window.removeEventListener('admin_accounts_updated', handleSync);
      window.removeEventListener('storage', handleSync);
      window.removeEventListener('focus', handleSync);
    };
  }, []);

  const handleAddAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    const emailTrimmed = newEmail.trim().toLowerCase();
    if (!emailTrimmed) {
      setMessage({ type: 'error', text: 'Please enter a valid admin email address.' });
      return;
    }

    if (admins.some(a => a.email.toLowerCase() === emailTrimmed)) {
      setMessage({ type: 'error', text: 'An admin account with this email already exists.' });
      return;
    }

    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters long.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match.' });
      return;
    }

    const newAdmin: AdminAccount = {
      id: 'admin_' + Date.now(),
      email: emailTrimmed,
      passwordHash: newPassword,
      createdAt: new Date().toISOString()
    };

    const updated = [newAdmin, ...admins];
    setAdmins(updated);
    saveStoredAdmins(updated);

    setNewEmail('');
    setNewPassword('');
    setConfirmPassword('');
    setMessage({ type: 'success', text: `Admin account '${emailTrimmed}' created successfully!` });
  };

  const handleRemoveAdmin = (id: string, email: string) => {
    if (!isPrimaryAdmin) {
      alert('Only the default primary admin (blanc.69458@gmail.com) is authorized to remove admin accounts.');
      return;
    }

    if (email.toLowerCase() === DEFAULT_ADMIN_EMAIL.toLowerCase()) {
      alert('The primary default admin account (blanc.69458@gmail.com) cannot be removed.');
      return;
    }

    if (admins.length <= 1) {
      alert('You cannot remove the only admin account.');
      return;
    }

    if (window.confirm(`Are you sure you want to remove admin access for '${email}'?`)) {
      const updated = admins.filter(a => a.id !== id);
      setAdmins(updated);
      saveStoredAdmins(updated);
      setMessage({ type: 'success', text: `Admin '${email}' removed successfully.` });
    }
  };

  return (
    <div className="space-y-4 sm:space-y-8">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 shrink-0" />
            <h2 className="text-base sm:text-lg font-bold text-slate-900">Admin Team & Access Control</h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5 sm:mt-1">
            Manage authorized team members who have equal access to client briefs, PDF branding, and admin tools.
          </p>
        </div>
        <div className="px-3 py-1 sm:px-3.5 sm:py-1.5 bg-slate-100 text-slate-700 rounded-full text-xs font-semibold border border-slate-200 flex items-center gap-1.5 shrink-0">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>{admins.length} Active Admins</span>
        </div>
      </div>

      {message && (
        <div className={`p-3.5 sm:p-4 rounded-xl border text-xs flex items-center gap-2 font-medium ${
          message.type === 'success' 
            ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
            : 'bg-red-50 text-red-800 border-red-200'
        }`}>
          {message.type === 'success' ? <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />}
          <span>{message.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Add Admin Form */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5 sm:pb-3">
            <UserPlus className="w-4 h-4 text-slate-700" />
            <h3 className="text-xs sm:text-sm font-bold text-slate-900">Add New Admin Account</h3>
          </div>

          <form onSubmit={handleAddAdmin} className="space-y-3.5 sm:space-y-4">
            <div className="space-y-1.5">
              <label className="block text-[11px] sm:text-xs font-bold text-slate-700 uppercase tracking-wider">
                Admin Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="newadmin@kiyuhub.com"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:border-red-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[11px] sm:text-xs font-bold text-slate-700 uppercase tracking-wider">
                Account Password
              </label>
              <div className="relative">
                <Key className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:border-red-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[11px] sm:text-xs font-bold text-slate-700 uppercase tracking-wider">
                Confirm Password
              </label>
              <div className="relative">
                <Key className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:border-red-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-2xs transition-colors cursor-pointer flex items-center justify-center gap-2 mt-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>Create Admin Account</span>
            </button>
          </form>
        </div>

        {/* Existing Admins Directory */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 sm:pb-3">
            <h3 className="text-xs sm:text-sm font-bold text-slate-900">Authorized Admin Directory</h3>
            <span className="text-[10px] sm:text-xs text-slate-500">Equal access privileges</span>
          </div>

          <div className="divide-y divide-slate-100">
            {admins.map((admin) => {
              const isSelf = admin.email.toLowerCase() === currentAdminEmail.toLowerCase();
              const isTargetDefaultAdmin = admin.email.toLowerCase() === DEFAULT_ADMIN_EMAIL.toLowerCase();

              let canDelete = true;
              let disableReason = "Remove admin access";

              if (!isPrimaryAdmin) {
                canDelete = false;
                disableReason = "Only default admin (blanc.69458@gmail.com) can remove admins";
              } else if (isTargetDefaultAdmin) {
                canDelete = false;
                disableReason = "Primary admin (blanc.69458@gmail.com) cannot be removed";
              } else if (admins.length <= 1) {
                canDelete = false;
                disableReason = "Cannot delete the last admin account";
              }

              return (
                <div key={admin.id} className="py-3 sm:py-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 font-bold text-xs shrink-0">
                      {admin.email.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-900 truncate max-w-[200px] sm:max-w-xs">{admin.email}</span>
                        {isTargetDefaultAdmin && (
                          <span className="bg-amber-100 text-amber-800 text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-200">
                            Primary Admin
                          </span>
                        )}
                        {isSelf && (
                          <span className="bg-red-100 text-red-700 text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full border border-red-200">
                            You
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] sm:text-[11px] text-slate-400 block">
                        Added: {new Date(admin.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="w-full sm:w-auto flex justify-end pt-1 sm:pt-0 border-t sm:border-0 border-slate-50">
                    <button
                      onClick={() => handleRemoveAdmin(admin.id, admin.email)}
                      disabled={!canDelete}
                      title={disableReason}
                      className="inline-flex items-center justify-center gap-1 text-xs text-red-600 hover:text-red-700 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-red-50 px-2.5 py-1.5 sm:p-2 rounded-lg transition-colors cursor-pointer font-medium w-full sm:w-auto"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove Access</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
