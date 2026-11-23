import React, { useEffect, useRef, useState } from 'react';
import { useMotion } from '../context/MotionContext';

interface ScrollRevealProps {
  children: React.ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right' | 'scale' | 'fade';
  delayMs?: number;
  durationMs?: number;
  className?: string;
  threshold?: number;
  once?: boolean;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  direction = 'up',
  delayMs = 0,
  durationMs = 620,
  className = '',
  threshold = 0.08,
  once = true,
}) => {
  const { calmMode } = useMotion();
  const ref = useRef<HTMLDivElement | null>(null);
  const hasTriggeredRef = useRef<boolean>(calmMode);
  const [visible, setVisible] = useState<boolean>(calmMode);

  useEffect(() => {
    if (calmMode) {
      hasTriggeredRef.current = true;
      setVisible(true);
      return;
    }

    if (once && hasTriggeredRef.current) {
      setVisible(true);
      return;
    }

    const node = ref.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      hasTriggeredRef.current = true;
      setVisible(true);
      return;
    }

    let observer: IntersectionObserver | null = null;

    const cleanup = () => {
      observer?.disconnect();
      window.removeEventListener('scroll', checkPosition);
      window.removeEventListener('resize', checkPosition);
    };

    const revealOnce = () => {
      hasTriggeredRef.current = true;
      setVisible(true);
      if (once) {
        cleanup();
      }
    };

    const checkPosition = () => {
      const rect = node.getBoundingClientRect();
      if (rect.top <= (window.innerHeight || 900) - 8) {
        revealOnce();
        return true;
      }
      return false;
    };

    if (checkPosition()) return;

    observer = new IntersectionObserver(
      (entries) => {
        if (
          entries.some(
            (e) => e.isIntersecting || e.boundingClientRect.top <= (window.innerHeight || 900)
          )
        ) {
          revealOnce();
        }
      },
      { threshold: Math.min(threshold, 0.01), rootMargin: '0px 0px 40px 0px' }
    );

    observer.observe(node);
    window.addEventListener('scroll', checkPosition, { passive: true });
    window.addEventListener('resize', checkPosition, { passive: true });
    return cleanup;
  }, [calmMode, threshold, once]);

  const hiddenTransform =
    direction === 'up'
      ? 'translate3d(0, 26px, 0)'
      : direction === 'down'
      ? 'translate3d(0, -22px, 0)'
      : direction === 'left'
      ? 'translate3d(-28px, 0, 0)'
      : direction === 'right'
      ? 'translate3d(28px, 0, 0)'
      : direction === 'scale'
      ? 'scale(0.94) translate3d(0, 14px, 0)'
      : 'translate3d(0, 0, 0)';

  const style: React.CSSProperties = calmMode
    ? {}
    : {
        opacity: visible ? 1 : 0,
        transform: visible ? 'translate3d(0, 0, 0) scale(1)' : hiddenTransform,
        transitionProperty: 'transform, opacity',
        transitionDuration: `${durationMs}ms`,
        transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
        transitionDelay: `${visible ? delayMs : 0}ms`,
        willChange: visible ? 'auto' : 'transform, opacity',
      };

  return (
    <div ref={ref} style={style} className={className}>
      {children}
    </div>
  );
};

interface WordRevealProps {
  text: string;
  immediate?: boolean;
  baseDelayMs?: number;
  stepDelayMs?: number;
  highlightFromIndex?: number;
  highlightClassName?: string;
  className?: string;
  once?: boolean;
}

/**
 * Masked word-by-word rising reveal.
 * Splits only on spaces so multi-character ligatures (e.g., Urdu Nastaliq) stay intact.
 */
