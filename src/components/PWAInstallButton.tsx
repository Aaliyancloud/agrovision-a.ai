import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import {
  Download,
  Smartphone,
  WifiOff,
  CheckCircle2,
  X,
  Share,
  Copy,
  Check,
  FileArchive,
  ExternalLink
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { useLanguage } from '../context/LanguageContext';

export const PWAInstallButton: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { isInstallable, isInstalled, isIOS, isAndroid, install } = usePWAInstall();
  const { isUrdu } = useLanguage();
  const [showInstallGuide, setShowInstallGuide] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  if (isInstalled) {
    return null;
  }

  const handleClick = () => {
    setShowInstallGuide(true);
  };

  const handleCopyAppUrl = async () => {
    try {
      await navigator.clipboard.writeText(window.location.origin + '/?mode=app');
      setCopiedUrl(true);
      window.setTimeout(() => setCopiedUrl(false), 2200);
    } catch {
      // Ignore clipboard restrictions
    }
  };

  const handleOpenMobileApp = () => {
    setShowInstallGuide(false);
    window.dispatchEvent(new CustomEvent('agrovision-open-app'));
  };

  const modalPortal =
    showInstallGuide && typeof document !== 'undefined'
      ? createPortal(
          <div
            className="fixed inset-0 z-[120] flex items-center justify-center bg-black/55 backdrop-blur-xs p-4 overflow-y-auto"
            onClick={() => setShowInstallGuide(false)}
          >
            <div
              dir={isUrdu ? 'rtl' : 'ltr'}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md my-auto rounded-2xl bg-[#faf8f2] border border-[#cbdcd0] p-5 sm:p-6 shadow-2xl text-[#13281c] space-y-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold uppercase tracking-wider text-[#166534] mb-1">
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>{isUrdu ? 'موبائل ایپ اور اینڈرائیڈ پیکج' : 'Mobile App & Android Package'}</span>
                  </div>
                  <h3 className="font-display text-lg sm:text-xl font-bold text-[#13281c]">
                    {isUrdu
                      ? 'ایگرو وژن اے آئی موبائل ایپ'
                      : 'AgroVision AI Mobile App'}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowInstallGuide(false)}
                  className="p-1.5 rounded-lg bg-[#edf5ef] text-[#3d5947] hover:text-[#13281c] cursor-pointer shrink-0"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {isInstallable && (
                <button
                  type="button"
                  onClick={async () => {
                    const accepted = await install();
                    if (accepted) setShowInstallGuide(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#14532d] hover:bg-[#13281c] px-4 py-3 text-xs sm:text-sm font-bold text-white shadow-sm transition-colors cursor-pointer"
                >
                  <Download className="w-4 h-4 text-[#bbf7d0] shrink-0" />
                  <span>
                    {isUrdu
                      ? 'فون / ڈیوائس پر ابھی انسٹال کریں'
                      : 'Install App Directly to Home Screen'}
                  </span>
                </button>
              )}

              {/* Direct App Launch & Android Zip File Download */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={handleOpenMobileApp}
                  className="flex items-center justify-center gap-2 rounded-xl bg-[#166534] hover:bg-[#14532d] px-3.5 py-2.5 text-xs font-bold text-white shadow-xs transition-colors cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-[#bbf7d0] shrink-0" />
                  <span>{isUrdu ? 'موبائل ایپ کھولیں' : 'Open Mobile App'}</span>
                </button>

                <a
                  href="/downloads/AgroVision-AI-Android-App.zip"
                  download="AgroVision-AI-Android-App.zip"
                  className="flex items-center justify-center gap-2 rounded-xl bg-white hover:bg-[#edf5ef] border border-[#166534]/40 px-3.5 py-2.5 text-xs font-bold text-[#14532d] shadow-xs transition-colors cursor-pointer"
                >
                  <FileArchive className="w-3.5 h-3.5 text-[#166534] shrink-0" />
                  <span>{isUrdu ? 'اینڈرائیڈ فائل (.zip)' : 'Download Android (.zip)'}</span>
                </a>
              </div>

              {isIOS ? (
                <div className="rounded-xl bg-white border border-[#cbdcd0] p-4 text-sm text-[#2f4739] space-y-2.5 leading-relaxed">
                  <p className="font-semibold text-[#13281c] flex items-center gap-1.5">
                    <Share className="w-4 h-4 text-[#166534] shrink-0" />
                    <span>{isUrdu ? 'آئی فون / آئی پیڈ (Safari):' : 'iPhone / iPad (Safari):'}</span>
                  </p>
                  <ol className="list-decimal list-inside space-y-1.5 text-xs sm:text-sm">
                    {isUrdu ? (
                      <>
                        <li>
                          سفاری کے نیچے <strong>Share</strong> آئیکن پر ٹیپ کریں۔
                        </li>
                        <li>
                          نیچے اسکرول کر کے <strong>Add to Home Screen</strong> منتخب کریں۔
                        </li>
                        <li>
                          اوپر دائیں جانب <strong>Add</strong> دبائیں — ایپ ہوم اسکرین پر آجائے گی۔
                        </li>
                      </>
                    ) : (
                      <>
                        <li>
                          Tap the <strong>Share</strong> icon in Safari’s toolbar.
                        </li>
                        <li>
                          Scroll down and tap <strong>Add to Home Screen</strong>.
                        </li>
                        <li>
                          Tap <strong>Add</strong> — launch anytime from your home screen.
                        </li>
                      </>
                    )}
                  </ol>
                </div>
              ) : (
                <div className="rounded-xl bg-white border border-[#cbdcd0] p-4 text-sm text-[#2f4739] space-y-2.5 leading-relaxed">
                  <p className="font-semibold text-[#13281c]">
                    {isAndroid
                      ? isUrdu
                        ? 'اینڈرائیڈ (Chrome / Edge / Samsung Browser):'
                        : 'Android Home Screen App (Chrome / Edge):'
                      : isUrdu
                      ? 'فون یا ڈیسک ٹاپ پر انسٹال:'
                      : 'Install on Phone or Desktop:'}
                  </p>
                  <ol className="list-decimal list-inside space-y-1.5 text-xs sm:text-sm">
                    {isUrdu ? (
                      <>
                        <li>
                          براؤزر مینو (<strong>⋮</strong> یا <strong>≡</strong>) کھولیں۔
                        </li>
                        <li>
                          <strong>Install app</strong> یا <strong>Add to Home screen</strong> منتخب کریں۔
                        </li>
                        <li>
                          یا اینڈرائیڈ اسٹوڈیو میں APK بنانے کے لیے اوپر دی گئی <strong>.zip</strong> فائل ڈاؤنلوڈ کریں۔
                        </li>
                      </>
                    ) : (
                      <>
                        <li>
                          Tap browser menu (<strong>⋮</strong> in Chrome or <strong>≡</strong> in Samsung Internet).
                        </li>
                        <li>
                          Tap <strong>Install app</strong> or <strong>Add to Home screen</strong>.
                        </li>
                        <li>
                          Or download the Android Kotlin source <strong>.zip</strong> above to build an APK in Android Studio / GitHub Actions.
                        </li>
                      </>
                    )}
                  </ol>
                </div>
              )}

              <button
                type="button"
                onClick={handleCopyAppUrl}
                className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-[#edf5ef] border border-[#cbdcd0] text-xs font-semibold text-[#13281c] cursor-pointer"
              >
                {copiedUrl ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[#166534]" />
                    <span>{isUrdu ? 'ایپ لنک کاپی ہوگیا' : 'Mobile App Link Copied'}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-[#166534]" />
                    <span>{isUrdu ? 'براہِ راست ایپ لنک کاپی کریں' : 'Copy Direct Mobile App Link'}</span>
                  </>
                )}
              </button>

              <div className="rounded-xl bg-[#edf5ef] border border-[#cbdcd0] p-3.5 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-[#14532d]">
                  <WifiOff className="w-4 h-4 text-[#166534] shrink-0" />
                  <span>{isUrdu ? 'آف لائن فیلڈ ایپ تیار ہے' : 'Offline Field Mode Ready'}</span>
                </div>
                <p className="text-xs text-[#2f4739] leading-relaxed flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#166534] shrink-0 mt-0.5" />
                  <span>
                    {isUrdu
                      ? 'سروس ورکر ایپ، فیلڈ ریکارڈ، کیئر لائبریری، اور لوکل لیف اسکینر کو آف لائن محفوظ رکھتا ہے۔'
                      : 'The Service Worker caches the app shell, Field Log, Care Library, PDF reports, and local leaf scanner for offline field use.'}
                  </span>
                </p>
              </div>
            </div>
          </div>,
          document.body
        )
      : null;

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className={`inline-flex items-center gap-1.5 rounded-xl border border-emerald-300/90 bg-[#edf5ef] hover:bg-emerald-100 text-[#14532d] font-semibold transition-all shadow-xs active:scale-95 shrink-0 whitespace-nowrap cursor-pointer ${
          compact ? 'px-2.5 py-1.5 text-[11px] sm:text-xs sm:py-2' : 'px-3.5 py-2.5 text-xs sm:text-sm'
        }`}
        title={
          isUrdu
            ? 'ایپ کھولیں یا اینڈرائیڈ پروجیکٹ ڈاؤنلوڈ کریں'
            : 'Open Mobile App or download Android package'
        }
      >
        {isIOS ? (
          <Smartphone className="w-3.5 h-3.5 text-[#166534] shrink-0" />
        ) : (
          <Download className="w-3.5 h-3.5 text-[#166534] shrink-0" />
        )}
        <span className={compact ? 'hidden sm:inline' : 'inline'}>
          {isUrdu ? 'ایپ انسٹال' : 'Install App'}
        </span>
        {compact && (
          <span className="sm:hidden">
            {isUrdu ? 'انسٹال' : 'Install'}
          </span>
        )}
      </button>
      {modalPortal}
    </>
  );
};
