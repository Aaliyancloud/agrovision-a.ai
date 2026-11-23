import React, { useEffect, useState } from 'react';
import { useMotion } from '../context/MotionContext';

export const ScrollProgressBar: React.FC = () => {
  const { calmMode } = useMotion();
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    let ticking = false;

    const updateProgress = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        const scrollTop = window.scrollY;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const ratio = maxScroll > 0 ? Math.min(1, Math.max(0, scrollTop / maxScroll)) : 0;
        setScrollProgress(ratio);
        ticking = false;
      });
    };

    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
    return () => window.removeEventListener('scroll', updateProgress);
  }, []);

  return (
    <div
      aria-hidden="true"
      className={`fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#1B4332] via-[#2D6A4F] to-[#52B788] origin-left z-[60] pointer-events-none ${
        calmMode ? '' : 'transition-transform duration-75'
      }`}
      style={{ transform: `scaleX(${scrollProgress})` }}
    />
  );
};
