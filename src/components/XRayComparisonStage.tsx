import React, { useEffect, useRef, useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useMotion } from '../context/MotionContext';
import { ScrollReveal, WordReveal } from './ScrollReveal';

export const XRayComparisonStage: React.FC = () => {
  const { isUrdu } = useLanguage();
  const { calmMode } = useMotion();
  const [xrayPercent, setXrayPercent] = useState<number>(46);
  const [hasManualOverride, setHasManualOverride] = useState<boolean>(false);
  const xrayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (calmMode) {
      setXrayPercent(50);
      return;
    }

    let ticking = false;

    const handleScroll = () => {
      if (hasManualOverride || ticking) return;
      ticking = true;

      window.requestAnimationFrame(() => {
        if (xrayRef.current) {
          const rect = xrayRef.current.getBoundingClientRect();
          const viewH = window.innerHeight || 900;
          if (rect.bottom >= -120 && rect.top <= viewH + 120) {
            const progress = ((viewH - rect.top) / (viewH + rect.height)) * 115;
            setXrayPercent(Math.min(96, Math.max(4, progress)));
          }
        }
        ticking = false;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [calmMode, hasManualOverride]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasManualOverride(true);
    setXrayPercent(Number(e.target.value));
  };

  return (
    <div
      ref={xrayRef}
      className="bg-white rounded-3xl border border-[#cbdcd0] p-6 sm:p-8 lg:p-10 shadow-sm text-left"
    >
      <ScrollReveal direction="up" className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <div className="text-xs font-mono uppercase tracking-wider text-[#166534] font-semibold">
            {isUrdu ? 'اسکرول سے منسلک کمپیوٹر وژن معائنہ' : 'Scroll-Scrubbed Computer Vision'}
          </div>
          <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#13281c] tracking-tight mt-1 text-balance">
            <WordReveal
              text={
                isUrdu
                  ? 'دیکھیں کہ نیورل نیٹ ورک پتے میں بیماری کو کیسے الگ کرتا ہے'
                  : 'See what the neural network isolates'
              }
              stepDelayMs={45}
            />
          </h3>
        </div>

        <div className="flex flex-col sm:items-end gap-2">
          <p className="text-sm text-[#2f4739] max-w-md md:text-right leading-relaxed">
            {isUrdu
              ? 'قدرتی روشنی اور اے آئی لیژن ماسک کا موازنہ دیکھنے کے لیے نیچے اسکرول کریں یا سلائیڈر کھینچیں۔'
              : 'Scroll down or drag the divider to sweep between raw field lighting and lesion segmentation masks.'}
          </p>
          {hasManualOverride && !calmMode && (
            <button
              type="button"
              onClick={() => setHasManualOverride(false)}
              className="text-xs font-semibold text-[#166534] hover:text-[#13281c] underline underline-offset-4 self-start md:self-end cursor-pointer"
            >
              {isUrdu ? 'اسکرول سے خودکار حرکت بحال کریں' : 'Resume scroll-linked sweep'}
            </button>
          )}
        </div>
      </ScrollReveal>

      {/* Interactive Split X-Ray Viewport */}
      <div className="relative h-80 sm:h-96 rounded-2xl overflow-hidden border border-[#cbdcd0] select-none">
        {/* Base Layer: Natural Daylight RGB Capture */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#edf5ef] to-[#d4e6da] p-6 sm:p-8 flex flex-col justify-between">
          <div className="flex items-center justify-between gap-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/95 border border-[#cbdcd0] text-xs font-semibold text-[#13281c]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#166534]" />
              <span>{isUrdu ? 'قدرتی روشنی کی تصویر (RGB)' : 'Raw Field Capture (RGB)'}</span>
            </div>
            <span className="hidden sm:inline font-mono text-xs tabular-nums text-[#2f4739]">
              5500K Daylight
            </span>
          </div>

          {/* Centered Daylight Tomato Leaf Illustration */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <svg viewBox="0 0 360 220" className="w-64 sm:w-80 h-auto drop-shadow-sm" aria-hidden="true">
              <path
                d="M180 22 C232 54, 280 96, 266 150 C252 188, 212 204, 180 206 C148 204, 108 188, 94 150 C80 96, 128 54, 180 22 Z"
                fill="#1f7a3a"
              />
              <path
                d="M180 32 L180 202 M180 70 L232 52 M180 108 L244 88 M180 144 L236 128 M180 70 L128 52 M180 108 L116 88 M180 144 L124 128"
                stroke="#bbf7d0"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
              />
              <circle cx="216" cy="112" r="14" fill="#92400E" fillOpacity="0.45" />
              <circle cx="216" cy="112" r="8" fill="#78350F" fillOpacity="0.6" />
              <circle cx="144" cy="136" r="10" fill="#B45309" fillOpacity="0.38" />
            </svg>
          </div>

          <div className="relative z-10 max-w-sm bg-white/90 rounded-xl px-4 py-3 border border-[#cbdcd0]">
            <div className="text-sm sm:text-base font-bold text-[#13281c]">
              {isUrdu ? 'قدرتی پتے کی سطح' : 'Natural Leaf Surface'}
            </div>
            <p className="text-xs sm:text-sm text-[#2f4739] mt-0.5 leading-snug">
              {isUrdu
                ? 'نچلے پتوں پر بننے والے ہلکے گول دھبے اکثر فصل کے نقصان سے پہلے نظر انداز ہو جاتے ہیں۔'
                : 'Subtle concentric ring spots on lower foliage often go unnoticed until yield drops.'}
            </p>
          </div>
        </div>

        {/* Clipped Top Layer: AI Diagnostic X-Ray Segmentation Mask */}
        <div
          className="absolute inset-0 bg-[#13281c] text-[#edf5ef] p-6 sm:p-8 flex flex-col justify-between"
          style={{
            clipPath: `inset(0 ${100 - xrayPercent}% 0 0)`,
          }}
        >
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage:
                'linear-gradient(to right, rgba(134,239,172,0.22) 1px, transparent 1px), linear-gradient(to bottom, rgba(134,239,172,0.22) 1px, transparent 1px)',
              backgroundSize: '28px 28px',
            }}
          />

          <div className="relative z-10 flex items-center justify-between gap-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#166534]/70 border border-[#86efac]/40 text-xs font-mono text-[#dcfce7]">
              <span>
                {isUrdu ? 'اے آئی فیچر میپ · متاثرہ حصوں کی شناخت' : 'AI FEATURE MAP · LESION SEGMENTATION'}
              </span>
            </div>
            <span className="hidden sm:inline font-mono text-xs tabular-nums text-[#86efac]">
              HSV + DINOv2 Mask · 96.4% CONF
            </span>
          </div>

          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <svg viewBox="0 0 360 220" className="w-64 sm:w-80 h-auto" aria-hidden="true">
              <path
                d="M180 22 C232 54, 280 96, 266 150 C252 188, 212 204, 180 206 C148 204, 108 188, 94 150 C80 96, 128 54, 180 22 Z"
                fill="#16402a"
                stroke="#4ade80"
                strokeWidth="1.8"
                strokeDasharray="5 3"
              />
              <path
                d="M180 32 L180 202 M180 70 L232 52 M180 108 L244 88 M180 144 L236 128 M180 70 L128 52 M180 108 L116 88 M180 144 L124 128"
                stroke="#4ade80"
                strokeOpacity="0.65"
                strokeWidth="1.6"
                fill="none"
              />
              <rect
                x="196"
                y="92"
                width="40"
                height="40"
                rx="6"
                fill="rgba(217, 119, 6, 0.25)"
                stroke="#F59E0B"
                strokeWidth="2"
                strokeDasharray="4 2"
              />
              <circle cx="216" cy="112" r="9" fill="#D97706" fillOpacity="0.85" />
              <text x="200" y="87" fill="#FCD34D" fontSize="9" fontFamily="monospace" fontWeight="700">
                LESION #1 (96%)
              </text>

              <rect
                x="128"
                y="120"
                width="32"
                height="32"
                rx="6"
                fill="rgba(217, 119, 6, 0.22)"
                stroke="#F59E0B"
                strokeWidth="1.8"
                strokeDasharray="4 2"
              />
              <circle cx="144" cy="136" r="6.5" fill="#D97706" fillOpacity="0.8" />
            </svg>
          </div>

          <div className="relative z-10 max-w-md bg-[#16402a]/90 rounded-xl px-4 py-3 border border-[#4ade80]/30">
            <div className="text-sm sm:text-base font-bold text-white flex flex-wrap items-center gap-2">
              <span>Alternaria solani</span>
              <span aria-hidden="true" className="text-[#86efac]">·</span>
              <span className="font-mono text-xs sm:text-sm tabular-nums text-[#86efac]">
                {isUrdu ? '14.2% متاثرہ حصہ' : '14.2% Affected Area'}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#dcfce7] mt-0.5 leading-snug">
              {isUrdu
                ? 'فوری اور درست علاج کے لیے پیلے ہالے اور گول بھورے دھبوں کی الگ شناخت مکمل۔'
                : 'Chlorotic halo and necrotic bullseye pattern isolated for immediate targeted care.'}
            </p>
          </div>
        </div>

        {/* Vertical Divider Handle */}
        <div
          aria-hidden="true"
          className="absolute top-0 bottom-0 w-[2px] bg-[#4ade80] shadow-[0_0_12px_rgba(74,222,128,0.85)] pointer-events-none z-20"
          style={{ left: `${xrayPercent}%` }}
        >
          <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-[#166534] border-2 border-[#bbf7d0] text-white flex items-center justify-center text-[10px] font-mono font-bold shadow-md">
            AI
          </div>
        </div>

        {/* Accessible Interactive Range Input Overlay */}
        <input
          type="range"
          min={4}
          max={96}
          value={Math.round(xrayPercent)}
          onChange={handleSliderChange}
          aria-label={isUrdu ? 'اے آئی تشخیصی ماسک کا موازنہ' : 'Scrub AI diagnostic mask'}
          className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
        />
      </div>

      {/* Bottom Metric Strip */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-[#2f4739] font-mono tabular-nums">
        <span>
          {isUrdu
            ? `موازنہ پوزیشن: ${Math.round(xrayPercent)}%`
            : `Mask Sweep Position: ${Math.round(xrayPercent)}%`}
        </span>
        <span>
          {isUrdu ? 'رنگوں کا تجزیہ + متاثرہ دھبوں کی حدود' : 'HSV Color Isolation + Necrotic Boundary Segmentation'}
        </span>
      </div>
    </div>
  );
};
