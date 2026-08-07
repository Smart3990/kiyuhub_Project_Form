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

// Default initial admin accounts
export const DEFAULT_ADMINS: AdminAccount[] = [
  {
    id: 'admin_default_1',
    email: 'blanc.69458@gmail.com',
    passwordHash: 'Smart@399',
    createdAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'admin_default_2',
    email: 'kiyuhubofficial@gmail.com',
    passwordHash: 'kiyuhub@123',
    createdAt: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'admin_default_3',
    email: 'admin@kiyuhub.com',
    passwordHash: 'Smart@399',
    createdAt: '2026-01-01T00:00:00.000Z'
  }
];

export const DEFAULT_ADMIN: AdminAccount = DEFAULT_ADMINS[0];

export const DEFAULT_BRANDING: AdminBrandingSettings = {
  primaryColorHex: '#1b2a4a',
  accentColorHex: '#b89252'
};

// In-memory cache fallback in case localStorage is blocked or temporarily unavailable
let inMemoryAdminsCache: AdminAccount[] | null = null;

export const getStoredAdmins = (): AdminAccount[] => {
  try {
    const raw = localStorage.getItem(ADMINS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Ensure default accounts are always preserved alongside added admins
        let hasMissingDefaults = false;
        const mergedList = [...parsed];

        for (const defaultAdmin of DEFAULT_ADMINS) {
          const exists = mergedList.some(
            a => a.email.trim().toLowerCase() === defaultAdmin.email.toLowerCase()
          );
          if (!exists) {
            mergedList.push(defaultAdmin);
            hasMissingDefaults = true;
          }
        }

        inMemoryAdminsCache = mergedList;

        if (hasMissingDefaults) {
          try {
            localStorage.setItem(ADMINS_STORAGE_KEY, JSON.stringify(mergedList));
          } catch (e) {
            console.error('Failed to update localStorage with merged defaults', e);
          }
        }

        return mergedList;
      }
    }
  } catch (e) {
    console.error('Failed to parse admins list from localStorage', e);
  }

  // If memory cache exists, return it
  if (inMemoryAdminsCache && inMemoryAdminsCache.length > 0) {
    return inMemoryAdminsCache;
  }

  // Seed default admins to storage if empty
  inMemoryAdminsCache = DEFAULT_ADMINS;
  try {
    localStorage.setItem(ADMINS_STORAGE_KEY, JSON.stringify(DEFAULT_ADMINS));
  } catch (e) {
    console.error('Failed to seed default admins to localStorage', e);
  }

  return DEFAULT_ADMINS;
};

export const saveStoredAdmins = (admins: AdminAccount[]) => {
  inMemoryAdminsCache = admins;
  try {
    localStorage.setItem(ADMINS_STORAGE_KEY, JSON.stringify(admins));
  } catch (e) {
    console.error('Failed to save admins list to localStorage', e);
  }

  // Dispatch custom event to notify all components in real-time
  try {
    window.dispatchEvent(new Event('admin_accounts_updated'));
    window.dispatchEvent(new Event('storage'));
  } catch (e) {
    console.error('Failed to dispatch storage event', e);
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
    window.dispatchEvent(new Event('storage'));
  } catch (e) {
    console.error('Failed to save branding settings to localStorage', e);
  }
};
