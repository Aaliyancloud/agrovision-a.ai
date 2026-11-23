import React, { useEffect, useRef, useState } from 'react';
import { Leaf } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useMotion } from '../context/MotionContext';
import sereneBotanicalBg from '../assets/images/serene_botanical_hero_footer_1794587145068.webp';

interface SporeParticle {
  x: number;
  y: number;
  radius: number;
  vy: number;
  vxDrift: number;
  phase: number;
  phaseSpeed: number;
  alpha: number;
  color: string;
}

interface FloatingVineSprite {
  id: string;
  left: string;
  top: string;
  size: number;
  variant: 'tendril' | 'sprig' | 'twinLeaf' | 'curl';
  driftMode: 'a' | 'b';
  duration: string;
  delay: string;
  tint: string;
}

const FLOATING_VINE_PARTICLES: FloatingVineSprite[] = [
  { id: 'v1', left: '7%', top: '18%', size: 42, variant: 'tendril', driftMode: 'a', duration: '12s', delay: '-1.5s', tint: '#dcfce7' },
  { id: 'v2', left: '16%', top: '64%', size: 34, variant: 'sprig', driftMode: 'b', duration: '14s', delay: '-4.2s', tint: '#bbf7d0' },
  { id: 'v3', left: '26%', top: '26%', size: 28, variant: 'twinLeaf', driftMode: 'a', duration: '11s', delay: '-2.8s', tint: '#f4f7f5' },
  { id: 'v4', left: '68%', top: '22%', size: 40, variant: 'tendril', driftMode: 'b', duration: '13.5s', delay: '-2s', tint: '#dcfce7' },
  { id: 'v5', left: '79%', top: '60%', size: 32, variant: 'curl', driftMode: 'a', duration: '11.5s', delay: '-6.4s', tint: '#fef08a' },
  { id: 'v6', left: '89%', top: '28%', size: 44, variant: 'sprig', driftMode: 'b', duration: '13s', delay: '-1.1s', tint: '#bbf7d0' },
  { id: 'v7', left: '12%', top: '80%', size: 28, variant: 'curl', driftMode: 'a', duration: '12.8s', delay: '-7.6s', tint: '#dcfce7' },
  { id: 'v8', left: '88%', top: '76%', size: 32, variant: 'twinLeaf', driftMode: 'a', duration: '11.8s', delay: '-4.9s', tint: '#f4f7f5' },
];

