export interface AdminAccount {
  id: string;
  email: string;
  passwordHash: string; // Plain/stored password string for admin portal authentication
  createdAt: string;
}

export interface AdminBrandingSettings {
  agencyLogoDataUrl?: string; // Custom logo for PDF header/cover
  authLogoDataUrl?: string;   // Custom logo for Admin Auth page
  primaryColorHex: string;    // PDF Primary Color (Default Navy: #1b2a4a)
  accentColorHex: string;     // PDF Accent Color (Default Gold: #b89252)
}

const ADMINS_STORAGE_KEY = 'kiyuhub_admin_accounts_list';
const BRANDING_STORAGE_KEY = 'kiyuhub_admin_branding_settings';

// Default initial admin account requested by user
export const DEFAULT_ADMIN: AdminAccount = {
  id: 'admin_default_1',
  email: 'blanc.69458@gmail.com',
  passwordHash: 'Smart@399',
  createdAt: new Date().toISOString()
};

export const DEFAULT_BRANDING: AdminBrandingSettings = {
  primaryColorHex: '#1b2a4a',
  accentColorHex: '#b89252'
};

export const getStoredAdmins = (): AdminAccount[] => {
  try {
    const raw = localStorage.getItem(ADMINS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to parse admins list from localStorage', e);
  }
  return [DEFAULT_ADMIN];
};

export const saveStoredAdmins = (admins: AdminAccount[]) => {
  try {
    localStorage.setItem(ADMINS_STORAGE_KEY, JSON.stringify(admins));
  } catch (e) {
    console.error('Failed to save admins list to localStorage', e);
  }
};

export const getStoredBrandingSettings = (): AdminBrandingSettings => {
  try {
    const raw = localStorage.getItem(BRANDING_STORAGE_KEY);
    if (raw) {
      return { ...DEFAULT_BRANDING, ...JSON.parse(raw) };
    }
  } catch (e) {
    console.error('Failed to parse branding settings from localStorage', e);
  }
  return DEFAULT_BRANDING;
};

export const saveStoredBrandingSettings = (settings: AdminBrandingSettings) => {
  try {
    localStorage.setItem(BRANDING_STORAGE_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save branding settings to localStorage', e);
  }
};
