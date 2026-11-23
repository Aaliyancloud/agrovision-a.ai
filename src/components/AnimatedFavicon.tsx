import React, { useEffect } from 'react';

/**
 * AnimatedFavicon
 *
 * Replaces static browser tab / bookmark icon with a live, gently swaying
 * glowing botanical leaf rendered on an offscreen canvas.
 */
export const AnimatedFavicon: React.FC = () => {
  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;

    const prefersReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let linkEl = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
    if (!linkEl) {
      linkEl = document.createElement('link');
      linkEl.rel = 'icon';
      document.head.appendChild(linkEl);
    }
    linkEl.type = 'image/png';

    let phase = 0;
    let timer = 0;
    let startTimeout = 0;
    let isCancelled = false;

    const drawFrame = () => {
      if (isCancelled || document.hidden) return;
      phase += 0.35;
      const sway = Math.sin(phase) * 0.12;
      const pulse = 0.85 + Math.sin(phase * 1.4) * 0.15;

      ctx.clearRect(0, 0, 64, 64);

      // Deep botanical forest badge circle backdrop
      ctx.save();
      ctx.beginPath();
      ctx.arc(32, 32, 30, 0, Math.PI * 2);
      ctx.fillStyle = '#092616';
      ctx.fill();
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = `rgba(134, 239, 172, ${0.45 + pulse * 0.35})`;
      ctx.stroke();

      // Swaying Leaf Silhouette
      ctx.translate(32, 34);
      ctx.rotate(sway);

      ctx.beginPath();
      ctx.moveTo(0, -21);
      ctx.bezierCurveTo(15, -12, 18, 6, 0, 19);
      ctx.bezierCurveTo(-18, 6, -15, -12, 0, -21);
      ctx.closePath();

      const grad = ctx.createLinearGradient(0, -21, 0, 19);
      grad.addColorStop(0, '#4ade80');
      grad.addColorStop(1, '#15803d');
      ctx.fillStyle = grad;
      ctx.fill();

      // Leaf center vein & side ribs
      ctx.beginPath();
      ctx.moveTo(0, -16);
      ctx.lineTo(0, 22);
      ctx.moveTo(0, -6);
      ctx.lineTo(-7, -10);
      ctx.moveTo(0, 2);
      ctx.lineTo(-9, -3);
      ctx.moveTo(0, -6);
      ctx.lineTo(7, -10);
      ctx.moveTo(0, 2);
      ctx.lineTo(9, -3);
      ctx.strokeStyle = '#f4f7f5';
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.stroke();

      // Tiny animated dewdrop spark
      const dewAlpha = 0.55 + Math.sin(phase * 2) * 0.4;
      ctx.beginPath();
      ctx.arc(6, -12, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(253, 224, 71, ${dewAlpha})`;
      ctx.fill();

      ctx.restore();

      try {
        const url = canvas.toDataURL('image/png');
        if (linkEl) {
          linkEl.href = url;
        }
      } catch {
        // Ignore security/dataURL errors in restricted contexts
      }
    };

    startTimeout = window.setTimeout(() => {
      if (isCancelled) return;
      drawFrame();
      timer = window.setInterval(drawFrame, 700);
    }, 1500);

    return () => {
      isCancelled = true;
      if (startTimeout) window.clearTimeout(startTimeout);
      if (timer) window.clearInterval(timer);
    };
  }, []);

  return null;
};
