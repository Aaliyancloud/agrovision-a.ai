import React, { Suspense, lazy, useEffect, useRef, useState } from 'react';
import {
  Camera,
  Upload,
  Play,
  ArrowDown,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useMotion } from '../context/MotionContext';
import { BotanicalBranchesOverlay } from './BotanicalBranchesOverlay';

const HeroPlantCanvas = lazy(() =>
  import('./3d/HeroPlantCanvas').then((m) => ({ default: m.HeroPlantCanvas }))
);
const VideoTutorialModal = lazy(() =>
  import('./VideoTutorialModal').then((m) => ({ default: m.VideoTutorialModal }))
);

interface HeroTypewriterProps {
  phrases: string[];
  calmMode: boolean;
}

const HeroTypewriter: React.FC<HeroTypewriterProps> = ({ phrases, calmMode }) => {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [displayedCount, setDisplayedCount] = useState(() =>
    calmMode ? phrases[0]?.length ?? 0 : 0
  );
  const [isDeleting, setIsDeleting] = useState(false);
  const phrasesKey = phrases.join('|');

  useEffect(() => {
    setPhraseIndex(0);
    setIsDeleting(false);
    setDisplayedCount(calmMode ? phrases[0]?.length ?? 0 : 0);
  }, [phrasesKey, calmMode]);

  useEffect(() => {
    if (calmMode) return;
    const currentPhrase = phrases[phraseIndex % phrases.length] ?? '';

    if (!isDeleting && displayedCount < currentPhrase.length) {
      const id = window.setTimeout(() => {
        setDisplayedCount((c) => c + 1);
      }, 64);
      return () => window.clearTimeout(id);
    }

    if (!isDeleting && displayedCount === currentPhrase.length) {
      const id = window.setTimeout(() => {
        setIsDeleting(true);
      }, 2150);
      return () => window.clearTimeout(id);
    }

    if (isDeleting && displayedCount > 0) {
      const id = window.setTimeout(() => {
        setDisplayedCount((c) => c - 1);
      }, 34);
      return () => window.clearTimeout(id);
    }

    if (isDeleting && displayedCount === 0) {
      const id = window.setTimeout(() => {
        setIsDeleting(false);
        setPhraseIndex((idx) => (idx + 1) % phrases.length);
      }, 220);
      return () => window.clearTimeout(id);
    }
  }, [calmMode, phrases, phraseIndex, displayedCount, isDeleting]);

  const activeText = calmMode
    ? phrases.join(' ')
    : (phrases[phraseIndex % phrases.length] ?? '').slice(0, displayedCount);

  return (
    <span className="inline-flex items-baseline min-h-[1.18em] text-[#166534]">
      <span>{activeText}</span>
      {!calmMode && (
        <span
          aria-hidden="true"
          className="inline-block w-[3px] h-[0.86em] bg-[#166534] ml-1.5 rounded-full animate-pulse align-baseline"
        />
      )}
    </span>
  );
};

/** Lightweight instant SVG placeholder while Three.js loads in background */
const BotanicalPlantSkeleton: React.FC<{ isUrdu: boolean }> = ({ isUrdu }) => (
  <div className="w-full h-full flex flex-col items-center justify-center relative select-none pointer-events-none">
    <div className="relative flex flex-col items-center justify-center">
      <div className="w-60 h-60 sm:w-72 sm:h-72 rounded-full bg-radial from-[#cbdcd0]/50 via-[#edf5ef]/35 to-transparent flex items-center justify-center">
        <svg
          viewBox="0 0 220 280"
          className="w-44 h-56 sm:w-52 sm:h-64 drop-shadow-sm animate-gentle-float"
          aria-hidden="true"
        >
          {/* Soft ground shadow */}
          <ellipse cx="110" cy="250" rx="56" ry="12" fill="#13281c" fillOpacity="0.12" />
          {/* Terracotta pot */}
          <path d="M76 206 L144 206 L134 250 L86 250 Z" fill="#bf6747" />
          <rect x="70" y="198" width="80" height="10" rx="5" fill="#cf7655" />
          {/* Main stem */}
          <path
            d="M110 198 C112 162, 105 130, 112 96 C116 74, 108 54, 110 38"
            stroke="#166534"
            strokeWidth="5.5"
            strokeLinecap="round"
            fill="none"
          />
          {/* Leaves */}
          <g className="animate-leaf-sway-subtle" style={{ transformOrigin: '110px 140px' }}>
            <path
              d="M110 160 C82 146, 56 154, 48 168 C68 178, 92 174, 110 160 Z"
              fill="#1f7a3a"
            />
            <path
              d="M111 132 C140 116, 168 124, 176 140 C156 150, 130 146, 111 132 Z"
              fill="#1f7a3a"
            />
            <path
              d="M109 104 C80 86, 54 94, 46 112 C68 122, 92 118, 109 104 Z"
              fill="#2d8a4b"
            />
            <path
              d="M111 76 C138 60, 162 66, 170 82 C152 92, 128 88, 111 76 Z"
              fill="#2d8a4b"
            />
          </g>
          {/* Cherry/Tomato accents */}
          <circle cx="128" cy="150" r="11" fill="#df2b18" />
          <circle cx="144" cy="144" r="8" fill="#df2b18" />
          <circle cx="94" cy="122" r="9.5" fill="#df2b18" />
        </svg>
      </div>
      <div className="mt-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-[#cbdcd0] text-[11px] font-mono text-[#13281c] shadow-xs flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full border-2 border-[#166534]/30 border-t-[#166534] animate-spin" />
        <span>{isUrdu ? 'تھری ڈی پودا تیار ہو رہا ہے...' : 'Preparing Interactive 3D Plant...'}</span>
      </div>
    </div>
  </div>
);