export const WordReveal: React.FC<WordRevealProps> = ({
  text,
  immediate = false,
  baseDelayMs = 0,
  stepDelayMs = 55,
  highlightFromIndex,
  highlightClassName = 'text-[#166534]',
  className = '',
  once = true,
}) => {
  const { calmMode } = useMotion();
  const containerRef = useRef<HTMLSpanElement | null>(null);
  const hasRevealedRef = useRef<boolean>(calmMode || immediate);
  const [revealed, setRevealed] = useState<boolean>(calmMode || immediate);

  useEffect(() => {
    if (calmMode || immediate) {
      hasRevealedRef.current = true;
      setRevealed(true);
      return;
    }

    if (once && hasRevealedRef.current) {
      setRevealed(true);
      return;
    }

    const node = containerRef.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      hasRevealedRef.current = true;
      setRevealed(true);
      return;
    }

    let observer: IntersectionObserver | null = null;

    const cleanup = () => {
      observer?.disconnect();
      window.removeEventListener('scroll', checkPosition);
    };

    const revealOnce = () => {
      hasRevealedRef.current = true;
      setRevealed(true);
      if (once) {
        cleanup();
      }
    };

    const checkPosition = () => {
      const rect = node.getBoundingClientRect();
      if (rect.top <= (window.innerHeight || 900) - 12) {
        revealOnce();
        return true;
      }
      return false;
    };

    if (checkPosition()) return;

    observer = new IntersectionObserver(
      (entries) => {
        if (
          entries.some(
            (e) => e.isIntersecting || e.boundingClientRect.top <= (window.innerHeight || 900)
          )
        ) {
          revealOnce();
        }
      },
      { threshold: 0.05, rootMargin: '0px 0px 24px 0px' }
    );

    observer.observe(node);
    window.addEventListener('scroll', checkPosition, { passive: true });
    return cleanup;
  }, [calmMode, immediate, once]);

  const words = text.trim().split(/\s+/);

  return (
    <span ref={containerRef} className={className}>
      {words.map((word, idx) => {
        const isHighlighted =
          typeof highlightFromIndex === 'number' && idx >= highlightFromIndex;
        const delay = baseDelayMs + idx * stepDelayMs;

        if (immediate && !calmMode) {
          return (
            <React.Fragment key={`${word}-${idx}`}>
              <span className="inline-block overflow-hidden align-bottom pb-[0.06em] -mb-[0.06em]">
                <span
                  style={{ '--word-delay': `${delay}ms` } as React.CSSProperties}
                  className={`hero-word-rise inline-block ${isHighlighted ? highlightClassName : ''}`}
                >
                  {word}
                </span>
              </span>
              {idx < words.length - 1 ? ' ' : ''}
            </React.Fragment>
          );
        }

        return (
          <React.Fragment key={`${word}-${idx}`}>
            <span className="inline-block overflow-hidden align-bottom pb-[0.06em] -mb-[0.06em]">
              <span
                style={
                  calmMode
                    ? undefined
                    : {
                        transform: revealed
                          ? 'translate3d(0, 0, 0) rotate(0deg)'
                          : 'translate3d(0, 115%, 0) rotate(1.5deg)',
                        opacity: revealed ? 1 : 0,
                        transitionProperty: 'transform, opacity',
                        transitionDuration: '620ms',
                        transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
                        transitionDelay: `${delay}ms`,
                      }
                }
                className={`inline-block ${isHighlighted ? highlightClassName : ''}`}
              >
                {word}
              </span>
            </span>
            {idx < words.length - 1 ? ' ' : ''}
          </React.Fragment>
        );
      })}
    </span>
  );
};

interface CountUpNumberProps {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  durationMs?: number;
  immediate?: boolean;
  className?: string;
}

export const CountUpNumber: React.FC<CountUpNumberProps> = ({
  value,
  prefix = '',
  suffix = '',
  decimals = 0,
  durationMs = 950,
  immediate = false,
  className = '',
}) => {
  const { calmMode } = useMotion();
  const ref = useRef<HTMLSpanElement | null>(null);
  const [displayValue, setDisplayValue] = useState<number>(calmMode ? value : 0);
  const [hasStarted, setHasStarted] = useState<boolean>(calmMode || immediate);

  useEffect(() => {
    if (calmMode) {
      setDisplayValue(value);
      setHasStarted(true);
      return;
    }

    if (immediate) {
      setHasStarted(true);
      return;
    }

    const node = ref.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      setHasStarted(true);
      return;
    }

    const rect = node.getBoundingClientRect();
    if (rect.top <= (window.innerHeight || 900)) {
      setHasStarted(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries.some(
            (e) => e.isIntersecting || e.boundingClientRect.top <= (window.innerHeight || 900)
          )
        ) {
          setHasStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [calmMode, immediate, value]);

  useEffect(() => {
    if (calmMode || !hasStarted) {
      if (calmMode) setDisplayValue(value);
      return;
    }

    let rafId = 0;
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / durationMs);
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setDisplayValue(value * eased);
      if (progress < 1) {
        rafId = window.requestAnimationFrame(tick);
      } else {
        setDisplayValue(value);
      }
    };

    rafId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(rafId);
  }, [calmMode, hasStarted, value, durationMs]);

  const formatted =
    decimals > 0 ? displayValue.toFixed(decimals) : Math.round(displayValue).toString();

  return (
    <span ref={ref} className={className}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
};
