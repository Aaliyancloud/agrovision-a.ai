import React, { useEffect, useRef, useState } from 'react';
import { useMotion } from '../context/MotionContext';

interface BotanicalBranchesOverlayProps {
  variant?: 'hero' | 'section';
  className?: string;
}

/**
 * Animated Sprouting & Swaying Botanical Branches
 * Renders cleanly on BOTH mobile and laptop/desktop screens (never hidden below xl),
 * keeping clear of navigation headers while adding organic growing branch motion.
 */
export const BotanicalBranchesOverlay: React.FC<BotanicalBranchesOverlayProps> = ({
  variant = 'section',
  className = '',
}) => {
  const { calmMode } = useMotion();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [grown, setGrown] = useState<boolean>(variant === 'hero' || calmMode);

  useEffect(() => {
    if (calmMode) {
      setGrown(true);
      return;
    }
    if (variant === 'hero') {
      const id = window.setTimeout(() => setGrown(true), 120);
      return () => window.clearTimeout(id);
    }

    const node = containerRef.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      setGrown(true);
      return;
    }

    const rect = node.getBoundingClientRect();
    if (rect.top <= (window.innerHeight || 900)) {
      setGrown(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setGrown(true);
          observer.disconnect();
        }
      },
      { threshold: 0.02, rootMargin: '0px 0px 60px 0px' }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [calmMode, variant]);

  const sizeClass =
    variant === 'hero'
      ? 'w-32 h-40 sm:w-48 sm:h-56 lg:w-60 lg:h-72 opacity-85 sm:opacity-90'
      : 'w-28 h-32 sm:w-40 sm:h-44 lg:w-52 lg:h-56 opacity-75 sm:opacity-85';

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={`pointer-events-none select-none absolute inset-0 overflow-hidden z-[1] ${className}`}
    >
      {/* Top-Left Sprouting Branch + Swaying Leaves */}
      <div className={`absolute top-1 left-0 ${sizeClass}`}>
        <svg
          viewBox="0 0 220 240"
          fill="none"
          className="w-full h-full overflow-visible"
        >
          <g className={calmMode ? '' : 'botanical-branch-sway-left'}>
            {/* Main arching stem */}
            <path
              pathLength={1000}
              d="M -8,18 C 38,24 68,54 106,66 C 136,75 160,64 186,48"
              stroke="#1f5c37"
              strokeWidth="3.2"
              strokeLinecap="round"
              className={`botanical-branch-path ${grown ? 'is-grown' : ''}`}
            />
            {/* Secondary drooping sub-branch */}
            <path
              pathLength={1000}
              d="M 66,46 C 72,88 54,124 30,156"
              stroke="#2d6a4f"
              strokeWidth="2.4"
              strokeLinecap="round"
              style={{ transitionDelay: '240ms' }}
              className={`botanical-branch-path ${grown ? 'is-grown' : ''}`}
            />
            {/* Curled tendril */}
            <path
              pathLength={1000}
              d="M 118,67 C 132,88 122,110 108,104 C 98,100 105,86 116,92"
              stroke="#40916c"
              strokeWidth="1.6"
              strokeLinecap="round"
              style={{ transitionDelay: '420ms' }}
              className={`botanical-branch-path ${grown ? 'is-grown' : ''}`}
            />

            {/* Sprouting Leaves Along Branch */}
            <g
              style={{ transitionDelay: '180ms' }}
              className={`botanical-sprout-leaf ${grown ? 'is-grown' : ''}`}
            >
              <path
                d="M 48,36 C 40,12 62,2 76,14 C 72,28 60,36 48,36 Z"
                fill="#166534"
                fillOpacity="0.86"
              />
              <path d="M 48,36 L 68,16" stroke="#dcfce7" strokeWidth="1.1" strokeOpacity="0.7" />
            </g>

            <g
              style={{ transitionDelay: '320ms' }}
              className={`botanical-sprout-leaf ${grown ? 'is-grown' : ''}`}
            >
              <path
                d="M 110,66 C 122,40 148,38 156,56 C 142,70 124,72 110,66 Z"
                fill="#15803d"
                fillOpacity="0.88"
              />
              <path d="M 110,66 L 146,54" stroke="#dcfce7" strokeWidth="1.1" strokeOpacity="0.7" />
            </g>

            <g
              style={{ transitionDelay: '460ms' }}
              className={`botanical-sprout-leaf ${grown ? 'is-grown' : ''}`}
            >
              <path
                d="M 186,48 C 194,26 214,26 216,44 C 204,54 194,54 186,48 Z"
                fill="#22c55e"
                fillOpacity="0.78"
              />
            </g>

            <g
              style={{ transitionDelay: '380ms' }}
              className={`botanical-sprout-leaf ${grown ? 'is-grown' : ''}`}
            >
              <path
                d="M 52,118 C 28,112 14,128 24,142 C 38,144 48,132 52,118 Z"
                fill="#1b4332"
                fillOpacity="0.82"
              />
              <path
                d="M 30,156 C 14,166 10,188 26,192 C 38,184 36,168 30,156 Z"
                fill="#2d6a4f"
                fillOpacity="0.84"
              />
            </g>
          </g>
        </svg>
      </div>

      {/* Top-Right / Mid-Right Counter-Branch + Swaying Leaves */}
      <div className={`absolute top-2 right-0 ${sizeClass}`}>
        <svg
          viewBox="0 0 220 240"
          fill="none"
          className="w-full h-full overflow-visible"
        >
          <g className={calmMode ? '' : 'botanical-branch-sway-right'}>
            <path
              pathLength={1000}
              d="M 228,22 C 182,30 150,58 112,72 C 84,82 60,72 34,54"
              stroke="#1f5c37"
              strokeWidth="3.2"
              strokeLinecap="round"
              className={`botanical-branch-path ${grown ? 'is-grown' : ''}`}
            />
            <path
              pathLength={1000}
              d="M 156,52 C 154,96 172,130 194,164"
              stroke="#2d6a4f"
              strokeWidth="2.4"
              strokeLinecap="round"
              style={{ transitionDelay: '260ms' }}
              className={`botanical-branch-path ${grown ? 'is-grown' : ''}`}
            />
            <path
              pathLength={1000}
              d="M 104,74 C 92,94 102,114 116,108 C 126,104 118,90 108,96"
              stroke="#40916c"
              strokeWidth="1.6"
              strokeLinecap="round"
              style={{ transitionDelay: '440ms' }}
              className={`botanical-branch-path ${grown ? 'is-grown' : ''}`}
            />

            <g
              style={{ transitionDelay: '200ms' }}
              className={`botanical-sprout-leaf ${grown ? 'is-grown' : ''}`}
            >
              <path
                d="M 172,40 C 180,14 158,4 144,18 C 148,32 160,38 172,40 Z"
                fill="#166534"
                fillOpacity="0.86"
              />
              <path d="M 172,40 L 152,18" stroke="#dcfce7" strokeWidth="1.1" strokeOpacity="0.7" />
            </g>

            <g
              style={{ transitionDelay: '340ms' }}
              className={`botanical-sprout-leaf ${grown ? 'is-grown' : ''}`}
            >
              <path
                d="M 110,72 C 98,46 72,44 64,62 C 78,76 96,78 110,72 Z"
                fill="#15803d"
                fillOpacity="0.88"
              />
              <path d="M 110,72 L 74,60" stroke="#dcfce7" strokeWidth="1.1" strokeOpacity="0.7" />
            </g>

            <g
              style={{ transitionDelay: '480ms' }}
              className={`botanical-sprout-leaf ${grown ? 'is-grown' : ''}`}
            >
              <path
                d="M 34,54 C 24,32 6,34 4,50 C 16,60 26,60 34,54 Z"
                fill="#22c55e"
                fillOpacity="0.78"
              />
            </g>

            <g
              style={{ transitionDelay: '400ms' }}
              className={`botanical-sprout-leaf ${grown ? 'is-grown' : ''}`}
            >
              <path
                d="M 170,122 C 194,116 208,132 198,146 C 184,148 174,136 170,122 Z"
                fill="#1b4332"
                fillOpacity="0.82"
              />
              <path
                d="M 194,164 C 210,174 214,196 198,200 C 186,192 188,176 194,164 Z"
                fill="#2d6a4f"
                fillOpacity="0.84"
              />
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
};