const VineParticleSvg: React.FC<{ variant: FloatingVineSprite['variant']; tint: string }> = ({
  variant,
  tint,
}) => {
  if (variant === 'tendril') {
    return (
      <svg viewBox="0 0 64 64" fill="none" className="w-full h-full" aria-hidden="true">
        <path
          d="M12 52 C18 36, 34 38, 30 24 C27 14, 42 10, 48 18 C52 24, 44 30, 39 25"
          stroke={tint}
          strokeOpacity="0.6"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <path d="M24 38 C16 32, 16 24, 24 22 C28 28, 28 34, 24 38 Z" fill={tint} fillOpacity="0.32" />
        <path d="M40 16 C44 8, 54 8, 56 16 C50 20, 44 20, 40 16 Z" fill={tint} fillOpacity="0.35" />
      </svg>
    );
  }

  if (variant === 'sprig') {
    return (
      <svg viewBox="0 0 64 64" fill="none" className="w-full h-full" aria-hidden="true">
        <path d="M16 54 Q30 32 48 12" stroke={tint} strokeOpacity="0.6" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M26 40 C16 38, 12 28, 20 24 C26 28, 28 34, 26 40 Z" fill={tint} fillOpacity="0.34" />
        <path d="M36 28 C46 28, 52 36, 44 42 C38 38, 36 33, 36 28 Z" fill={tint} fillOpacity="0.3" />
      </svg>
    );
  }

  if (variant === 'twinLeaf') {
    return (
      <svg viewBox="0 0 64 64" fill="none" className="w-full h-full" aria-hidden="true">
        <path d="M32 52 C32 36, 30 24, 32 14" stroke={tint} strokeOpacity="0.55" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M31 32 C18 28, 14 16, 22 12 C30 16, 32 24, 31 32 Z" fill={tint} fillOpacity="0.32" />
        <path d="M33 28 C46 24, 50 12, 42 8 C34 12, 32 20, 33 28 Z" fill={tint} fillOpacity="0.34" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 64 64" fill="none" className="w-full h-full" aria-hidden="true">
      <path
        d="M14 44 C26 48, 38 38, 34 26 C31 18, 20 20, 22 28 C24 34, 34 34, 42 26 C48 20, 50 12, 46 8"
        stroke={tint}
        strokeOpacity="0.55"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <circle cx="46" cy="8" r="2.2" fill={tint} fillOpacity="0.6" />
    </svg>
  );
};

interface RisingWordProps {
  children: React.ReactNode;
  revealed: boolean;
  delayMs?: number;
  className?: string;
}

const RisingWord: React.FC<RisingWordProps> = ({
  children,
  revealed,
  delayMs = 0,
  className = '',
}) => (
  <span className="inline-block overflow-hidden align-bottom pb-1.5">
    <span
      style={{ transitionDelay: `${delayMs}ms` }}
      className={`inline-block transition-[transform,opacity] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none motion-reduce:transform-none motion-reduce:opacity-100 ${
        revealed
          ? 'translate-y-0 rotate-0 opacity-100'
          : 'translate-y-[120%] rotate-[2deg] opacity-0'
      } ${className}`}
    >
      {children}
    </span>
  </span>
);

export const Footer: React.FC = () => {
  const { isUrdu } = useLanguage();
  const { calmMode } = useMotion();
  const footerRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pointerRef = useRef<{ x: number; y: number; active: boolean }>({
    x: 0,
    y: 0,
    active: false,
  });

  const [isRevealed, setIsRevealed] = useState(false);
  const [imgFailed, setImgFailed] = useState(false);

  // Scroll-triggered reveal for perimeter SVG vine crawl & hero-footer typography
  useEffect(() => {
    if (calmMode) {
      setIsRevealed(true);
      return;
    }
    const node = footerRef.current;
    if (!node) return;

    if (typeof IntersectionObserver === 'undefined') {
      setIsRevealed(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setIsRevealed(true);
            observer.disconnect();
            break;
          }
        }
      },
      { threshold: 0.06, rootMargin: '0px 0px -15px 0px' }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [calmMode]);

  // Gentle firefly dew-spore canvas drifting softly over the sunlit foliage photo
  useEffect(() => {
    const canvas = canvasRef.current;
    const footerEl = footerRef.current;
    if (!canvas || !footerEl) return;

    const prefersReducedMotion = calmMode || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      const ctx = canvas.getContext('2d');
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = footerEl.clientWidth || 1200;
    let height = footerEl.clientHeight || 560;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resizeCanvas = () => {
      if (!footerRef.current || !canvasRef.current) return;
      width = footerRef.current.clientWidth;
      height = footerRef.current.clientHeight;
      canvasRef.current.width = Math.floor(width * dpr);
      canvasRef.current.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resizeCanvas();

    const palette = ['#f4f7f5', '#dcfce7', '#bbf7d0', '#fef9c3'];
    const spores: SporeParticle[] = Array.from({ length: 28 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: 1.2 + Math.random() * 2.1,
      vy: -(0.14 + Math.random() * 0.28),
      vxDrift: (Math.random() - 0.5) * 0.1,
      phase: Math.random() * Math.PI * 2,
      phaseSpeed: 0.01 + Math.random() * 0.014,
      alpha: 0.25 + Math.random() * 0.42,
      color: palette[Math.floor(Math.random() * palette.length)],
    }));

    let rafId = 0;
    const render = () => {
      ctx.clearRect(0, 0, width, height);
      const ptr = pointerRef.current;

      for (let i = 0; i < spores.length; i++) {
        const p = spores[i];
        p.phase += p.phaseSpeed;
        p.y += p.vy;
        p.x += p.vxDrift + Math.sin(p.phase) * 0.2;

        if (ptr.active) {
          const dx = p.x - ptr.x;
          const dy = p.y - ptr.y;
          const distSq = dx * dx + dy * dy;
          if (distSq < 11000 && distSq > 4) {
            const dist = Math.sqrt(distSq);
            const push = ((105 - dist) / 105) * 0.65;
            p.x += (dx / dist) * push;
            p.y += (dy / dist) * push - 0.2;
          }
        }

        const edgeFade =
          Math.min(1, Math.max(0, p.y / (height * 0.16))) *
          Math.min(1, Math.max(0, (height - p.y) / 28));
        const shimmer = 0.72 + Math.sin(p.phase * 1.6) * 0.28;
        const drawAlpha = p.alpha * edgeFade * shimmer;

        if (drawAlpha > 0.01) {
          ctx.save();
          ctx.globalAlpha = drawAlpha;
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 3.2);
          grad.addColorStop(0, p.color);
          grad.addColorStop(0.45, `${p.color}44`);
          grad.addColorStop(1, 'transparent');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * 3.2, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#F6F8F6';
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * 0.45, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }

        if (p.y < -14 || p.x < -20 || p.x > width + 20) {
          p.x = Math.random() * width;
          p.y = height + 8;
        }
      }

      rafId = window.requestAnimationFrame(render);
    };

    rafId = window.requestAnimationFrame(render);
    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [calmMode]);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    pointerRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      active: true,
    };
  };

  const handleMouseLeave = () => {
    pointerRef.current.active = false;
  };

  const brandWord = 'AgroVision'.split('');
  const aiWord = 'AI'.split('');

  const marqueeItems = isUrdu
    ? [
        'پائیدار زراعت',
        'اے آئی پر مبنی تشخیص',
        'فصلوں کے تحفظ کا مشن',
        'سرسبز اور پُرسکون پودے',
        'ماحول دوست کاشتکاری',
      ]
    : [
        'Sustainable Agriculture',
        'AI-Powered Diagnostics',
        'Crop Protection Initiative',
        'Mindful Botanical Living',
        'Peaceful Green Future',
      ];

  return (
    <footer
      ref={footerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="w-full max-w-full min-h-[540px] sm:min-h-[600px] lg:min-h-[640px] relative overflow-hidden bg-[#071e12] text-[#f4f7f5] flex flex-col justify-between"
    >
      {/* Full-Bleed Serene Botanical Background Image Stretched Across Entire Footer */}
      {!imgFailed && (
        <img
          src={sereneBotanicalBg}
          alt="Morning sunlight filtering softly through lush conservatory tomato vines and fern fronds"
          width={1376}
          height={768}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          onError={() => setImgFailed(true)}
          className={`pointer-events-none absolute inset-0 w-full h-full object-cover object-center select-none transition-[opacity,transform] duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none ${
            isRevealed ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
          }`}
        />
      )}

      {/* Measured Forest Scrim Ensuring Effortless Off-White Readability */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#061a0f]/75 via-[#071f13]/52 to-[#04140c]/88"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-radial from-transparent via-[#05180e]/25 to-[#04140c]/75"
      />

      {/* Soft Glowing Dew-Spore Canvas */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 w-full h-full z-[1]"
      />

      {/* Animated SVG-Based Floating Vine Particles Gently Drifting & Swaying */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 w-full h-full z-[2] overflow-hidden opacity-80">
        {FLOATING_VINE_PARTICLES.map((particle) => (
          <div
            key={particle.id}
            style={{
              left: particle.left,
              top: particle.top,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              '--vine-dur': particle.duration,
              '--vine-delay': particle.delay,
            } as React.CSSProperties}
            className={`absolute ${
              particle.driftMode === 'a' ? 'animate-vine-drift-a' : 'animate-vine-drift-b'
            }`}
          >
            <VineParticleSvg variant={particle.variant} tint={particle.tint} />
          </div>
        ))}
      </div>

      {/* Edge-Crawling Perimeter SVG Vine Growth Sequence (.footer-vine-path) */}
      <svg
        aria-hidden="true"
        viewBox="0 0 1440 720"
        fill="none"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-0 w-full h-full z-[3]"
      >
        <path
          pathLength={1000}
          d="M 20,706 C 4,585 44,485 16,365 C -4,245 42,145 18,22"
          stroke="#dcfce7"
          strokeOpacity="0.4"
          strokeWidth="1.8"
          strokeLinecap="round"
          style={{ transitionDelay: '0ms' }}
          className={`footer-vine-path ${isRevealed ? 'is-revealed' : ''}`}
        />
        <path
          pathLength={1000}
          d="M 18,22 C 160,8 310,32 470,14 C 600,-2 730,26 860,14"
          stroke="#f4f7f5"
          strokeOpacity="0.34"
          strokeWidth="1.6"
          strokeLinecap="round"
          style={{ transitionDelay: '300ms' }}
          className={`footer-vine-path ${isRevealed ? 'is-revealed' : ''}`}
        />
        <path
          pathLength={1000}
          d="M 860,14 C 1000,4 1125,30 1255,16 C 1345,6 1395,18 1422,26"
          stroke="#dcfce7"
          strokeOpacity="0.38"
          strokeWidth="1.6"
          strokeLinecap="round"
          style={{ transitionDelay: '580ms' }}
          className={`footer-vine-path ${isRevealed ? 'is-revealed' : ''}`}
        />
        <path
          pathLength={1000}
          d="M 1422,26 C 1438,145 1392,260 1420,385 C 1438,500 1398,610 1422,706"
          stroke="#f4f7f5"
          strokeOpacity="0.34"
          strokeWidth="1.8"
          strokeLinecap="round"
          style={{ transitionDelay: '820ms' }}
          className={`footer-vine-path ${isRevealed ? 'is-revealed' : ''}`}
        />

        {/* Subtle Unfurling Edge Leaves */}
        <g>
          <path
            d="M22,495 C42,477 58,489 54,505 C38,511 28,505 22,495 Z"
            fill="#dcfce7"
            fillOpacity="0.45"
            style={{ transitionDelay: '360ms' }}
            className={`footer-vine-leaf ${isRevealed ? 'is-revealed' : ''}`}
          />
          <path
            d="M18,265 C40,244 58,254 52,272 C36,280 24,275 18,265 Z"
            fill="#f4f7f5"
            fillOpacity="0.42"
            style={{ transitionDelay: '620ms' }}
            className={`footer-vine-leaf ${isRevealed ? 'is-revealed' : ''}`}
          />
          <path
            d="M1412,310 C1388,292 1374,306 1380,322 C1396,326 1406,320 1412,310 Z"
            fill="#dcfce7"
            fillOpacity="0.42"
            style={{ transitionDelay: '1180ms' }}
            className={`footer-vine-leaf ${isRevealed ? 'is-revealed' : ''}`}
          />
        </g>
      </svg>

      {/* Top Airy Spacer + Clean Centered Hero-Footer Minimal Typography */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center max-w-5xl mx-auto px-6 sm:px-10 py-20 sm:py-28 text-center">
        <p
          style={{ transitionDelay: '60ms' }}
          className={`text-xs sm:text-sm font-medium tracking-[0.18em] text-[#f4f7f5]/80 transition-[transform,opacity] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none motion-reduce:transform-none motion-reduce:opacity-100 ${
            isRevealed ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}
        >
          {isUrdu ? 'پُرسکون صبحیں · سرسبز فطرت' : 'Quiet Mornings · Living Foliage'}
        </p>

        {/* Minimal Sculpted AgroVision AI Hero Display Title */}
        <h2 className="mt-5 font-display flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5 text-5xl sm:text-7xl lg:text-8xl font-extrabold tracking-tight leading-[1.04] text-[#f4f7f5] drop-shadow-[0_6px_28px_rgba(4,20,12,0.55)]">
          <span className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#f4f7f5]/10 backdrop-blur-md border border-[#f4f7f5]/25 flex items-center justify-center text-[#f4f7f5] shadow-lg shrink-0 transition-transform duration-300 hover:scale-105">
            <Leaf className="w-7 h-7 sm:w-8 sm:h-8 text-[#dcfce7] animate-footer-leaf-bob" />
          </span>

          <span className="inline-flex items-baseline flex-wrap justify-center gap-x-3 select-none" dir="ltr">
            <RisingWord revealed={isRevealed} delayMs={110}>
              <span className="inline-flex">
                {brandWord.map((char, idx) => (
                  <span
                    key={idx}
                    className="inline-block text-[#F6F8F6] transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-2 hover:rotate-[-5deg] hover:text-[#dcfce7]"
                  >
                    {char}
                  </span>
                ))}
              </span>
            </RisingWord>
            <RisingWord revealed={isRevealed} delayMs={210}>
              <span className="inline-flex italic font-light text-[#e2efe6]">
                {aiWord.map((char, idx) => (
                  <span
                    key={idx}
                    className="inline-block transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-2 hover:rotate-[5deg] hover:text-[#fef9c3]"
                  >
                    {char}
                  </span>
                ))}
              </span>
            </RisingWord>
          </span>
        </h2>

        {/* Single Minimal Serene Statement in Soft Off-White */}
        <p
          style={{ transitionDelay: '320ms' }}
          className={`mt-5 max-w-xl text-base sm:text-lg font-normal text-[#f4f7f5]/85 leading-relaxed text-balance drop-shadow-[0_2px_12px_rgba(4,20,12,0.5)] transition-[transform,opacity] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none motion-reduce:transform-none motion-reduce:opacity-100 ${
            isRevealed ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
          }`}
        >
          {isUrdu
            ? 'پُرسکون ہریالی اور زندہ روشنی کا ایک دلکش امتزاج۔'
            : 'Where calm greenery meets living light.'}
        </p>
      </div>

      {/* Bottom Marquee Values Strip & Whisper-Clean Copyright Bar */}
      <div className="relative z-10 w-full">
        <div
          aria-label={isUrdu ? 'کلیدی اقدار' : 'Core Values'}
          className="footer-marquee-wrap w-full overflow-hidden border-t border-[#f4f7f5]/12 bg-[#04140c]/45 backdrop-blur-sm py-3 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]"
        >
          <div dir="ltr" className="flex w-max animate-footer-marquee select-none">
            {[0, 1].map((dupIdx) => (
              <div
                key={dupIdx}
                aria-hidden={dupIdx === 1}
                className="flex items-center gap-8 sm:gap-12 pr-8 sm:pr-12 shrink-0"
              >
                {marqueeItems.map((item, idx) => (
                  <React.Fragment key={`${dupIdx}-${idx}`}>
                    <span className="font-display text-xs sm:text-sm font-medium tracking-wide text-[#f4f7f5]/85 whitespace-nowrap">
                      {item}
                    </span>
                    <Leaf
                      aria-hidden="true"
                      className="w-3 h-3 text-[#f4f7f5]/55 shrink-0"
                    />
                  </React.Fragment>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 sm:px-10 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#f4f7f5]/75">
          <p className="text-center sm:text-left">
            {isUrdu ? '© 2026 ایگرو وژن اے آئی' : '© 2026 AgroVision AI'}
          </p>
          <p className="whitespace-nowrap">
            {isUrdu ? 'سکھر، سندھ، پاکستان' : 'Sukkur, Sindh, Pakistan'}
          </p>
        </div>
      </div>
    </footer>
  );
};
