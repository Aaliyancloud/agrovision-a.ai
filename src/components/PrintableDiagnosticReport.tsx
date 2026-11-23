import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Calendar, CheckCircle2, Droplets, FlaskConical, Leaf, ShieldCheck, Sprout } from 'lucide-react';
import { DiagnosisResult } from '../types/disease';
import { useLanguage } from '../context/LanguageContext';

interface PrintableDiagnosticReportProps {
  result: DiagnosisResult;
}

/**
 * Print-friendly CSS PDF export portal for DiagnosticStudio's "Download Report" button.
 * Renders cleanly into #agrovision-print-portal (hidden on screen, formatted A4 layout under @media print).
 */
export const PrintableDiagnosticReport: React.FC<PrintableDiagnosticReportProps> = ({ result }) => {
  const { isUrdu } = useLanguage();
  const [portalElement, setPortalElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    let portalNode = document.getElementById('agrovision-print-portal');
    if (!portalNode) {
      portalNode = document.createElement('div');
      portalNode.id = 'agrovision-print-portal';
      document.body.appendChild(portalNode);
    }
    setPortalElement(portalNode);

    return () => {
      if (portalNode) {
        portalNode.innerHTML = '';
      }
    };
  }, []);

  if (!portalElement) return null;

  const formattedDate = new Date(result.analysisTimestamp || Date.now()).toLocaleDateString(
    isUrdu ? 'ur-PK' : 'en-US',
    {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }
  );

  const reportMarkup = (
    <article
      id="printable-pdf-report"
      dir={isUrdu ? 'rtl' : 'ltr'}
      className="w-full bg-white text-[#13281c] font-sans space-y-4"
    >
      {/* Letterhead */}
      <header className="pb-3 border-b-2 border-emerald-700 flex items-start justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-800">
            <Leaf className="w-3.5 h-3.5 text-emerald-700" />
            <span>AgroVision AI · Solanum lycopersicum Pathology Report</span>
          </div>
          <h1 className="font-display text-2xl font-bold text-[#13281c] mt-1">
            {isUrdu ? 'ٹماٹر کے پتے کی تشخیص اور مکمل علاجی رپورٹ' : 'Tomato Leaf Disease Diagnosis & Treatment Plan'}
          </h1>
          <p className="text-xs text-[#3d5947] mt-0.5">
            {isUrdu
              ? 'کمپیوٹر وژن پیتھالوجی تجزیہ، مٹی کے سینسر کا سیاق و سباق، اور کسان بحالی شیڈول'
              : 'AI Pathology Assessment, Agronomic Observations & Structured Recovery Protocol'}
          </p>
        </div>

        <div className="text-right font-mono text-[10px] text-[#3d5947] bg-[#edf5ef] px-3 py-2 rounded-lg border border-[#cbdcd0] shrink-0">
          <div>
            <strong className="text-emerald-950">Report ID:</strong> {result.id.toUpperCase()}
          </div>
          <div>
            <strong className="text-emerald-950">Date:</strong> {formattedDate}
          </div>
          <div>
            <strong className="text-emerald-950">Verification:</strong> Stage 1 Tomato Verified
          </div>
        </div>
      </header>

      {/* Primary Pathology Findings + Specimen */}
      <section className="print-keep-together grid grid-cols-12 gap-4 items-center bg-[#faf8f2] p-3.5 rounded-xl border border-[#cbdcd0]">
        <div className="col-span-3 flex flex-col items-center">
          <div className="w-28 h-28 rounded-xl overflow-hidden border-2 border-emerald-600/40 bg-white">
            <img
              src={result.imageUri}
              alt={result.diseaseName}
              className="w-full h-full object-cover"
              crossOrigin="anonymous"
            />
          </div>
          <span className="mt-1 text-[9px] font-mono font-semibold text-emerald-800">
            {result.stage1.speciesCommonName || 'Tomato Specimen'}
          </span>
        </div>

        <div className="col-span-9 space-y-2">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-[10px] font-mono uppercase font-bold tracking-wider text-emerald-800">
                {isUrdu ? 'شناخت شدہ حالت' : 'Condition Identified'} · {result.pathogenType}
              </div>
              <h2 className="font-display text-xl font-bold text-[#13281c]">{result.diseaseName}</h2>
              <div className="text-xs text-[#3d5947] italic">
                {isUrdu ? 'سائنسی نام: ' : 'Pathogen / Scientific Name: '}
                {result.scientificName}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <div className="px-2.5 py-1.5 rounded-lg bg-white border border-emerald-300 text-center">
                <div className="text-[9px] font-mono uppercase text-[#3d5947]">
                  {isUrdu ? 'یقین' : 'Certainty'}
                </div>
                <div className="font-mono text-base font-bold text-emerald-800">{result.confidence}%</div>
              </div>
              <div className="px-2.5 py-1.5 rounded-lg bg-white border border-[#cbdcd0] text-center">
                <div className="text-[9px] font-mono uppercase text-[#3d5947]">
                  {isUrdu ? 'شدت' : 'Severity'}
                </div>
                <div className="font-mono text-xs font-bold uppercase text-[#13281c]">
                  {result.severity}
                </div>
              </div>
              <div className="px-2.5 py-1.5 rounded-lg bg-white border border-[#cbdcd0] text-center">
                <div className="text-[9px] font-mono uppercase text-[#3d5947]">
                  {isUrdu ? 'متاثرہ رقبہ' : 'Coverage'}
                </div>
                <div className="font-mono text-xs font-bold text-[#13281c]">
                  {result.lesionCoveragePercent}%
                </div>
              </div>
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-[#edf5ef] border border-emerald-200 text-xs leading-relaxed text-[#13281c]">
            <strong className="text-emerald-950">
              {isUrdu ? 'تشخیصی خلاصہ: ' : 'Clinical Summary: '}
            </strong>
            {result.summary}
          </div>
        </div>
      </section>

      {/* Active Soil Sensor Telemetry (if enabled) */}
      {result.sensorInsights && (
        <section className="print-keep-together p-3 rounded-xl bg-white border border-emerald-300 space-y-1.5">
          <div className="flex items-center justify-between text-xs font-bold text-[#13281c]">
            <span className="flex items-center gap-1.5">
              <Droplets className="w-3.5 h-3.5 text-emerald-700" />
              <span>{isUrdu ? 'مٹی کے سینسر کا تشخیصی سیاق و سباق' : 'Smart Soil Sensor Context'}</span>
            </span>
            <span className="font-mono text-[10px] text-emerald-900">
              {result.sensorInsights.moistureEnabled && `Moisture: ${result.sensorInsights.moisturePercent}% VWC `}
              {result.sensorInsights.moistureEnabled && result.sensorInsights.phEnabled && '· '}
              {result.sensorInsights.phEnabled && `Soil pH: ${result.sensorInsights.soilPh?.toFixed(1)} `}
              · Risk: {result.sensorInsights.riskLevel}
            </span>
          </div>
          <p className="text-[11px] text-[#3d5947] leading-snug">
            {isUrdu ? result.sensorInsights.urduContextSummary : result.sensorInsights.contextSummary}
          </p>
          <p className="text-[11px] text-[#13281c] leading-snug">
            <strong>{isUrdu ? 'مٹی کی اصلاح: ' : 'Soil Adjustment: '}</strong>
            {isUrdu ? result.sensorInsights.urduAgronomicAdjustment : result.sensorInsights.agronomicAdjustment}
          </p>
        </section>
      )}

      {/* Key Observations */}
      <section className="print-keep-together space-y-1.5">
        <h3 className="font-display text-xs font-bold uppercase tracking-wider text-emerald-900">
          {isUrdu ? 'پتے کے اہم مشاہدات' : 'Key Diagnostic Observations'}
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {result.keyObservations.map((obs, idx) => (
            <div
              key={idx}
              className="p-2 rounded-lg bg-[#faf8f2] border border-[#cbdcd0] text-[11px] text-[#13281c] leading-snug"
            >
              • {obs}
            </div>
          ))}
        </div>
      </section>

      {/* Complete Treatment Plan */}
      <section className="space-y-2">
        <h3 className="font-display text-xs font-bold uppercase tracking-wider text-emerald-900">
          {isUrdu ? 'مکمل علاجی اور حفاظتی لائحہ عمل' : 'Recommended Treatment & Management Plan'}
        </h3>

        <div className="grid grid-cols-2 gap-2.5">
          {/* Organic */}
          <div className="print-keep-together p-3 rounded-xl bg-[#faf8f2] border border-[#cbdcd0] space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#13281c]">
              <Sprout className="w-3.5 h-3.5 text-emerald-700" />
              <span>{isUrdu ? '1. نامیاتی علاج (Organic Remedies)' : '1. Organic Treatment'}</span>
            </div>
            <ul className="text-[11px] text-[#3d5947] space-y-1 list-disc list-inside leading-snug">
              {result.treatment.organic.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>

          {/* Cultural */}
          <div className="print-keep-together p-3 rounded-xl bg-[#faf8f2] border border-[#cbdcd0] space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#13281c]">
              <Droplets className="w-3.5 h-3.5 text-teal-700" />
              <span>{isUrdu ? '2. پانی، ہوا اور کھیتی کی دیکھ بھال' : '2. Cultural & Water Care'}</span>
            </div>
            <ul className="text-[11px] text-[#3d5947] space-y-1 list-disc list-inside leading-snug">
              {result.treatment.cultural.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>

          {/* Chemical / Targeted */}
          <div className="print-keep-together p-3 rounded-xl bg-[#faf8f2] border border-[#cbdcd0] space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#13281c]">
              <FlaskConical className="w-3.5 h-3.5 text-amber-700" />
              <span>{isUrdu ? '3. کیمیائی و ہدف شدہ کنٹرول' : '3. Targeted / Chemical Control'}</span>
            </div>
            <ul className="text-[11px] text-[#3d5947] space-y-1 list-disc list-inside leading-snug">
              {result.treatment.chemical.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>

          {/* Prevention */}
          <div className="print-keep-together p-3 rounded-xl bg-[#faf8f2] border border-[#cbdcd0] space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#13281c]">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-800" />
              <span>{isUrdu ? '4. طویل مدتی حفاظتی اقدامات' : '4. Long-Term Prevention'}</span>
            </div>
            <ul className="text-[11px] text-[#3d5947] space-y-1 list-disc list-inside leading-snug">
              {result.treatment.prevention.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 7-Day Recovery Roadmap */}
      <section className="print-keep-together p-3 rounded-xl bg-white border border-[#cbdcd0] space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-[#13281c]">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-emerald-700" />
            <span>{isUrdu ? '7 روزہ بحالی شیڈول' : '7-Day Structured Field Recovery Schedule'}</span>
          </span>
          <span className="font-mono text-[10px] text-emerald-800">AgroVision Protocol</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="p-2 rounded-lg bg-[#faf8f2] border border-[#cbdcd0]/80">
            <div className="text-[9px] font-mono font-bold text-emerald-800 uppercase">Day 01</div>
            <div className="font-bold text-[11px] text-[#13281c]">
              {isUrdu ? 'نامیاتی اسپرے' : 'Targeted Spray'}
            </div>
            <p className="text-[10px] text-[#3d5947] mt-0.5 leading-snug">
              {result.treatment.organic[0] ||
                'Apply organic copper or neem extract at dusk to limit spore germination.'}
            </p>
          </div>
          <div className="p-2 rounded-lg bg-[#faf8f2] border border-[#cbdcd0]/80">
            <div className="text-[9px] font-mono font-bold text-amber-800 uppercase">Day 03</div>
            <div className="font-bold text-[11px] text-[#13281c]">
              {isUrdu ? 'جھلسے پتے تلف کریں' : 'Sanitation Pruning'}
            </div>
            <p className="text-[10px] text-[#3d5947] mt-0.5 leading-snug">
              {result.treatment.cultural[0] ||
                'Prune heavily spotted lower leaves and sanitize shears between plants.'}
            </p>
          </div>
          <div className="p-2 rounded-lg bg-[#faf8f2] border border-[#cbdcd0]/80">
            <div className="text-[9px] font-mono font-bold text-emerald-800 uppercase">Day 07</div>
            <div className="font-bold text-[11px] text-[#13281c]">
              {isUrdu ? 'نئی کونپلوں کا معائنہ' : 'Shoot Verification'}
            </div>
            <p className="text-[10px] text-[#3d5947] mt-0.5 leading-snug">
              {result.treatment.prevention[0] ||
                'Inspect new terminal shoots for clean green vigor with zero lesion spread.'}
            </p>
          </div>
        </div>
      </section>

      {/* Footer Seal */}
      <footer className="pt-2 border-t border-[#cbdcd0] flex items-center justify-between text-[10px] font-mono text-[#3d5947]">
        <span className="flex items-center gap-1 text-emerald-900 font-semibold">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
          <span>AgroVision AI · PlantVillage Benchmark Advisory</span>
        </span>
        <span>
          {isUrdu
            ? 'تعلیمی و زرعی رہنمائی رپورٹ'
            : 'Generated via AgroVision AI Print-to-PDF Engine'}
        </span>
      </footer>
    </article>
  );

  return createPortal(reportMarkup, portalElement);
};
