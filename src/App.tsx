import React, { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { SensorProvider } from './context/SensorContext';
import { MotionProvider } from './context/MotionContext';
import { ScanHistoryProvider } from './context/ScanHistoryContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Footer } from './components/Footer';
import { ScrollToTopButton } from './components/ScrollToTopButton';
import { FloatingLeavesBackground } from './components/FloatingLeavesBackground';
import { AnimatedFavicon } from './components/AnimatedFavicon';
import { InitialSiteLoader } from './components/InitialSiteLoader';
import { DeferredSection } from './components/DeferredSection';
import { SmartSensorSection } from './components/SmartSensorSection';
import { OfflineIndicator } from './components/OfflineIndicator';
import type { DiagnosticExternalAction } from './components/DiagnosticStudio';
import type { MobileAppTab } from './mobile/MobileAppView';

const AgriculturalImpact = lazy(() =>
  import('./components/AgriculturalImpact').then((m) => ({ default: m.AgriculturalImpact }))
);
const WeatherAlertCard = lazy(() =>
  import('./components/WeatherAlertCard').then((m) => ({ default: m.WeatherAlertCard }))
);
const LeafAnatomySection = lazy(() =>
  import('./components/LeafAnatomySection').then((m) => ({ default: m.LeafAnatomySection }))
);
const DiseaseLibrary = lazy(() =>
  import('./components/DiseaseLibrary').then((m) => ({ default: m.DiseaseLibrary }))
);
const DiagnosticStudio = lazy(() =>
  import('./components/DiagnosticStudio').then((m) => ({ default: m.DiagnosticStudio }))
);
const NeuralPipelineSection = lazy(() =>
  import('./components/NeuralPipelineSection').then((m) => ({ default: m.NeuralPipelineSection }))
);
const ExhibitionHub = lazy(() =>
  import('./components/ExhibitionHub').then((m) => ({ default: m.ExhibitionHub }))
);
const ProjectCreditsSection = lazy(() =>
  import('./components/ProjectCreditsSection').then((m) => ({ default: m.ProjectCreditsSection }))
);
const InvestorsShowcaseSection = lazy(() =>
  import('./components/InvestorsShowcaseSection').then((m) => ({ default: m.InvestorsShowcaseSection }))
);
const MobileAppView = lazy(() =>
  import('./mobile/MobileAppView').then((m) => ({ default: m.MobileAppView }))
);

function SectionPlaceholder({ id, minHeightClass = 'py-16' }: { id?: string; minHeightClass?: string }) {
  return (
    <div id={id} className={`w-full ${minHeightClass} flex items-center justify-center bg-[#faf8f2]`}>
      <div className="w-7 h-7 rounded-full border-2 border-emerald-600/30 border-t-emerald-700 animate-spin" />
    </div>
  );
}

function isMobileAppUrl(): { isAppMode: boolean; tab: MobileAppTab; action: 'camera' | null } {
  if (typeof window === 'undefined') {
    return { isAppMode: false, tab: 'home', action: null };
  }
  const url = new URL(window.location.href);
  const pathNormalized = url.pathname.replace(/\/+$/, '');
  const modeParam = url.searchParams.get('mode');
  const tabParam = url.searchParams.get('tab');
  const actionParam = url.searchParams.get('action');

  const isAppMode = pathNormalized === '/app' || modeParam === 'app';
  const validTabs: MobileAppTab[] = ['home', 'scan', 'care', 'history'];
  const tab: MobileAppTab = validTabs.includes(tabParam as MobileAppTab)
    ? (tabParam as MobileAppTab)
    : actionParam === 'camera'
    ? 'scan'
    : 'home';

  return {
    isAppMode,
    tab,
    action: actionParam === 'camera' ? 'camera' : null
  };
}

function MainAppContent() {
  const { isUrdu } = useLanguage();
  const [forceLoadDiagnostic, setForceLoadDiagnostic] = useState(false);
  const [diagnosticAction, setDiagnosticAction] = useState<DiagnosticExternalAction | null>(null);
  const actionNonceRef = useRef(0);
  const [appRouteState, setAppRouteState] = useState(() => isMobileAppUrl());

  useEffect(() => {
    const syncRoute = () => setAppRouteState(isMobileAppUrl());
    const handleOpenAppMode = () => {
      const url = new URL(window.location.href);
      url.searchParams.set('mode', 'app');
      window.history.pushState({}, '', url.pathname + url.search);
      setAppRouteState({ isAppMode: true, tab: 'home', action: null });
    };

    window.addEventListener('popstate', syncRoute);
    window.addEventListener('agrovision-open-app', handleOpenAppMode);
    return () => {
      window.removeEventListener('popstate', syncRoute);
      window.removeEventListener('agrovision-open-app', handleOpenAppMode);
    };
  }, []);

  if (appRouteState.isAppMode) {
    return (
      <ScanHistoryProvider>
        <Suspense fallback={<SectionPlaceholder minHeightClass="min-h-screen" />}>
          <MobileAppView
            initialTab={appRouteState.tab}
            initialAction={appRouteState.action}
            onExitToWebsite={() => {
              const url = new URL(window.location.href);
              url.searchParams.delete('mode');
              url.searchParams.delete('tab');
              url.searchParams.delete('action');
              const targetPath = url.pathname === '/app' ? '/' : url.pathname;
              window.history.pushState({}, '', targetPath + url.search);
              setAppRouteState({ isAppMode: false, tab: 'home', action: null });
            }}
          />
        </Suspense>
      </ScanHistoryProvider>
    );
  }

  const scrollToDiagnostic = () => {
    setForceLoadDiagnostic(true);
    requestAnimationFrame(() => {
      const el = document.getElementById('diagnostic');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    });
  };

  const scrollToWhyLeaves = () => {
    const el = document.getElementById('why-leaves');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenCamera = () => {
    actionNonceRef.current += 1;
    setForceLoadDiagnostic(true);
    setDiagnosticAction({ type: 'camera', nonce: actionNonceRef.current });
    scrollToDiagnostic();
  };

  const handleDirectUploadFile = (file: File) => {
    actionNonceRef.current += 1;
    setForceLoadDiagnostic(true);
    setDiagnosticAction({ type: 'upload', file, nonce: actionNonceRef.current });
    scrollToDiagnostic();
  };

  return (
    <div
      id="top"
      className={`min-h-screen bg-[#faf8f2] text-[#13281c] flex flex-col font-sans selection:bg-emerald-200 selection:text-emerald-950 transition-colors relative overflow-x-clip ${
        isUrdu ? 'font-urdu' : ''
      }`}
    >
      <InitialSiteLoader />
      <AnimatedFavicon />

      {/* Autonomous Falling & Breezing Botanical Leaves */}
      <FloatingLeavesBackground />

      <Navbar onScanClick={scrollToDiagnostic} />

      <main className="relative z-0 flex-1 w-full max-w-full overflow-x-clip pt-16 sm:pt-18">
        {/* 1. Classic Botanical Hero with Full Interactive 3D Tomato Plant */}
        <Hero
          onOpenCameraClick={handleOpenCamera}
          onDirectUploadFile={handleDirectUploadFile}
          onScanClick={scrollToDiagnostic}
          onExploreTechClick={scrollToWhyLeaves}
        />

        {/* 2. Why Leaves Matter */}
        <Suspense fallback={<SectionPlaceholder id="why-leaves" minHeightClass="min-h-[600px]" />}>
          <AgriculturalImpact />
        </Suspense>

        {/* 3. Tomato Garden Weather & Blight Microclimate Risk (placed up high) */}
        <Suspense fallback={<SectionPlaceholder id="weather" />}>
          <section className="w-full py-10 sm:py-14 bg-[#faf8f2] border-t border-[#cbdcd0]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              <WeatherAlertCard />
            </div>
          </section>
        </Suspense>

        {/* 4. Inside the Tomato Leaf */}
        <DeferredSection id="inside-leaf" minHeightClass="min-h-[620px]">
          <Suspense fallback={<SectionPlaceholder id="inside-leaf" />}>
            <LeafAnatomySection onScanClick={scrollToDiagnostic} />
          </Suspense>
        </DeferredSection>

        {/* 5. Smart Sensor Integration (Moisture & Soil pH Telemetry above Care Library & Scanner) */}
        <SmartSensorSection onScanClick={scrollToDiagnostic} />

        {/* 6. Tomato Care Library */}
        <Suspense fallback={<SectionPlaceholder id="care-library" />}>
          <DiseaseLibrary onSelectForDiagnosis={scrollToDiagnostic} />
        </Suspense>

        {/* 7. AI Leaf Scanner (Diagnostic Studio + PDF Download Report) — right after Care Library */}
        <DeferredSection
          id="diagnostic"
          forceLoad={forceLoadDiagnostic}
          minHeightClass="min-h-[720px]"
          bgClass="bg-[#f4f1e8]"
        >
          <Suspense fallback={<SectionPlaceholder id="diagnostic" />}>
            <DiagnosticStudio
              externalAction={diagnosticAction}
              onExternalActionHandled={() => setDiagnosticAction(null)}
            />
          </Suspense>
        </DeferredSection>

        {/* 8. Understanding Tomato Leaf Detection with Precision (Neural Pipeline) */}
        <Suspense fallback={<SectionPlaceholder id="how-ai-sees" />}>
          <NeuralPipelineSection />
        </Suspense>

        {/* 9. Plant Care & Questions */}
        <Suspense fallback={<SectionPlaceholder id="questions" />}>
          <ExhibitionHub />
        </Suspense>

        {/* 10. Meet the Minds (Project Credits) & Investors Train-Loop */}
        <Suspense fallback={<SectionPlaceholder id="project-credits" />}>
          <ProjectCreditsSection />
          <InvestorsShowcaseSection />
        </Suspense>
      </main>

      <Footer />
      <ScrollToTopButton />
      <OfflineIndicator />
    </div>
  );
}

export default function App() {
  return (
    <MotionProvider>
      <LanguageProvider>
        <SensorProvider>
          <MainAppContent />
        </SensorProvider>
      </LanguageProvider>
    </MotionProvider>
  );
}
