import React, { useEffect, useRef, useState } from 'react';

interface DeferredSectionProps {
  id: string;
  forceLoad?: boolean;
  minHeightClass?: string;
  bgClass?: string;
  children: React.ReactNode;
}

/**
 * DeferredSection
 *
 * Defers heavy below-the-fold section chunks (e.g., DiagnosticStudio, secondary WebGL canvas)
 * until the user scrolls near the section, navigates via hash anchor, or clicks a CTA trigger.
 * Keeps the target DOM id present immediately so smooth scrolling never breaks.
 */
export const DeferredSection: React.FC<DeferredSectionProps> = ({
  id,
  forceLoad = false,
  minHeightClass = 'min-h-[560px]',
  bgClass = 'bg-[#F6F8F6]',
  children
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldMount, setShouldMount] = useState<boolean>(() => {
    if (forceLoad) return true;
    if (typeof window !== 'undefined' && window.location.hash === `#${id}`) {
      return true;
    }
    return false;
  });

  useEffect(() => {
    if (forceLoad) {
      setShouldMount(true);
    }
  }, [forceLoad]);

  useEffect(() => {
    if (shouldMount) return;

    const handleHashChange = () => {
      if (window.location.hash === `#${id}`) {
        setShouldMount(true);
      }
    };

    window.addEventListener('hashchange', handleHashChange);

    const target = containerRef.current;
    if (!target || typeof IntersectionObserver === 'undefined') {
      setShouldMount(true);
      return () => window.removeEventListener('hashchange', handleHashChange);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldMount(true);
          observer.disconnect();
        }
      },
      { rootMargin: '50px 0px' }
    );

    observer.observe(target);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      observer.disconnect();
    };
  }, [id, shouldMount]);

  if (shouldMount) {
    return <>{children}</>;
  }

  return (
    <section
      id={id}
      ref={containerRef}
      aria-busy="true"
      className={`w-full ${minHeightClass} ${bgClass} border-t border-[#132A1E]/10 flex items-center justify-center`}
    >
      <div className="w-7 h-7 rounded-full border-2 border-[#2D6A4F]/25 border-t-[#1B4332] animate-spin" />
    </section>
  );
};
