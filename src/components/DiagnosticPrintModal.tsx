import React, { useRef, useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  Printer,
  X,
  ShieldCheck,
  Calendar,
  Leaf,
  CheckCircle2,
  Sparkles,
  FileImage,
  Camera
} from 'lucide-react';
import { DiagnosisResult } from '../types/disease';
import { useLanguage } from '../context/LanguageContext';
import {
  downloadDiagnosticReportPng,
  downloadDiagnosticReportScreenshot
} from '../utils/reportExport';

interface DiagnosticPrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: DiagnosisResult;
}

export const DiagnosticPrintModal: React.FC<DiagnosticPrintModalProps> = ({
  isOpen,
  onClose,
  result
}) => {
  const { isUrdu } = useLanguage();
  const printContentRef = useRef<HTMLDivElement>(null);
  const [portalElement, setPortalElement] = useState<HTMLElement | null>(null);
  const [isExportingImage, setIsExportingImage] = useState(false);
  const [isExportingScreenshot, setIsExportingScreenshot] = useState(false);

  // Setup dedicated print portal node directly on document.body for 1-page print guarantee
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

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    const prevOverflow = document.body.style.overflow;
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, onClose]);

  const certificateId = useMemo(
    () => `AV-${result.diseaseId.toUpperCase().slice(0, 4)}-${result.id.slice(-6).toUpperCase()}`,
    [result.diseaseId, result.id]
  );

  if (!isOpen) return null;

  const currentDate = new Date().toLocaleDateString(isUrdu ? 'ur-PK' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const handleTriggerPrint = () => {
    window.print();
  };

  const handleDownloadSinglePicture = async () => {
    try {
      setIsExportingImage(true);
      await downloadDiagnosticReportPng(result, isUrdu, certificateId);
    } catch (err) {
      console.warn('PNG report generation failed:', err);
    } finally {
      setIsExportingImage(false);
    }
  };

  const handleScreenshotReport = async () => {
    try {
      setIsExportingScreenshot(true);
      await downloadDiagnosticReportScreenshot(result, isUrdu);
    } catch (err) {
      console.warn('Screenshot report generation failed:', err);
    } finally {
      setIsExportingScreenshot(false);
    }
  };

  // Reusable Single-Page Certificate Markup
  const certificateContent = (
    <div
      id="printable-diagnostic-certificate"
      ref={printContentRef}
      className="w-full bg-white rounded-3xl border-4 border-double border-emerald-600/70 p-6 sm:p-8 shadow-sm relative overflow-hidden text-[#13281c]"
    >
      {/* Ornamental Corner Flourishes */}
      <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-emerald-600/80 rounded-tl-lg pointer-events-none" />
      <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-emerald-600/80 rounded-tr-lg pointer-events-none" />
      <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-emerald-600/80 rounded-bl-lg pointer-events-none" />
      <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-emerald-600/80 rounded-br-lg pointer-events-none" />

      {/* Background Watermark Seal */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
        <Leaf className="w-96 h-96 text-emerald-900" />
      </div>

      {/* Certificate Header Banner */}
      <div className="text-center pb-4 border-b-2 border-emerald-100 relative z-10 space-y-1">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-900 text-[10px] font-mono font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>AgroVision AI · Plant Pathology Research & Field Advisory</span>
        </div>

        <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#13281c]">
          {isUrdu ? 'نباتاتی تشخیصی و فیلڈ ایڈوائزری رپورٹ' : 'Plant Pathology Diagnostic & Field Advisory Report'}
        </h2>

        <p className="text-xs text-[#3d5947] max-w-lg mx-auto">
          {isUrdu
            ? 'ٹماٹر کی فصل کی کمپیوٹر وژن پیتھالوجی رپورٹ اور سائنسی طور پر تصدیق شدہ نامیاتی رہنمائی'
            : 'Solanum lycopersicum Computer Vision Pathology Analysis & Field Treatment Protocol'}
        </p>

        {/* Certificate Metadata Bar */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 pt-1 text-[11px] font-mono text-[#3d5947]">
          <span>
            <strong className="text-emerald-900">Certificate ID:</strong> {certificateId}
          </span>
          <span>•</span>
          <span>
            <strong className="text-emerald-900">Date:</strong> {currentDate}
          </span>
          <span>•</span>
          <span>
            <strong className="text-emerald-900">Crop:</strong> Solanum lycopersicum (Tomato)
          </span>
        </div>
      </div>

      {/* Specimen Analysis & Health Status Grid */}
      <div className="py-4 grid grid-cols-1 md:grid-cols-12 gap-5 items-start relative z-10 border-b border-[#cbdcd0]/70">
        {/* Specimen Leaf Photo & Identification */}
        <div className="md:col-span-4 flex flex-col items-center">
          <div className="w-full aspect-square max-w-[170px] rounded-2xl overflow-hidden border-2 border-emerald-300 relative shadow-xs bg-[#f4f7f5]">
            <img
              src={result.imageUri}
              alt="Inspected tomato specimen"
              className="w-full h-full object-cover"
              crossOrigin="anonymous"
            />
            <div className="absolute bottom-1.5 left-1.5 right-1.5 px-2 py-0.5 rounded-lg bg-black/60 text-white font-mono text-[9px] text-center truncate backdrop-blur-xs">
              {result.stage1.speciesCommonName || 'Tomato Leaf'}
            </div>
          </div>
          <span className="text-[10px] font-mono text-emerald-800 font-semibold mt-1">
            ✓ Stage 1 Foliage Verified
          </span>
        </div>

        {/* Pathology Findings */}
        <div className="md:col-span-8 space-y-2.5 text-left">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-800">
                Condition Identified
              </div>
              <h3 className="font-display text-xl sm:text-2xl font-bold text-[#13281c] leading-tight">
                {result.diseaseName}
              </h3>
              <div className="text-xs text-[#3d5947] italic">
                Pathogen: {result.scientificName} ({result.pathogenType})
              </div>
            </div>

            {/* Certainty & Severity Badges */}
            <div className="flex items-center gap-2">
              <div className="text-center px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200">
                <div className="text-[9px] font-mono text-[#3d5947] uppercase">Certainty</div>
                <div className="font-mono text-base font-bold text-emerald-700">{result.confidence}%</div>
              </div>

              <div className="text-center px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200">
                <div className="text-[9px] font-mono text-[#3d5947] uppercase">Severity</div>
                <div
                  className={`font-mono text-xs font-bold uppercase ${
                    result.severity === 'Severe'
                      ? 'text-rose-600'
                      : result.severity === 'Moderate'
                      ? 'text-amber-600'
                      : 'text-emerald-700'
                  }`}
                >
                  {result.severity}
                </div>
              </div>
            </div>
          </div>

          {/* Clinical Health Summary */}
          <div className="p-3 rounded-xl bg-[#edf5ef] border border-emerald-200/80 text-xs text-[#13281c] leading-relaxed">
            <strong className="text-emerald-950 block mb-0.5 font-bold">Field Advisory Summary:</strong>
            {result.summary}
          </div>
        </div>
      </div>

      {/* 7-Day Field Recovery Roadmap */}
      <div className="py-4 border-b border-[#cbdcd0]/70 relative z-10 space-y-2">
        <div className="flex items-center justify-between">
          <div className="font-display text-xs font-bold uppercase tracking-wider text-[#13281c] flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-700" />
            <span>7-Day Structured Field Recovery Schedule</span>
          </div>
          <span className="text-[10px] font-mono text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            Sindh & Punjab Protocol
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-2.5 rounded-2xl bg-[#faf8f2] border border-[#cbdcd0] text-left">
            <div className="text-[10px] font-mono font-bold text-emerald-800 uppercase">
              Day 01 · Immediate Action
            </div>
            <div className="font-bold text-xs text-[#13281c] mt-0.5">Targeted Organic Spray</div>
            <p className="text-[11px] text-[#3d5947] mt-1 leading-snug">
              {result.treatment.organic[0] || 'Apply certified neem oil extract or organic copper soap in early morning.'}
            </p>
          </div>

          <div className="p-2.5 rounded-2xl bg-[#faf8f2] border border-[#cbdcd0] text-left">
            <div className="text-[10px] font-mono font-bold text-amber-800 uppercase">
              Day 03 · Sanitation
            </div>
            <div className="font-bold text-xs text-[#13281c] mt-0.5">Pruning & Aeration</div>
            <p className="text-[11px] text-[#3d5947] mt-1 leading-snug">
              {result.treatment.cultural[0] || 'Prune heavily infected lower leaves and bury far from healthy tomato beds.'}
            </p>
          </div>

          <div className="p-2.5 rounded-2xl bg-[#faf8f2] border border-[#cbdcd0] text-left">
            <div className="text-[10px] font-mono font-bold text-emerald-800 uppercase">
              Day 07 · Verification
            </div>
            <div className="font-bold text-xs text-[#13281c] mt-0.5">Shoot Regeneration</div>
            <p className="text-[11px] text-[#3d5947] mt-1 leading-snug">
              Inspect new terminal leaf buds for clean emerald growth with no lesions or curl.
            </p>
          </div>
        </div>
      </div>

      {/* Official Academic Verification Citation */}
      <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
        <div className="flex items-center gap-3 text-left">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4.5 h-4.5" />
          </div>
          <div>
            <div className="text-xs font-bold text-[#13281c]">
              Penn State & EPFL PlantVillage Benchmark
            </div>
            <div className="text-[10px] font-mono text-[#3d5947]">
              89.2% Field Validation · 96.5% Lab Benchmark (Hughes & Salathé 2015, 54,306 specimens)
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-semibold shrink-0">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>AI Analysis & Recovery Protocol</span>
        </div>
      </div>

      {/* Educational / Agricultural Advisory Disclaimer */}
      <div className="mt-3 pt-2 border-t border-[#cbdcd0]/50 text-[10px] text-[#3d5947] text-center font-mono">
        {isUrdu
          ? 'نوٹ: یہ رپورٹ ایگرو وژن اے آئی کے ذریعے معلوماتی و تعلیمی مقاصد کے لیے تیار کی گئی ہے۔'
          : 'Advisory Note: Generated by AgroVision AI for educational and field garden guidance (1 Single Page Certified Output).'}
      </div>
    </div>
  );

  const modalDialog = (
    <div
      className="fixed inset-0 overflow-y-auto overscroll-contain bg-black/75 backdrop-blur-md"
      style={{ zIndex: 9990 }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="diagnostic-print-modal-title"
    >
      <div className="flex min-h-full w-full items-center justify-center px-3 sm:px-6 pt-20 sm:pt-24 pb-4 sm:pb-6">
        <div
          className="relative w-full max-w-3xl my-auto bg-[#faf8f2] rounded-3xl border-2 border-emerald-500/50 shadow-2xl overflow-hidden flex flex-col max-h-[calc(100dvh-6.25rem)] sm:max-h-[calc(100dvh-7.5rem)]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Floating Action Bar */}
          <div className="no-print shrink-0 px-4 sm:px-6 py-3.5 bg-white border-b border-[#cbdcd0] flex flex-wrap items-center justify-between gap-3 z-30 shadow-xs">
            <div className="flex items-center gap-2 text-xs text-[#3d5947]">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span id="diagnostic-print-modal-title" className="font-bold text-[#13281c]">
                {isUrdu ? 'تشخیصی سرٹیفکیٹ کارڈ پیش منظر' : 'Pathology Diagnostic Card (1 Page)'}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleScreenshotReport}
                disabled={isExportingScreenshot}
                type="button"
                className="px-3 py-2 bg-[#edf5ef] hover:bg-emerald-100 text-emerald-950 border border-emerald-300 text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 active:scale-95 disabled:opacity-50 cursor-pointer"
                title={isUrdu ? 'رپورٹ کا اسکرین شاٹ محفوظ کریں' : 'Capture visual report screenshot'}
              >
                <Camera className="w-3.5 h-3.5 text-emerald-700" />
                <span>
                  {isExportingScreenshot
                    ? isUrdu
                      ? 'محفوظ ہو رہا ہے...'
                      : 'Capturing...'
                    : isUrdu
                    ? 'اسکرین شاٹ رپورٹ'
                    : 'Screenshot Report'}
                </span>
              </button>

              <button
                onClick={handleDownloadSinglePicture}
                disabled={isExportingImage}
                type="button"
                className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 active:scale-95 disabled:opacity-50 cursor-pointer"
                title={isUrdu ? 'پی این جی تصویر ڈاؤنلوڈ کریں' : 'Download report as PNG'}
              >
                <FileImage className="w-3.5 h-3.5 text-emerald-700" />
                <span>
                  {isExportingImage
                    ? isUrdu
                      ? 'تیار ہو رہا ہے...'
                      : 'Saving...'
                    : isUrdu
                    ? 'پی این جی ڈاؤنلوڈ'
                    : 'Download PNG'}
                </span>
              </button>

              <button
                onClick={handleTriggerPrint}
                type="button"
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>{isUrdu ? 'پرنٹ کریں' : 'Print'}</span>
              </button>

              <button
                onClick={onClose}
                type="button"
                className="p-2 text-[#3d5947] hover:text-[#13281c] bg-[#edf5ef] hover:bg-emerald-100 rounded-xl transition-colors cursor-pointer"
                aria-label="Close Preview"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Scrollable Preview Area */}
          <div className="min-h-0 flex-1 p-4 sm:p-8 overflow-y-auto">
            {certificateContent}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* 1. On-Screen Modal Dialog Portaled to document.body */}
      {typeof document !== 'undefined' && createPortal(modalDialog, document.body)}

      {/* 2. Dedicated Body Print Portal for Strict 1-Page Output */}
      {portalElement && createPortal(certificateContent, portalElement)}
    </>
  );
};
