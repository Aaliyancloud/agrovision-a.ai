import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Camera, ShieldCheck, Lock, ScanLine, UploadCloud, X, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface CameraPermissionModalProps {
  isOpen: boolean;
  onAllowCamera: () => void;
  onClose: () => void;
  onSwitchToUpload?: () => void;
}

export const CameraPermissionModal: React.FC<CameraPermissionModalProps> = ({
  isOpen,
  onAllowCamera,
  onClose,
  onSwitchToUpload
}) => {
  const { isUrdu } = useLanguage();

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen || typeof document === 'undefined') return null;

  const reasons = [
    {
      icon: ScanLine,
      title: isUrdu ? 'لائیو پتے کی درست فریم نگ' : 'Real-Time Leaf Framing & Focus',
      desc: isUrdu
        ? 'اسکرین پر موجود ہدف آپ کو ٹماٹر کے ایک پتے کو واضح روشنی میں مرکز میں رکھنے میں مدد دیتا ہے۔'
        : 'On-screen viewfinder guides help center a single tomato leaflet in clear daylight for accurate disease spot detection.'
    },
    {
      icon: Lock,
      title: isUrdu ? 'مکمل رازداری — کوئی پسِ پردہ ریکارڈنگ نہیں' : 'Private Live Stream — Zero Background Recording',
      desc: isUrdu
        ? 'کیمرہ صرف آپ کے براؤزر میں چلتا ہے۔ تصویر صرف اسی وقت لی جاتی ہے جب آپ کیپچر بٹن دباتے ہیں۔'
        : 'Video stays strictly on your device. Only the single leaf photo you choose to capture is inspected.'
    },
    {
      icon: ShieldCheck,
      title: isUrdu ? 'کھیت میں فوری دو مرحلہ جاتی جانچ' : 'Instant Field Inspection',
      desc: isUrdu
        ? 'پتے توڑے بغیر کھیت یا گملے کے قریب ہی بیماری کی ابتدائی علامات کا فوری معائنہ کریں۔'
        : 'Inspect tomato plants directly in your garden or greenhouse without picking leaves or switching apps.'
    }
  ];

  return createPortal(
    <div
      className="fixed inset-0 overflow-y-auto overscroll-contain bg-[#13281c]/65 backdrop-blur-md"
      style={{ zIndex: 9990 }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="camera-permission-title"
    >
      <div className="flex min-h-full w-full items-center justify-center px-3 sm:px-6 pt-20 sm:pt-24 pb-4 sm:pb-6">
        <div
          className="relative w-full max-w-xl my-auto bg-[#faf8f2] border border-[#cbdcd0] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[calc(100dvh-6.25rem)] sm:max-h-[calc(100dvh-7.5rem)]"
          onClick={(e) => e.stopPropagation()}
        >
        {/* Top Visual Botanical Viewfinder Banner */}
        <div className="relative bg-gradient-to-br from-[#13281c] via-[#173524] to-[#0f2418] px-6 pt-6 pb-5 text-white overflow-hidden">
          {/* Subtle botanical grid pattern */}
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage:
                'radial-gradient(circle at 1px 1px, #bbf7d0 1px, transparent 0)',
              backgroundSize: '20px 20px'
            }}
          />

          <button
            type="button"
            onClick={onClose}
            aria-label={isUrdu ? 'بند کریں' : 'Close dialog'}
            className="absolute top-4 right-4 z-20 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-emerald-100 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Visual Camera + Tomato Leaf Illustration */}
          <div className="relative z-10 flex flex-col sm:flex-row items-center gap-5">
            <div className="relative w-28 h-28 shrink-0 rounded-2xl bg-[#0b1b12]/80 border border-emerald-400/40 shadow-inner flex items-center justify-center overflow-hidden">
              <svg
                viewBox="0 0 120 120"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-24 h-24"
                aria-hidden="true"
              >
                {/* Viewfinder corner brackets */}
                <path d="M16 32V20H28" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M104 32V20H92" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M16 88V100H28" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M104 88V100H92" stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

                {/* Botanical Tomato Leaflet Silhouette */}
                <path
                  d="M60 28C52 38 40 46 39 60C38 74 48 85 60 89C72 85 82 74 81 60C80 46 68 38 60 28Z"
                  fill="#15803d"
                  fillOpacity="0.9"
                  stroke="#86efac"
                  strokeWidth="1.8"
                />
                {/* Central & Lateral Leaf Veins */}
                <path d="M60 34V93" stroke="#dcfce7" strokeWidth="1.6" strokeLinecap="round" />
                <path d="M60 52L47 46M60 63L45 59M60 74L49 71" stroke="#bbf7d0" strokeWidth="1.3" strokeLinecap="round" />
                <path d="M60 52L73 46M60 63L75 59M60 74L71 71" stroke="#bbf7d0" strokeWidth="1.3" strokeLinecap="round" />

                {/* Optical Scan Sweep Line */}
                <line x1="22" y1="60" x2="98" y2="60" stroke="#6ee7b7" strokeWidth="1.8" strokeDasharray="3 3" />
                <circle cx="60" cy="60" r="14" stroke="#a7f3d0" strokeWidth="1.2" strokeOpacity="0.7" />
              </svg>

              {/* Corner camera indicator */}
              <div className="absolute bottom-1.5 right-1.5 w-6 h-6 rounded-lg bg-emerald-600 border border-emerald-300/60 flex items-center justify-center shadow-sm">
                <Camera className="w-3.5 h-3.5 text-white" />
              </div>
            </div>

            <div className={`text-center sm:text-left ${isUrdu ? 'sm:text-right' : ''} space-y-1.5`}>
              <div className="text-[11px] font-mono tracking-wider uppercase text-emerald-300 font-semibold">
                {isUrdu ? 'کیمرہ تک رسائی کی درخواست' : 'Camera Access Request'}
              </div>
              <h3
                id="camera-permission-title"
                className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug"
              >
                {isUrdu
                  ? 'ایگرو وژن اے آئی کو کیمرے کی اجازت کیوں درکار ہے؟'
                  : 'Allow Camera Access for Live Leaf Scanning'}
              </h3>
              <p className="text-xs sm:text-sm text-emerald-100/85 leading-relaxed">
                {isUrdu
                  ? 'آپ کا کیمرہ صرف ٹماٹر کے پتے کی لائیو تصویر لینے اور بیماری کی فوری جانچ کے لیے استعمال ہوگا۔'
                  : 'AgroVision AI uses your device camera only when you choose Live Camera mode to frame and photograph tomato leaves.'}
              </p>
            </div>
          </div>
        </div>

        {/* Body: 3 Clear Botanical Reasons */}
        <div className="p-6 space-y-3.5 overflow-y-auto">
          {reasons.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white border border-[#cbdcd0]"
              >
                <div className="w-10 h-10 rounded-xl bg-[#edf5ef] border border-emerald-200 text-[#15803d] flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div className={isUrdu ? 'text-right' : 'text-left'}>
                  <div className="font-display text-sm font-bold text-[#13281c]">
                    {item.title}
                  </div>
                  <p className="text-xs text-[#3d5947] mt-0.5 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}

          {/* Gentle Browser Prompt Note */}
          <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-[#f4f1e8] border border-[#cbdcd0] text-xs text-[#3d5947]">
            <CheckCircle2 className="w-4 h-4 text-[#15803d] shrink-0" />
            <span>
              {isUrdu
                ? 'اگلے مرحلے پر آپ کا براؤزر کیمرے کی باقاعدہ تصدیق طلب کرے گا۔ آپ کسی بھی وقت اجازت واپس لے سکتے ہیں۔'
                : 'Your browser will show its standard camera prompt next. You can revoke access or switch to Photo Upload anytime.'}
            </span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-white border-t border-[#cbdcd0] flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-2.5">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            {onSwitchToUpload && (
              <button
                type="button"
                onClick={onSwitchToUpload}
                className="px-3.5 py-2.5 text-xs font-semibold text-[#13281c] bg-[#f4f1e8] hover:bg-[#edf5ef] border border-[#cbdcd0] rounded-xl transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
              >
                <UploadCloud className="w-3.5 h-3.5 text-[#15803d]" />
                <span>{isUrdu ? 'تصویر اپلوڈ کریں' : 'Upload Photo Instead'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2.5 text-xs font-semibold text-[#3d5947] hover:text-[#13281c] hover:bg-[#f4f1e8] rounded-xl transition-colors whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
            >
              {isUrdu ? 'ابھی نہیں' : 'Not Now'}
            </button>
          </div>

          <button
            type="button"
            onClick={onAllowCamera}
            className="px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-[#15803d] hover:bg-emerald-800 rounded-xl shadow-sm transition-all active:scale-95 flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2"
          >
            <Camera className="w-4 h-4" />
            <span>{isUrdu ? 'کیمرے کی اجازت دیں' : 'Allow Camera Access'}</span>
          </button>
        </div>
        </div>
      </div>
    </div>,
    document.body
  );
};
