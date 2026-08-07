import type { FormData } from '../types/schema';

export interface ProjectSubmission {
  id: string;
  createdAt: string;
  status: 'New Brief' | 'Under Triage' | 'Discovery Call' | 'Approved' | 'In Development' | 'Completed';
  adminNotes?: string;
  clientLogoDataUrl?: string;
  formData: FormData;
}

const SUBMISSIONS_STORAGE_KEY = 'kiyuhub_submissions_list';

export const getStoredSubmissions = (): ProjectSubmission[] => {
  try {
    const raw = localStorage.getItem(SUBMISSIONS_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to parse submissions from localStorage', e);
  }
  return [];
};

export const saveStoredSubmissions = (list: ProjectSubmission[]) => {
  try {
    localStorage.setItem(SUBMISSIONS_STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    console.error('Failed to save submissions to localStorage', e);
  }
};
