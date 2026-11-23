import React, { createContext, useContext, useEffect, useState } from 'react';

interface MotionContextType {
  calmMode: boolean;
  setCalmMode: (calm: boolean) => void;
  toggleCalmMode: () => void;
}

const MotionContext = createContext<MotionContextType | undefined>(undefined);

export const MotionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [calmMode, setCalmModeState] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    try {
      const saved = localStorage.getItem('agrovision_calm_mode');
      if (saved === 'true') return true;
      if (saved === 'false') return false;
      return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (!mediaQuery) return;

    const handleChange = (e: MediaQueryListEvent) => {
      try {
        if (localStorage.getItem('agrovision_calm_mode') === null) {
          setCalmModeState(e.matches);
        }
      } catch {
        setCalmModeState(e.matches);
      }
    };

    mediaQuery.addEventListener?.('change', handleChange);
    return () => mediaQuery.removeEventListener?.('change', handleChange);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (calmMode) {
      root.classList.add('calm-mode');
    } else {
      root.classList.remove('calm-mode');
    }
  }, [calmMode]);

  const setCalmMode = (calm: boolean) => {
    setCalmModeState(calm);
    try {
      localStorage.setItem('agrovision_calm_mode', String(calm));
    } catch {
      // Ignore storage failures in restricted contexts
    }
  };

  const toggleCalmMode = () => {
    setCalmMode(!calmMode);
  };

  return (
    <MotionContext.Provider value={{ calmMode, setCalmMode, toggleCalmMode }}>
      {children}
    </MotionContext.Provider>
  );
};

export const useMotion = () => {
  const ctx = useContext(MotionContext);
  if (!ctx) {
    throw new Error('useMotion must be used within a MotionProvider');
  }
  return ctx;
};
