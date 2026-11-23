import React, { createContext, useContext, useEffect, useState } from 'react';
import { DiagnosisResult, SeverityLevel } from '../types/disease';

export interface ScanHistoryEntry {
  id: string;
  createdAt: string;
  source: 'upload' | 'camera' | 'sample';
  diseaseId: string;
  diseaseName: string;
  scientificName: string;
  confidence: number;
  severity: SeverityLevel;
  isTomatoLeaf: boolean;
  validationMessage?: string;
  summary: string;
  organicTreatment: string[];
  thumbnailUrl: string;
  sensorSnapshot?: {
    moistureEnabled: boolean;
    moisturePercent: number;
    phEnabled: boolean;
    soilPh: number;
    riskLevel?: 'Optimal' | 'Elevated' | 'Critical';
  };
}

interface ScanHistoryContextValue {
  scans: ScanHistoryEntry[];
  addScan: (result: DiagnosisResult, source: 'upload' | 'camera' | 'sample') => Promise<void>;
  removeScan: (id: string) => void;
  clearScans: () => void;
  isHistoryOpen: boolean;
  openHistory: () => void;
  closeHistory: () => void;
}

const STORAGE_KEY = 'agrovision_field_scans_v1';
const MAX_SCANS = 25;
const SCAN_EVENT = 'agrovision-scans-updated';

const ScanHistoryContext = createContext<ScanHistoryContextValue | undefined>(undefined);

function readStoredScans(): ScanHistoryEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeStoredScans(scans: ScanHistoryEntry[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(scans));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(SCAN_EVENT));
    }
  } catch {
    // Ignore storage quota errors
  }
}

async function createCompactThumbnail(uri: string): Promise<string> {
  if (!uri || typeof document === 'undefined') return uri;
  if (!uri.startsWith('data:')) return uri;

  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      try {
        const maxSide = 220;
        const scale = Math.min(1, maxSide / Math.max(img.width || 1, img.height || 1));
        const w = Math.max(1, Math.round((img.width || maxSide) * scale));
        const h = Math.max(1, Math.round((img.height || maxSide) * scale));
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, w, h);
          resolve(canvas.toDataURL('image/jpeg', 0.72));
          return;
        }
      } catch {
        // Fallback below
      }
      resolve(uri);
    };
    img.onerror = () => resolve(uri);
    img.src = uri;
  });
}

export async function saveScanToStorage(
  result: DiagnosisResult,
  source: 'upload' | 'camera' | 'sample'
): Promise<ScanHistoryEntry> {
  const thumbnailUrl = await createCompactThumbnail(result.imageUri);
  const entry: ScanHistoryEntry = {
    id: `scan_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    createdAt: new Date().toISOString(),
    source,
    diseaseId: result.diseaseId,
    diseaseName: result.diseaseName,
    scientificName: result.scientificName,
    confidence: result.confidence,
    severity: result.severity,
    isTomatoLeaf: result.isTomatoLeaf,
    validationMessage: result.validationMessage,
    summary: result.summary,
    organicTreatment: result.treatment.organic.slice(0, 3),
    thumbnailUrl,
    sensorSnapshot: result.sensorInsights
      ? {
          moistureEnabled: result.sensorInsights.moistureEnabled,
          moisturePercent: result.sensorInsights.moisturePercent ?? 58,
          phEnabled: result.sensorInsights.phEnabled,
          soilPh: result.sensorInsights.soilPh ?? 6.4,
          riskLevel: result.sensorInsights.riskLevel
        }
      : undefined
  };

  const next = [entry, ...readStoredScans()].slice(0, MAX_SCANS);
  writeStoredScans(next);
  return entry;
}

export const ScanHistoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [scans, setScans] = useState<ScanHistoryEntry[]>(() => readStoredScans());
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  useEffect(() => {
    const sync = () => setScans(readStoredScans());
    window.addEventListener(SCAN_EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(SCAN_EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const addScan = async (result: DiagnosisResult, source: 'upload' | 'camera' | 'sample') => {
    await saveScanToStorage(result, source);
    setScans(readStoredScans());
  };

  const removeScan = (id: string) => {
    const next = readStoredScans().filter((item) => item.id !== id);
    writeStoredScans(next);
    setScans(next);
  };

  const clearScans = () => {
    writeStoredScans([]);
    setScans([]);
  };

  return (
    <ScanHistoryContext.Provider
      value={{
        scans,
        addScan,
        removeScan,
        clearScans,
        isHistoryOpen,
        openHistory: () => setIsHistoryOpen(true),
        closeHistory: () => setIsHistoryOpen(false)
      }}
    >
      {children}
    </ScanHistoryContext.Provider>
  );
};

export const useScanHistory = (): ScanHistoryContextValue => {
  const ctx = useContext(ScanHistoryContext);
  if (!ctx) {
    throw new Error('useScanHistory must be used within a ScanHistoryProvider');
  }
  return ctx;
};
