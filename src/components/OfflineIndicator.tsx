import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { useLanguage } from '../context/LanguageContext';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();
  const { isUrdu } = useLanguage();

  if (isOnline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      dir={isUrdu ? 'rtl' : 'ltr'}
      className="no-print fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-xl bg-[#13281c] border border-emerald-500/60 px-3.5 py-2 text-xs font-semibold text-[#faf8f2] shadow-lg"
    >
      <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse shrink-0" />
      <WifiOff className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
      <span>
        {isUrdu
          ? 'آف لائن فیلڈ موڈ — محفوظ تشخیص اور ڈیٹا فعال ہے'
          : 'Offline Field Mode — Cached scanner & care library active'}
      </span>
    </div>
  );
};
