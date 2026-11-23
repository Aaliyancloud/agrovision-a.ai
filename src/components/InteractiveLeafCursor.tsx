import React, { useEffect, useState, useRef } from 'react';

/**
 * Animated Cute Leaf Cursor Component
 * - Replaces default pointer when interacting with elements with an animated cute botanical leaf.
 * - Gentle dynamic flutter/sway animation tracking cursor velocity.
 * - Reactive micro-blooms, soft dewdrops, and cute sprout particles when clicking or hovering cards.
 */
export const InteractiveLeafCursor: React.FC = () => {
  const [coords, setCoords] = useState<{ x: number; y: number } | null>(null);
  const [isPressing, setIsPressing] = useState(false);
  const [isInteractive, setIsInteractive] = useState(false);
  const [sproutParticles, setSproutParticles] = useState<
    Array<{ id: number; x: number; y: number; rotate: number; scale: number }>
  >([]);

  const prevCoordsRef = useRef<{ x: number; y: number } | null>(null);
  const [leafTilt, setLeafTilt] = useState(0);

  useEffect(() => {
    const checkInteractive = (target: EventTarget | null): boolean => {
      if (!target || !(target instanceof HTMLElement)) return false;
      return (
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.tagName === 'INPUT' ||
        target.tagName === 'SELECT' ||
        target.getAttribute('role') === 'button' ||
        target.classList.contains('cursor-pointer') ||
        target.classList.contains('interactive-card') ||
        Boolean(target.closest('button, a, [role="button"], .cursor-pointer, .interactive-card, [data-interactive="true"]'))
      );
    };

    const handleMouseMove = (e: MouseEvent) => {
      const nextX = e.clientX;
      const nextY = e.clientY;

      if (prevCoordsRef.current) {
        const dx = nextX - prevCoordsRef.current.x;
        // Cute dynamic sway based on mouse velocity
        const tilt = Math.max(-25, Math.min(25, dx * 1.5));
        setLeafTilt(tilt);
      }
      prevCoordsRef.current = { x: nextX, y: nextY };
      setCoords({ x: nextX, y: nextY });
      setIsInteractive(checkInteractive(e.target));
    };

    const handleMouseDown = (e: MouseEvent) => {
      setIsPressing(true);
      document.body.classList.add('button-pressing');

      // Spawn cute sprout particle on press
      const newParticle = {
        id: Date.now() + Math.random(),
        x: e.clientX,
        y: e.clientY,
        rotate: Math.random() * 60 - 30,
        scale: 0.8 + Math.random() * 0.4
      };
      setSproutParticles((prev) => [...prev.slice(-5), newParticle]);

      setTimeout(() => {
        setSproutParticles((prev) => prev.filter((p) => p.id !== newParticle.id));
      }, 700);
    };

    const handleMouseUp = () => {
      setIsPressing(false);
      document.body.classList.remove('button-pressing');
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.body.classList.remove('button-pressing');
    };
  }, []);

  if (!coords) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden select-none">
      {/* Cute leaf sprout burst particles on press */}
      {sproutParticles.map((particle) => (
        <div
          key={particle.id}
          className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-700 ease-out animate-ping"
          style={{
            left: `${particle.x}px`,
            top: `${particle.y}px`
          }}
        >
          <div
            className="w-5 h-5 flex items-center justify-center text-emerald-500"
            style={{ transform: `rotate(${particle.rotate}deg) scale(${particle.scale})` }}
          >
            <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
              <path
                d="M12 2C12 2 6 6 4 12C2 18 8 22 13 22C18 22 22 17 20 11C18 5 12 2 12 2Z"
                fill="#10b981"
              />
              <path d="M12 4V20" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      ))}

      {/* Floating Animated Cute Leaf Cursor Companion */}
      <div
        className="absolute transform -translate-x-1/2 -translate-y-1/2 will-change-transform transition-transform duration-75 ease-out"
        style={{
          left: `${coords.x + (isInteractive ? 18 : 12)}px`,
          top: `${coords.y - (isInteractive ? 18 : 12)}px`
        }}
      >
        <div
          className={`flex items-center justify-center transition-all duration-200 ${
            isPressing
              ? 'scale-135 rotate-25 drop-shadow-[0_0_14px_rgba(5,150,105,0.95)]'
              : isInteractive
              ? 'scale-120 drop-shadow-[0_0_10px_rgba(16,185,129,0.7)]'
              : 'scale-90 opacity-70 drop-shadow-[0_0_5px_rgba(16,185,129,0.35)]'
          }`}
          style={{ transform: `rotate(${leafTilt}deg)` }}
        >
          {/* Adorable Cute Tomato Leaf SVG */}
          <div className="relative">
            <svg
              width={isInteractive ? 26 : 20}
              height={isInteractive ? 26 : 20}
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="transition-all duration-150 animate-bounce"
              style={{ animationDuration: isInteractive ? '1.2s' : '2.4s' }}
            >
              {/* Cute heart-leaf organic shape */}
              <path
                d="M16 2.5C16 2.5 8 7 5 15C2 23 9 29.5 16.5 29.5C24 29.5 30 23 27 15C24 7 16 2.5 16 2.5Z"
                fill={isPressing ? '#064e3b' : isInteractive ? '#10b981' : '#34d399'}
                stroke={isPressing ? '#a7f3d0' : '#064e3b'}
                strokeWidth={isInteractive ? '2' : '1.4'}
              />

              {/* Cute white vein */}
              <path
                d="M16 5V27"
                stroke="#ffffff"
                strokeWidth={isInteractive ? '2' : '1.5'}
                strokeLinecap="round"
              />
              <path
                d="M16 11L10 8M16 16L9 14M16 21L11 20M16 11L22 8M16 16L23 14M16 21L21 20"
                stroke="#ffffff"
                strokeWidth={isInteractive ? '1.4' : '1'}
                strokeLinecap="round"
              />

              {/* Cute little highlight dewdrops on leaf */}
              <circle cx="12" cy="10" r="1.5" fill="#ffffff" opacity="0.8" />
              <circle cx="20" cy="18" r="1.2" fill="#ffffff" opacity="0.75" />
            </svg>

            {/* Tiny trailing sparkle when interactive */}
            {isInteractive && (
              <span className="absolute -top-1 -right-1 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
