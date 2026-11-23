import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useMotion } from '../context/MotionContext';

function getMaxScrollY(buttonEl: HTMLElement | null): number {
  let max = Math.max(
    window.scrollY || 0,
    window.pageYOffset || 0,
    document.scrollingElement?.scrollTop || 0,
    document.documentElement?.scrollTop || 0,
    document.body?.scrollTop || 0
  );

  let parent = buttonEl?.parentElement ?? null;
  while (parent) {
    if (parent.scrollTop > max) {
      max = parent.scrollTop;
    }
    parent = parent.parentElement;
  }
  return max;
}

export const ScrollToTopButton: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isFlying, setIsFlying] = useState(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const { isUrdu } = useLanguage();
  const { calmMode } = useMotion();

  useEffect(() => {
    const checkScroll = () => {
      const y = getMaxScrollY(buttonRef.current);
      setIsVisible(y > 200);
    };

    window.addEventListener('scroll', checkScroll, { passive: true });
    document.addEventListener('scroll', checkScroll, { passive: true, capture: true });
    checkScroll();

    return () => {
      window.removeEventListener('scroll', checkScroll);
      document.removeEventListener('scroll', checkScroll, { capture: true });
      if (animFrameRef.current !== null) {
        window.cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  const scrollToTop = () => {
    if (animFrameRef.current !== null) {
      window.cancelAnimationFrame(animFrameRef.current);
    }

    const prefersReducedMotion = calmMode || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const startWindowY = Math.max(
      window.scrollY || 0,
      window.pageYOffset || 0,
      document.scrollingElement?.scrollTop || 0,
      document.documentElement?.scrollTop || 0,
      document.body?.scrollTop || 0
    );

    const scrollableAncestors: Array<{ el: HTMLElement; startTop: number }> = [];
    let parent = buttonRef.current?.parentElement ?? null;
    while (parent) {
      if (parent.scrollTop > 0) {
        scrollableAncestors.push({ el: parent, startTop: parent.scrollTop });
      }
      parent = parent.parentElement;
    }

    const totalDistance = Math.max(
      startWindowY,
      ...scrollableAncestors.map((item) => item.startTop),
      0
    );

    if (prefersReducedMotion || totalDistance <= 0) {
      window.scrollTo(0, 0);
      if (document.scrollingElement) document.scrollingElement.scrollTop = 0;
      if (document.documentElement) document.documentElement.scrollTop = 0;
      if (document.body) document.body.scrollTop = 0;
      for (const item of scrollableAncestors) {
        item.el.scrollTop = 0;
      }
      return;
    }

    setIsFlying(true);

    const duration = Math.min(880, Math.max(460, totalDistance * 0.24));
    const startTime = performance.now();

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      const ease =
        progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;
      const factor = 1 - ease;

      const nextWinY = Math.round(startWindowY * factor);
      window.scrollTo(0, nextWinY);
      if (document.scrollingElement) document.scrollingElement.scrollTop = nextWinY;
      if (document.documentElement) document.documentElement.scrollTop = nextWinY;
      if (document.body) document.body.scrollTop = nextWinY;

      for (const item of scrollableAncestors) {
        item.el.scrollTop = Math.round(item.startTop * factor);
      }

      if (progress < 1) {
        animFrameRef.current = window.requestAnimationFrame(step);
      } else {
        window.scrollTo(0, 0);
        if (document.scrollingElement) document.scrollingElement.scrollTop = 0;
        if (document.documentElement) document.documentElement.scrollTop = 0;
        if (document.body) document.body.scrollTop = 0;
        for (const item of scrollableAncestors) {
          item.el.scrollTop = 0;
        }
        animFrameRef.current = null;
        window.setTimeout(() => setIsFlying(false), 180);
      }
    };

    animFrameRef.current = window.requestAnimationFrame(step);
  };

  if (!isVisible && !isFlying) return null;

  return (
    <button
      ref={buttonRef}
      type="button"
      dir="ltr"
      onClick={scrollToTop}
      aria-label={isUrdu ? 'اوپر جائیں' : 'Fly back to top'}
      title={isUrdu ? 'اوپر جائیں' : 'Back to Top'}
      style={{
        left: 'auto',
        right: 'max(1.25rem, env(safe-area-inset-right, 1.25rem))',
      }}
      className={`fixed bottom-5 right-5 sm:bottom-7 sm:right-7 left-auto z-[60] group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#86efac] rounded-full cursor-pointer animate-in fade-in zoom-in-75 duration-300 ${
        isFlying ? 'pigeon-flying' : ''
      }`}
    >
      <div
        className={`relative flex flex-col items-center transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
          isFlying
            ? '-translate-y-4 scale-110'
            : 'group-hover:-translate-y-2 group-hover:scale-105 active:scale-95'
        }`}
      >
        {/* Soft Emerald-Moonlight Halo Behind the Flying Pigeon */}
        <div
          aria-hidden="true"
          className="absolute inset-0 rounded-full bg-emerald-400/25 blur-xl opacity-70 group-hover:opacity-100 transition-opacity pointer-events-none"
        />

        {/* Circular Twilight Glass Medallion Hosting the Animated Pigeon */}
        <div className="relative w-16 h-16 sm:w-[70px] sm:h-[70px] rounded-full bg-gradient-to-b from-[#0f3621]/95 via-[#092616]/95 to-[#04140c]/95 backdrop-blur-xl border border-[#86efac]/35 shadow-[0_14px_34px_rgba(4,20,12,0.48)] group-hover:border-[#86efac]/75 group-hover:shadow-[0_18px_40px_rgba(34,197,94,0.4)] flex items-center justify-center overflow-visible">
          {/* Upward Wind Breeze Streaks */}
          <svg
            viewBox="0 0 70 70"
            fill="none"
            className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
            aria-hidden="true"
          >
            <g className="opacity-35 group-hover:opacity-90 transition-opacity">
              <path
                d="M16 48 V58"
                stroke="#86efac"
                strokeWidth="1.4"
                strokeLinecap="round"
                className="animate-pigeon-wind"
              />
              <path
                d="M35 53 V64"
                stroke="#fef08a"
                strokeWidth="1.5"
                strokeLinecap="round"
                className="animate-pigeon-wind"
                style={{ animationDelay: '0.28s' }}
              />
              <path
                d="M54 47 V58"
                stroke="#bbf7d0"
                strokeWidth="1.4"
                strokeLinecap="round"
                className="animate-pigeon-wind"
                style={{ animationDelay: '0.52s' }}
              />
            </g>
          </svg>

          {/* Animated Iridescent Botanical Pigeon Illustration */}
          <svg
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="relative z-10 w-13 h-13 sm:w-14 sm:h-14 overflow-visible animate-pigeon-float"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="pigeonBodyGrad" x1="18" y1="22" x2="48" y2="52" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#f8fafc" />
                <stop offset="55%" stopColor="#e2e8f0" />
                <stop offset="100%" stopColor="#94a3b8" />
              </linearGradient>
              <linearGradient id="pigeonIridescent" x1="20" y1="16" x2="34" y2="30" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#4ade80" />
                <stop offset="55%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#a78bfa" />
              </linearGradient>
              <linearGradient id="pigeonWingGrad" x1="12" y1="10" x2="40" y2="42" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="65%" stopColor="#cbd5e1" />
                <stop offset="100%" stopColor="#64748b" />
              </linearGradient>
            </defs>

            {/* Back Feathered Wing */}
            <g className="animate-pigeon-wing-back">
              <path
                d="M31 32 C38 18, 49 12, 54 16 C51 24, 44 33, 35 37 Z"
                fill="#cbd5e1"
                fillOpacity="0.88"
                stroke="#64748b"
                strokeWidth="0.9"
                strokeLinejoin="round"
              />
            </g>

            {/* Tail Feathers */}
            <path d="M36 42 L53 48 L49 52 L34 45 Z" fill="#64748b" />
            <path d="M37 41 L55 44 L52 48 L35 44 Z" fill="#94a3b8" />

            {/* Graceful Pigeon Torso */}
            <path
              d="M21 26 C18 35, 22 46, 36 45 C42 44, 44 38, 39 32 C35 28, 31 24, 21 26 Z"
              fill="url(#pigeonBodyGrad)"
              stroke="#475569"
              strokeWidth="0.9"
            />

            {/* Iridescent Emerald-Green Neck Collar */}
            <path
              d="M20 26 C22 22, 27 22, 31 27 C27 30, 22 29, 20 26 Z"
              fill="url(#pigeonIridescent)"
              fillOpacity="0.9"
            />

            {/* Bobbing Pigeon Head, Eye & Botanical Leaf Sprig in Beak */}
            <g className="animate-pigeon-head">
              <path
                d="M19 26 C17 20, 20 14, 26 15 C30 16, 31 21, 29 25 Z"
                fill="#f8fafc"
                stroke="#475569"
                strokeWidth="0.9"
              />
              <path d="M18 19 L12 20.5 L18 22 Z" fill="#f59e0b" />
              <circle cx="22.5" cy="18.5" r="1.35" fill="#092616" />
              <circle cx="22.1" cy="18.1" r="0.45" fill="#ffffff" />

              {/* Fresh Green Botanical Sprig Held in Beak */}
              <path d="M13 20.5 C9 21, 7 23, 5 25" stroke="#4ade80" strokeWidth="1.2" strokeLinecap="round" />
              <path d="M9 21 C7 18, 4 18, 4 21 C6 22, 8 22, 9 21 Z" fill="#4ade80" />
              <path d="M7 23 C9 25, 8 28, 5 27 C5 25, 6 24, 7 23 Z" fill="#86efac" />
            </g>

            {/* Front Sweeping Wing with Feather Stripes */}
            <g className="animate-pigeon-wing-front">
              <path
                d="M27 33 C28 19, 39 8, 49 10 C48 20, 41 31, 31 38 Z"
                fill="url(#pigeonWingGrad)"
                stroke="#475569"
                strokeWidth="0.95"
                strokeLinejoin="round"
              />
              <path
                d="M33 30 C37 22, 42 16, 46 14"
                stroke="#475569"
                strokeOpacity="0.65"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
              <path
                d="M31 34 C35 27, 40 21, 44 19"
                stroke="#475569"
                strokeOpacity="0.45"
                strokeWidth="1.1"
                strokeLinecap="round"
              />
            </g>
          </svg>
        </div>
      </div>
    </button>
  );
};
