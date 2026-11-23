import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

/**
 * InitialSiteLoader
 *
 * Full-viewport botanical overlay shown on initial website load.
 * Displays an organic tomato leaf emblem with animated veins, rotating orbital ring,
 * and live readiness progress bar, then smoothly fades out cleanly.
 */
export const InitialSiteLoader: React.FC = () => {
  const { isUrdu } = useLanguage();
  const [progress, setProgress] = useState(18);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isUnmounted, setIsUnmounted] = useState(false);

  useEffect(() => {
    let mounted = true;
    let current = 18;
    let fadeTimer = 0;
    let unmountTimer = 0;

    const finishLoading = () => {
      if (!mounted) return;
      setProgress(100);
      fadeTimer = window.setTimeout(() => {
        if (!mounted) return;
        setIsFadingOut(true);
        unmountTimer = window.setTimeout(() => {
          if (mounted) setIsUnmounted(true);
        }, 420);
      }, 160);
    };

    const progressTimer = window.setInterval(() => {
      if (!mounted) return;
      current = Math.min(92, current + Math.floor(Math.random() * 18) + 12);
      setProgress(current);
    }, 90);

    const checkReady = async () => {
      try {
        if (document.fonts && document.fonts.ready) {
          await Promise.race([
            document.fonts.ready,
            new Promise((resolve) => setTimeout(resolve, 450))
          ]);
        }
      } catch {
        // Ignore font readiness checks if unsupported
      }

      const minDisplayDelay = new Promise((resolve) => setTimeout(resolve, 520));
      const windowLoaded =
        document.readyState === 'complete'
          ? Promise.resolve()
          : new Promise<void>((resolve) => {
              const onLoad = () => {
                window.removeEventListener('load', onLoad);
                resolve();
              };
              window.addEventListener('load', onLoad, { once: true });
              setTimeout(resolve, 750);
            });

      await Promise.all([minDisplayDelay, windowLoaded]);
      window.clearInterval(progressTimer);
      finishLoading();
    };

    checkReady();

    return () => {
      mounted = false;
      window.clearInterval(progressTimer);
      if (fadeTimer) window.clearTimeout(fadeTimer);
      if (unmountTimer) window.clearTimeout(unmountTimer);
    };
  }, []);

  if (isUnmounted) return null;

  return (
    <div
      aria-label={isUrdu ? 'ایگرو وژن اے آئی لوڈ ہو رہا ہے' : 'Loading AgroVision AI'}
      role="status"
      className={`fixed inset-0 z-[9999] bg-[#faf8f2] flex flex-col items-center justify-center px-6 transition-opacity duration-400 ease-out select-none ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Subtle soft botanical backdrop glow */}
      <div className="absolute w-80 h-80 rounded-full bg-emerald-200/35 blur-3xl pointer-events-none" />

      <div className="relative flex flex-col items-center max-w-xs w-full text-center">
        {/* Animated Botanical Leaf Emblem */}
        <div className="relative w-24 h-24 mb-6 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-2 border-dashed border-emerald-600/30 animate-reticle-spin" />
          <div className="w-18 h-18 rounded-2xl bg-[#edf5ef] border border-emerald-300/80 shadow-md flex items-center justify-center">
            <div className="animate-leaf-sway">
              <svg
                width="42"
                height="42"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M24 2C24 2 13 10 10 22C7 34 16 44 24 46C32 44 41 34 38 22C35 10 24 2 24 2Z"
                  fill="#15803d"
                />
                <path
                  d="M24 6V44"
                  stroke="#faf8f2"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
                <path
                  d="M24 16L16 12M24 22L13 18M24 28L15 25M24 34L17 32M24 16L32 12M24 22L35 18M24 28L33 25M24 34L31 32"
                  stroke="#faf8f2"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                  strokeOpacity="0.85"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Brand Wordmark */}
        <div className="font-display text-2xl font-extrabold tracking-tight text-[#13281c] mb-1">
          {isUrdu ? 'ایگرو وژن ' : 'AgroVision '}
          <span className="text-emerald-700">AI</span>
        </div>
        <p className="text-xs font-sans text-[#3d5947] mb-5">
          {isUrdu
            ? 'نباتاتی تشخیصی اسٹوڈیو تیار کیا جا رہا ہے...'
            : 'Preparing botanical pathology studio...'}
        </p>

        {/* Smooth Progress Indicator Bar & Percentage */}
        <div className="w-full space-y-2">
          <div className="w-full h-2 rounded-full bg-[#e2ece5] border border-[#cbdcd0] overflow-hidden p-0.5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#15803d] via-emerald-600 to-[#064e3b] transition-all duration-200 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] font-mono font-semibold text-[#3d5947] tabular-nums">
            <span>{isUrdu ? 'اثاثے لوڈ ہو رہے ہیں' : 'Loading Assets'}</span>
            <span className="text-emerald-900">{progress}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