interface HeroProps {
  onOpenCameraClick: () => void;
  onDirectUploadFile: (file: File) => void;
  onScanClick: () => void;
  onExploreTechClick?: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onOpenCameraClick,
  onDirectUploadFile,
  onScanClick,
  onExploreTechClick,
}) => {
  const { t, isUrdu } = useLanguage();
  const { calmMode } = useMotion();
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [is3DReady, setIs3DReady] = useState(false);
  const heroFileInputRef = useRef<HTMLInputElement>(null);

  // Preload 3D Tomato Plant chunk immediately in parallel without blocking initial render
  useEffect(() => {
    const prefetch = () => {
      void import('./3d/HeroPlantCanvas');
    };
    const win = window as Window & {
      requestIdleCallback?: (fn: () => void, opts?: { timeout: number }) => number;
    };
    if (typeof win.requestIdleCallback === 'function') {
      win.requestIdleCallback(prefetch, { timeout: 180 });
    } else {
      window.setTimeout(prefetch, 10);
    }

    // Guarantee crossfade completes cleanly under 1.8s even on slow/throttled mobile GPUs
    const safetyTimer = window.setTimeout(() => {
      setIs3DReady(true);
    }, 1750);

    return () => window.clearTimeout(safetyTimer);
  }, []);

  const handleHeroFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onDirectUploadFile(file);
    }
    e.target.value = '';
  };

  const typewriterPhrases = isUrdu
    ? ['ذہین دیکھ بھال۔', 'صحت مند پودے۔']
    : ['Smarter Care.', 'Thriving Plants.'];

  return (
    <section className="relative z-0 w-full bg-[#faf8f2] bg-botanical-veins text-[#13281c] overflow-hidden border-b border-[#cbdcd0]">
      {/* Animated Sprouting Botanical Branches on Mobile & Laptop (Strictly Below Navbar) */}
      <BotanicalBranchesOverlay variant="hero" />

      {/* Hidden Direct File Picker */}
      <input
        ref={heroFileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/*"
        onChange={handleHeroFileChange}
        className="hidden"
        aria-label={isUrdu ? 'ٹماٹر کے پتے کی تصویر منتخب کریں' : 'Upload tomato leaf photo'}
      />

      <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-7 sm:pt-10 pb-10 sm:pb-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          {/* Left Column: Clean Domain Kicker, Typewriter Headline & Action Buttons */}
          <div className="lg:col-span-5 flex flex-col gap-5 text-left">
            <div
              className="stagger-reveal text-xs font-mono font-semibold text-[#166534] tracking-wide uppercase"
              style={{ '--stagger-delay': '0ms' } as React.CSSProperties}
            >
              {t.hero.kickerDomain}
            </div>

            {/* Expressive Display Headline with Smooth Typewriter */}
            <h1 className="font-display text-[clamp(2.2rem,4vw,3.4rem)] font-extrabold tracking-tight text-[#13281c] leading-[1.12] text-balance">
              <span className="block">
                {isUrdu ? 'ٹماٹر کے پودوں کا تحفظ —' : 'Tomato Plant Health.'}
              </span>
              <HeroTypewriter phrases={typewriterPhrases} calmMode={calmMode} />
            </h1>

            {/* Concise Supporting Copy */}
            <p
              className="stagger-reveal text-[15px] sm:text-base text-[#2f4739] max-w-xl leading-relaxed"
              style={{ '--stagger-delay': '180ms' } as React.CSSProperties}
            >
              {t.hero.description}
            </p>

            {/* Primary CTA Buttons */}
            <div
              className="stagger-reveal flex flex-wrap items-center gap-2.5 sm:gap-3 pt-1"
              style={{ '--stagger-delay': '260ms' } as React.CSSProperties}
            >
              <button
                type="button"
                onClick={onScanClick}
                className="btn-botanical-sheen group inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#166534] hover:bg-[#14532d] text-white font-semibold text-sm shadow-lg shadow-[#13281c]/15 transition-all duration-200 hover:-translate-y-0.5 active:scale-95 cursor-pointer whitespace-nowrap shrink-0"
              >
                <Sparkles className="w-4 h-4 text-[#bbf7d0] shrink-0" />
                <span>{t.hero.scanBtn}</span>
              </button>

              <button
                type="button"
                onClick={onOpenCameraClick}
                className="inline-flex items-center gap-2 px-4.5 py-3 rounded-xl bg-white hover:bg-[#edf5ef] text-[#13281c] border border-[#cbdcd0] font-semibold text-sm transition-all duration-200 hover:-translate-y-0.5 active:scale-95 cursor-pointer whitespace-nowrap shrink-0"
              >
                <Camera className="w-4 h-4 text-[#166534] shrink-0" />
                <span>{isUrdu ? 'کیمرہ کھولیں' : 'Camera Scan'}</span>
              </button>

              <button
                type="button"
                onClick={() => heroFileInputRef.current?.click()}
                className="inline-flex items-center gap-2 px-4.5 py-3 rounded-xl bg-white hover:bg-[#edf5ef] text-[#13281c] border border-[#cbdcd0] font-semibold text-sm transition-all duration-200 hover:-translate-y-0.5 active:scale-95 cursor-pointer whitespace-nowrap shrink-0"
              >
                <Upload className="w-4 h-4 text-[#166534] shrink-0" />
                <span>{isUrdu ? 'تصویر اپلوڈ' : 'Upload Photo'}</span>
              </button>

              <button
                type="button"
                onClick={() => setIsVideoModalOpen(true)}
                className="inline-flex items-center gap-2 px-3.5 py-3 rounded-xl text-[#14532d] hover:bg-[#edf5ef] text-sm font-medium transition-all duration-200 cursor-pointer whitespace-nowrap shrink-0"
              >
                <Play className="w-3.5 h-3.5 fill-[#166534] text-[#166534] shrink-0" />
                <span>{t.hero.videoGuideBtn}</span>
              </button>
            </div>

            {/* Unified Metric Strip */}
            <div
              className="stagger-reveal pt-4 mt-1 border-t border-[#cbdcd0] grid grid-cols-3 gap-3 sm:gap-4"
              style={{ '--stagger-delay': '340ms' } as React.CSSProperties}
            >
              <div>
                <div className="font-mono tabular-nums text-base sm:text-lg font-bold text-[#14532d]">
                  {t.hero.accuracyLabel}
                </div>
                <div className="text-[11px] sm:text-xs text-[#2f4739] mt-0.5">
                  {t.hero.accuracySub}
                </div>
              </div>

              <div>
                <div className="font-mono tabular-nums text-base sm:text-lg font-bold text-[#14532d]">
                  {t.hero.diseasesLabel}
                </div>
                <div className="text-[11px] sm:text-xs text-[#2f4739] mt-0.5">
                  {t.hero.diseasesSub}
                </div>
              </div>

              <div>
                <div className="font-mono tabular-nums text-base sm:text-lg font-bold text-[#14532d]">
                  {t.hero.instantLabel}
                </div>
                <div className="text-[11px] sm:text-xs text-[#2f4739] mt-0.5 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-[#166534] shrink-0 hidden sm:inline" />
                  <span>{t.hero.instantSub}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Seamless, Borderless Transparent Interactive 3D Tomato Plant Below Navbar */}
          <div className="lg:col-span-7 relative z-0">
            <div className="relative z-0 w-full h-[500px] sm:h-[560px] lg:h-[620px] bg-transparent overflow-hidden">
              {/* Instant Botanical SVG Placeholder that fades cleanly once Frame 1 renders */}
              <div
                aria-hidden="true"
                className={`absolute inset-0 transition-opacity duration-500 ${
                  is3DReady ? 'opacity-0 pointer-events-none' : 'opacity-100'
                }`}
              >
                <BotanicalPlantSkeleton isUrdu={isUrdu} />
              </div>

              <div
                className={`w-full h-full transition-opacity duration-500 ${
                  is3DReady ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <Suspense fallback={null}>
                  <HeroPlantCanvas
                    onScanClick={onScanClick}
                    onOpenVideo={() => setIsVideoModalOpen(true)}
                    onSceneReady={() => setIs3DReady(true)}
                  />
                </Suspense>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Scroll Discovery Link */}
        <div
          className="mt-6 flex justify-center transition-opacity duration-300"
          style={calmMode ? undefined : { opacity: 0.95 }}
        >
          <a
            href="#why-leaves"
            onClick={(e) => {
              if (onExploreTechClick) {
                e.preventDefault();
                onExploreTechClick();
              }
            }}
            className="inline-flex items-center gap-2 text-xs font-medium text-[#2f4739] hover:text-[#14532d] transition-colors group"
          >
            <span>{t.hero.scrollPrompt}</span>
            <ArrowDown className="w-3.5 h-3.5 text-[#166534] animate-scroll-nudge" />
          </a>
        </div>
      </div>

      {/* Video Tutorial Modal */}
      {isVideoModalOpen && (
        <Suspense fallback={null}>
          <VideoTutorialModal
            isOpen={isVideoModalOpen}
            onClose={() => setIsVideoModalOpen(false)}
            onTryScanner={onScanClick}
          />
        </Suspense>
      )}
    </section>
  );
};
